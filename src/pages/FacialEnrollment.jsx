import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import { Camera, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FacialEnrollment = () => {
    const { auth, checkForFaceId } = useAuth();
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const captureAndRegister = useCallback(async () => {
        setError('');
        setIsLoading(true);
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            setError("No se pudo capturar la imagen. Por favor, asegúrate de permitir el acceso a la cámara.");
            setIsLoading(false);
            return;
        }

        const blob = await fetch(imageSrc).then(res => res.blob());
        const file = new File([blob], "face.jpg", { type: "image/jpeg" });

        try {
            await apiService.usuarios.registrarRostro(auth.userId, file);
            
            // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
            // Ahora le pasamos el auth.userId a la función de verificación.
            const enrollmentSuccessful = await checkForFaceId(auth.userId); 

            if (enrollmentSuccessful) {
                if (auth.userRole === 'ADMINISTRADOR') {
                    navigate('/admin');
                } else {
                    navigate('/student');
                }
            } else {
                setError("No se pudo confirmar el registro. Por favor, intenta iniciar sesión de nuevo.");
            }

        } catch (err) {
            console.error("Error al registrar el rostro:", err);
            setError(err.response?.data?.message || "No se pudo registrar el rostro. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    }, [webcamRef, auth.userId, auth.userRole, checkForFaceId, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Paso de Seguridad Adicional</h1>
                <p className="text-gray-600 mb-6">Para proteger tu cuenta y autorizar pagos, necesitamos registrar tu rostro. Este es un paso único.</p>

                <div className="flex flex-col items-center gap-4">
                    <div className="w-80 h-60 bg-gray-200 rounded-lg overflow-hidden shadow-inner">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={320}
                            height={240}
                            videoConstraints={{ facingMode: "user" }}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <button
                        onClick={captureAndRegister}
                        disabled={isLoading}
                        className="w-full max-w-xs bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                            <Camera className="w-5 h-5" />
                        )}
                        <span>{isLoading ? 'Procesando...' : 'Registrar mi Rostro y Continuar'}</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-2">Asegúrate de tener buena iluminación y que tu rostro esté centrado.</p>
                </div>
            </div>
        </div>
    );
};

export default FacialEnrollment;