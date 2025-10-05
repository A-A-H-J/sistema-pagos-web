import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';
import { Loader } from 'lucide-react';

const ReceivePayment = () => {
  const { auth } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQrCode = async () => {
      if (!auth.userId) return;
      try {
        setLoading(true);
        const response = await apiService.qr.generateQrCode(auth.userId);
        const url = URL.createObjectURL(response.data);
        setQrCodeUrl(url);
        setError(null);
      } catch (err) {
        console.error("Error al generar el código QR:", err);
        setError("No se pudo cargar el código QR. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchQrCode();

    // Limpieza al desmontar el componente
    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [auth.userId]);

  return (
    <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-inner">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Recibir Pago</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Muestra este código QR para que otra persona pueda escanearlo y enviarte dinero.
      </p>
      <div className="flex justify-center items-center h-64 w-64 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg">
        {loading && <Loader className="w-10 h-10 animate-spin text-blue-500" />}
        {error && <p className="text-red-500">{error}</p>}
        {qrCodeUrl && !loading && (
          <img src={qrCodeUrl} alt="Tu código QR para recibir pagos" className="rounded-lg" />
        )}
      </div>
    </div>
  );
};

export default ReceivePayment;