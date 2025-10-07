import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Eye, Mail, Save, Loader, Camera } from 'lucide-react';
import apiService from '../services/apiService';
import Webcam from 'react-webcam';

const Settings = () => {
  const { auth, isDarkMode, toggleDarkMode, isDaltonicoMode, toggleDaltonicoMode, fontSize, setFontSize } = useAuth();
  
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const webcamRef = useRef(null);
  const [faceRegisterSuccess, setFaceRegisterSuccess] = useState('');
  const [faceRegisterError, setFaceRegisterError] = useState('');

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError('Por favor, ingresa un correo electrónico válido.');
      setIsLoading(false);
      return;
    }

    try {
      await apiService.usuarios.updateEmail(auth.userId, newEmail);
      setSuccessMessage("Correo electrónico actualizado correctamente.");
      setNewEmail('');
    } catch (err) {
      console.error('Error al cambiar el correo:', err);
      const errorMessage = err.response?.data?.message || 'No se pudo cambiar el correo. Inténtalo de nuevo.';
      setEmailError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFontSizeChange = (e) => {
    const newSize = `${e.target.value}px`;
    setFontSize(newSize);
    document.documentElement.style.fontSize = newSize; 
  };
  
  const captureAndRegisterFace = useCallback(async () => {
    setFaceRegisterError('');
    setFaceRegisterSuccess('');
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
        setFaceRegisterError("No se pudo capturar la imagen. Inténtalo de nuevo.");
        return;
    }

    const blob = await fetch(imageSrc).then(res => res.blob());
    const file = new File([blob], "face.jpg", { type: "image/jpeg" });

    try {
        await apiService.usuarios.registrarRostro(auth.userId, file);
        setFaceRegisterSuccess("¡Tu rostro ha sido registrado con éxito!");
    } catch (err) {
        console.error("Error al registrar el rostro:", err);
        setFaceRegisterError(err.response?.data?.message || "No se pudo registrar el rostro.");
    }
  }, [webcamRef, auth.userId]);

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
      <h2 className="text-3xl font-bold">Configuraciones</h2>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full">
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </div>
          <p className="text-lg font-semibold">Modo Oscuro</p>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isDarkMode ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full">
            <Eye className="w-6 h-6" />
          </div>
          <p className="text-lg font-semibold">Accesibilidad</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">Modo Daltónico</p>
            <button
              onClick={toggleDaltonicoMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDaltonicoMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDaltonicoMode ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tamaño de letra</label>
            <input
              type="range"
              min="14"
              max="20"
              value={parseInt(fontSize)}
              onChange={handleFontSizeChange}
              className="w-full mt-1"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              El tamaño de letra actual es: {fontSize}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full">
            <Mail className="w-6 h-6" />
          </div>
          <p className="text-lg font-semibold">Cambiar Correo Electrónico</p>
        </div>
        {successMessage && <div className="p-3 mb-4 text-sm text-center text-green-700 bg-green-100 rounded-lg">{successMessage}</div>}
        {emailError && <div className="p-3 mb-4 text-sm text-center text-red-700 bg-red-100 rounded-lg">{emailError}</div>}
        <form onSubmit={handleEmailChange} className="space-y-4">
          <div>
            <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nuevo correo</label>
            <input type="email" id="newEmail" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="nuevo.correo@ejemplo.com" required />
          </div>
          <button type="submit" disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isLoading ? <><Loader className="w-5 h-5 animate-spin" /><span>Guardando...</span></> : <><Save className="w-5 h-5" /><span>Guardar Cambios</span></>}
          </button>
        </form>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full">
            <Camera className="w-6 h-6" />
          </div>
          <p className="text-lg font-semibold">Registro Facial para Pagos</p>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Para autorizar pagos de forma segura, necesitamos registrar tu rostro. Céntrate en la cámara y presiona el botón.
        </p>
        
        {faceRegisterSuccess && <div className="p-3 mb-4 text-sm text-center text-green-700 bg-green-100 rounded-lg">{faceRegisterSuccess}</div>}
        {faceRegisterError && <div className="p-3 mb-4 text-sm text-center text-red-700 bg-red-100 rounded-lg">{faceRegisterError}</div>}

        <div className="flex flex-col items-center gap-4">
            <div className="w-64 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={256}
                    height={192}
                    videoConstraints={{ facingMode: "user" }}
                />
            </div>
            <button
                onClick={captureAndRegisterFace}
                className="w-full max-w-xs bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
            >
                <Camera className="w-5 h-5" />
                Registrar mi Rostro
            </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;