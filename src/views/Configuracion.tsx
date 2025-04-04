type Props = {
  precioPorKilo: number;
  setPrecioPorKilo: (valor: number) => void;
  precioPorHora: number;
  setPrecioPorHora: (valor: number) => void;
  margenPorcentaje: number;
  setMargenPorcentaje: (valor: number) => void;
};

export default function Configuracion({
  precioPorKilo,
  setPrecioPorKilo,
  precioPorHora,
  setPrecioPorHora,
  margenPorcentaje,
  setMargenPorcentaje
}: Props) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Configuración</h2>

      <div>
        <label className="block">Precio por kilo (MXN):</label>
        <input
          type="number"
          value={precioPorKilo}
          onChange={(e) => setPrecioPorKilo(parseFloat(e.target.value))}
          className="w-full border px-2 py-1 rounded"
        />
        <p className="text-sm text-gray-500">Se calcula automáticamente el precio por gramo.</p>
      </div>

      <div>
        <label className="block">Precio por hora (MXN):</label>
        <input
          type="number"
          value={precioPorHora}
          onChange={(e) => setPrecioPorHora(parseFloat(e.target.value))}
          className="w-full border px-2 py-1 rounded"
        />
        <p className="text-sm text-gray-500">Incluye electricidad y desgaste de la impresora.</p>
      </div>

      <div>
        <label className="block">Margen de ganancia (%):</label>
        <input
          type="number"
          min={0}
          value={margenPorcentaje}
          onChange={(e) =>
            setMargenPorcentaje(Math.max(0, parseFloat(e.target.value)))
          }
          className="w-full border px-2 py-1 rounded"
        />
        <p className="text-sm text-gray-500">Ejemplo: 50 = 50% de ganancia</p>
      </div>
    </div>
  );
}
