import { useEffect, useState } from "react";
import { Printer, Settings } from "lucide-react";
import Calculadora from "./views/Calculadora";
import Configuracion from "./views/Configuracion";

export default function App() {
  const [vista, setVista] = useState<'calculadora' | 'configuracion'>('calculadora');

  let preconfiguracion = localStorage.getItem('preconfiguracion');
  let config = {
    precioKilo: 250,
    precioHora: 20,
    margenPorcentaje: 50,
  };

  if (preconfiguracion) {
    try {
      const configStorage = JSON.parse(preconfiguracion);
      config = { ...config, ...configStorage }; // para evitar que falte alguna propiedad
    } catch (e) {
      console.error("Error al parsear localStorage", e);
    }
  } else {
    localStorage.setItem('preconfiguracion', JSON.stringify(config));
  }

  const [precioPorKilo, setPrecioPorKilo] = useState(config.precioKilo);
  const [precioPorHora, setPrecioPorHora] = useState(config.precioHora);
  const [margenPorcentaje, setMargenPorcentaje] = useState(config.margenPorcentaje);

  const precioPorGramo = precioPorKilo / 1000;
  const margen = 1 + margenPorcentaje / 100;

  // 🚨 Este useEffect guarda en localStorage cada vez que cambie algo
  useEffect(() => {
    const data = {
      precioKilo: precioPorKilo,
      precioHora: precioPorHora,
      margenPorcentaje: margenPorcentaje,
    };
    localStorage.setItem('preconfiguracion', JSON.stringify(data));
  }, [precioPorKilo, precioPorHora, margenPorcentaje]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        {vista === 'calculadora' && (
          <Calculadora
            precioPorGramo={precioPorGramo}
            precioPorHora={precioPorHora}
            margen={margen}
          />
        )}
        {vista === 'configuracion' && (
          <Configuracion
            precioPorKilo={precioPorKilo}
            setPrecioPorKilo={setPrecioPorKilo}
            precioPorHora={precioPorHora}
            setPrecioPorHora={setPrecioPorHora}
            margenPorcentaje={margenPorcentaje}
            setMargenPorcentaje={setMargenPorcentaje}
          />
        )}
      </div>

      <nav className="flex justify-around border-t p-2 bg-white shadow-md">
        <button
          onClick={() => setVista('calculadora')}
          className={`flex-1 p-2 flex flex-col items-center gap-1 ${vista === 'calculadora' ? 'font-bold text-blue-600' : 'text-gray-500'}`}
        >
          <Printer size={20} />
          <span className="text-xs">Calculadora</span>
        </button>
        <button
          onClick={() => setVista('configuracion')}
          className={`flex-1 p-2 flex flex-col items-center gap-1 ${vista === 'configuracion' ? 'font-bold text-blue-600' : 'text-gray-500'}`}
        >
          <Settings size={20} />
          <span className="text-xs">Configuración</span>
        </button>
      </nav>
    </div>
  );
}