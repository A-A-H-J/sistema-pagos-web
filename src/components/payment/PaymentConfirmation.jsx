import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';
import Webcam from 'react-webcam';
import { Camera, CheckCircle, XCircle, Loader } from 'lucide-react';

const PaymentConfirmation = () => {
    const { auth } = useAuth();
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const webcamRef = useRef(null);

    const fetchPending = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiService.transacciones.getPagosPendientes(auth.userId);
            setPending(response.data);
        } catch (err) {
            setError("No se pudieron cargar los pagos pendientes.");
        } finally {
            setLoading(false);
        }
    }, [auth.userId]);

    useEffect(() => {
        fetchPending();
    }, [fetchPending]);

    const handleConfirm = async () => {
        setError('');
        setSuccess('');
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            setError("No se pudo capturar la imagen. Intenta de nuevo.");
            return;
        }

        const blob = await fetch(imageSrc).then(res => res.blob());
        const file = new File([blob], "face.jpg", { type: "image/jpeg" });

        try {
            await apiService.qr.confirmPayment(selected.idTransaccion, file);
            setSuccess("¡Pago realizado con éxito!");
            setSelected(null);
            fetchPending(); // Refrescar la lista de pendientes
        } catch (err) {
            setError(err.response?.data || "Verificación facial fallida. El pago no fue realizado.");
        }
    };

    if (selected) {
        return (
            <div className="p-8 max-w-md mx-auto text-center">
                <h3 className="text-xl font-bold mb-2">Confirmar Pago</h3>
                <p>Solicitado por: <span className="font-semibold">{selected.realizadoPor.primerNombre} {selected.realizadoPor.primerApellido}</span></p>
                <p>Monto: <span className="font-bold text-2xl text-blue-600">${selected.monto.toFixed(2)}</span></p>
                <p className="text-sm text-gray-500 mb-4">Descripción: {selected.descripcion}</p>

                {error && <div className="p-3 my-2 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

                <div className="flex flex-col items-center gap-4 my-4">
                    <p className="font-semibold">Centra tu rostro en la cámara</p>
                    <div className="w-64 h-48 bg-gray-200 rounded-lg overflow-hidden">
                        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setSelected(null)} className="w-full bg-gray-500 text-white font-bold py-3 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2">
                        <XCircle size={20} /> Cancelar
                    </button>
                    <button onClick={handleConfirm} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                        <CheckCircle size={20} /> Confirmar
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-8">
            <h3 className="text-2xl font-bold mb-4">Pagos Pendientes de Aprobación</h3>
            {success && <div className="p-3 my-2 text-sm text-green-700 bg-green-100 rounded-lg">{success}</div>}
            {loading && <div className="text-center"><Loader className="animate-spin inline-block" /></div>}
            {!loading && pending.length === 0 && <p className="text-gray-500">No tienes pagos pendientes.</p>}
            <div className="space-y-4">
                {pending.map(tx => (
                    <div key={tx.idTransaccion} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold">Solicitado por: {tx.realizadoPor.primerNombre}</p>
                            <p className="text-xl font-bold">${tx.monto.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{tx.descripcion}</p>
                        </div>
                        <button onClick={() => setSelected(tx)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                            Autorizar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentConfirmation;