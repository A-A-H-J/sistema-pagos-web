import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';
import { ScanLine, Send, XCircle } from 'lucide-react';

const SendPayment = () => {
  const { auth } = useAuth();
  const [scannedCarnet, setScannedCarnet] = useState(null);
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const qrScanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: 250 },
      false
    );

    const onScanSuccess = (decodedText) => {
      setScannedCarnet(decodedText);
      qrScanner.clear().catch(error => console.error("Fallo al limpiar el scanner.", error));
    };

    const onScanFailure = (error) => {
      // Ignorar errores comunes que no son fallos reales
    };

    qrScanner.render(onScanSuccess, onScanFailure);

    return () => {
      if (qrScanner.getState() === 2) { // 2 = SCANNING
        qrScanner.clear().catch(err => console.error(err));
      }
    };
  }, [scannerRef.current]);

  const handlePaymentRequest = async (e) => {
    e.preventDefault();
    if (!monto || parseFloat(monto) <= 0) {
      setError("El monto debe ser un número positivo.");
      return;
    }

    const requestData = {
      carnetBeneficiario: scannedCarnet, // Carnet del cliente a quien se le cobra
      idPagador: auth.userId,           // ID del vendedor que solicita
      monto: parseFloat(monto),
      descripcion,
    };

    try {
      setError(null);
      setSuccess(null);
      await apiService.qr.requestPayment(requestData);
      setSuccess('Solicitud de pago enviada con éxito. El cliente debe aprobarla.');
      setMonto('');
      setDescripcion('');
    } catch (err) {
      console.error("Error al solicitar el pago:", err);
      setError(err.response?.data || "Ocurrió un error al enviar la solicitud de pago.");
    }
  };

  if (!scannedCarnet) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Escanear para Solicitar Pago</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Apunta la cámara al código QR del cliente.</p>
        <div id="qr-reader" ref={scannerRef} className="w-full max-w-sm mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">Solicitar Pago</h3>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}
      
      <div className="mb-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">Solicitando pago a:</p>
        <p className="font-bold text-lg text-blue-800 dark:text-blue-300">{scannedCarnet}</p>
      </div>

      <form onSubmit={handlePaymentRequest} className="space-y-4">
        <div>
          <label htmlFor="monto" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monto ($)</label>
          <input
            type="number"
            id="monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="0.00"
            required
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción (Opcional)</label>
          <input
            type="text"
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Ej: Pago de almuerzo"
          />
        </div>
        <div className="flex gap-4 pt-4">
            <button
                type="button"
                onClick={() => setScannedCarnet(null)}
                className="w-full bg-gray-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition duration-200 flex items-center justify-center gap-2"
            >
                <XCircle className="w-5 h-5" /> Cancelar
            </button>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
            >
                <Send className="w-5 h-5" /> Solicitar Pago
            </button>
        </div>
      </form>
    </div>
  );
};

export default SendPayment;