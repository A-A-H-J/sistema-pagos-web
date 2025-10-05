import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GraficoFlujo = ({ data }) => {
  // Formatear la fecha para mostrar solo día y mes
  const formattedData = data.map(item => ({
    ...item,
    fecha: new Date(item.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ingresos" stroke="#22c55e" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="gastos" stroke="#ef4444" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GraficoFlujo;