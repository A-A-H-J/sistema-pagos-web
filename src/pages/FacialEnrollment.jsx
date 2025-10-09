import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import { Camera, Loader, CheckCircle, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
    { instruction: 'Mire directamente a la cámara', label: 'Rostro Frontal' },
    { instruction: 'Gire lentamente su cabeza hacia la izquierda', label: 'Perfil Izquierdo' },
    { instruction: 'Ahora, gire lentamente su cabeza hacia la derecha', label: 'Perfil Derecho' }
];

const FacialEnrollment = () => {
    const { auth, checkForFaceId } = useAuth();
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [currentStep, setCurrentStep] = useState(0);
    const [capturedImages, setCapturedImages] = useState([]);

    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            setCapturedImages(prev => [...prev, imageSrc]);
            if (currentStep < STEPS.length - 1) {
                setCurrentStep(prev => prev + 1);
            }
        }
    };

    const registerFaces = useCallback(async () => {
        if (capturedImages.length !== STEPS.length) {
            setError("Debes capturar todas las imágenes requeridas.");
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const files = await Promise.all(
                capturedImages.map(async (imageSrc, index) => {
                    const blob = await fetch(imageSrc).then(res => res.blob());
                    return new File([blob], `face_${index}.jpg`, { type: "image/jpeg" });
                })
            );

            await apiService.usuarios.registrarRostro(auth.userId, files);
            
            const enrollmentSuccessful = await checkForFaceId(auth.userId); 

            if (enrollmentSuccessful) {
                navigate(auth.userRole === 'ADMINISTRADOR' ? '/admin' : '/student');
            } else {
                setError("No se pudo confirmar el registro. Por favor, intenta iniciar sesión de nuevo.");
            }

        } catch (err) {
            console.error("Error al registrar los rostros:", err);
            setError(err.response?.data?.message || "No se pudieron registrar los rostros. Asegúrate de que las imágenes sean de buena calidad.");
        } finally {
            setIsLoading(false);
        }
    }, [capturedImages, auth.userId, auth.userRole, checkForFaceId, navigate]);

    const resetProcess = () => {
        setCapturedImages([]);
        setCurrentStep(0);
        setError('');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro Facial de Seguridad</h1>
                <p className="text-gray-600 mb-6">Para una mayor precisión, capturaremos tu rostro desde tres ángulos diferentes.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Columna de la cámara */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-full h-60 bg-gray-200 rounded-lg overflow-hidden shadow-inner">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ facingMode: "user", width: 480, height: 360 }}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {currentStep < STEPS.length && (
                            <button
                                onClick={handleCapture}
                                className="w-full max-w-xs bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
                            >
                                <Camera className="w-5 h-5" />
                                <span>Capturar ({currentStep + 1}/{STEPS.length})</span>
                            </button>
                        )}
                    </div>
                    
                    {/* Columna de instrucciones y previsualizaciones */}
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <p className="text-lg font-semibold text-gray-800 mb-4">
                                Paso {currentStep + 1}: {STEPS[currentStep]?.instruction || '¡Listo para enviar!'}
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {STEPS.map((step, index) => (
                                    <div key={index} className="flex flex-col items-center gap-1">
                                        <div className={`w-full h-20 rounded-md flex items-center justify-center ${capturedImages[index] ? 'border-2 border-green-500' : 'bg-gray-200'}`}>
                                            {capturedImages[index] ? (
                                                <img src={capturedImages[index]} alt={step.label} className="w-full h-full object-cover rounded-md" />
                                            ) : (
                                                <Camera className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500">{step.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {capturedImages.length === STEPS.length && (
                            <div className="mt-4 space-y-2">
                                <button
                                    onClick={registerFaces}
                                    disabled={isLoading}
                                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                    <span>{isLoading ? 'Registrando...' : 'Finalizar Registro'}</span>
                                </button>
                                <button
                                    onClick={resetProcess}
                                    disabled={isLoading}
                                    className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Volver a tomar</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                <p className="text-xs text-gray-500 mt-4">Asegúrate de tener buena iluminación y seguir las instrucciones.</p>
            </div>
        </div>
    );
};

export default FacialEnrollment;