import { useState } from 'react';

type Props = {
  precioPorGramo: number;
  precioPorHora: number;
  margen: number;
};

type Cama = {
  gramos: string;
  horas: string;
  minutos: string;
};

export default function Calculadora({ precioPorGramo, precioPorHora, margen }: Props) {
  const [camas, setCamas] = useState<Cama[]>([{ gramos: '', horas: '', minutos:'' }]);
  const [piezas, setPiezas] = useState('1');

  const handleChange = (index: number, field: keyof Cama, value: string) => {
    const nuevasCamas = [...camas];
    nuevasCamas[index][field] = value;
    setCamas(nuevasCamas);
  };

  const agregarCama = () => {
    setCamas([...camas, { gramos: '', horas: '', minutos:'' }]);
  };

  const eliminarCama = (index: number) => {
    const nuevas = camas.filter((_, i) => i !== index);
    setCamas(nuevas);
  };

  const calcularSubtotal = (cama: Cama) => {
    const gramos = parseFloat(cama.gramos || '0');
    const horas = parseFloat(cama.horas || '0');
    const minutos = parseFloat(cama.minutos || '0');

    // Convertimos los minutos a horas y sumamos con las horas
    const totalHoras = horas + (minutos / 60);
    console.log(totalHoras);

    const costo = ((gramos * precioPorGramo) + (totalHoras * precioPorHora)) * margen;
    console.log(gramos);
    return Math.round(costo);
  };

  const total = camas.reduce((sum, cama) => sum + calcularSubtotal(cama), 0);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Cotizador por camas</h2>

      {camas.map((cama, index) => (
        <div key={index} className="border rounded p-3 space-y-2 bg-white shadow-sm">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Gramos"
              value={cama.gramos}
              onChange={(e) => handleChange(index, 'gramos', e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
            <input
              type="number"
              placeholder="Horas"
              value={cama.horas}
              onChange={(e) => handleChange(index, 'horas', e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />

            <input
              type="number"
              placeholder="Minutos"
              value={cama.minutos}
              onChange={(e) => handleChange(index, 'minutos', e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
            
            <button
              onClick={() => eliminarCama(index)}
              className="bg-red-500 text-white px-2 rounded"
            >
              ✕
            </button>
          </div>
          <div className="text-right text-sm text-gray-500">
            Subtotal: ${calcularSubtotal(cama)} MXN
          </div>
        </div>
      ))}

      <button
        onClick={agregarCama}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Agregar cama
      </button>

      <div className="text-right mt-4 text-xl font-semibold">
        Total: ${total} MXN
      </div>

      <div className="flex justify-end items-center gap-2">
        <label className="text-sm">Piezas:</label>
        <input
          type="number"
          min={1}
          value={piezas}
          onChange={(e) => setPiezas(e.target.value)}
          className="w-20 border px-2 py-1 rounded text-right"
        />
      </div>
      <div className="text-right font-semibold">
        Precio por pieza: ${Math.round(total / (parseInt(piezas) || 1))} MXN
      </div>

      <button
        onClick={() => {
          navigator.clipboard.writeText(`${total}`);
          alert("Total copiado al portapapeles");
        }}
        className="text-sm text-blue-600 underline"
      >
        Copiar total
      </button>
    </div>
  );
}
