import { useEffect } from "react";

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

  // usuario guardado en el navegador
  const usuario = JSON.parse(localStorage.getItem("user") || "null");

  // callback de Google
  const handleGoogleResponse = (response: any) => {
    const jwt = response.credential;

    const payload = JSON.parse(atob(jwt.split(".")[1]));

    console.log("Usuario Google:", payload);

      // armar payload que usará tu backend
  const userPayload = {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    pictureUrl: payload.picture
  };
  console.log("Payload listo para backend:", userPayload);

  // guardar local
  localStorage.setItem("user", JSON.stringify(userPayload));

    window.location.reload();
  };

    const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    if (usuario) return; // ya logueado, no renderizar el botón

    // @ts-ignore
    if (window.google) {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: "589775822318-9uslek86seps3akfp8ulh3mcsds4b6a1.apps.googleusercontent.com",
        callback: handleGoogleResponse
      });

      // @ts-ignore
      window.google.accounts.id.renderButton(
        document.getElementById("googleLoginBtn"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
          shape: "pill"
        }
      );
    }
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Configuración</h2>
{/* Si hay usuario, mostrar tarjeta con foto y botón Cerrar sesión */}
      {/* {usuario && (
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
    <img
      src={usuario.pictureUrl}
      alt={usuario.name}
      referrerPolicy="no-referrer"   // 👈 ESTE ES EL TRUCO
      className="w-10 h-10 rounded-full object-cover"
    />
          <div className="flex-1">
            <p className="text-sm font-medium">
              {usuario.name || usuario.email}
            </p>
            <p className="text-xs text-gray-500">{usuario.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1 rounded-lg border border-red-500 text-red-500 hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </div>
      )
      } */}
      <div>
        <label className="block">Precio por kilo (MXN):</label>
        <input
          type="number"
          value={precioPorKilo}
          onChange={(e) => setPrecioPorKilo(parseFloat(e.target.value))}
          className="w-full border px-2 py-1 rounded"
        />
        <p className="text-sm text-gray-500">
          Se calcula automáticamente el precio por gramo.
        </p>
      </div>

      <div>
        <label className="block">Precio por hora (MXN):</label>
        <input
          type="number"
          value={precioPorHora}
          onChange={(e) => setPrecioPorHora(parseFloat(e.target.value))}
          className="w-full border px-2 py-1 rounded"
        />
        <p className="text-sm text-gray-500">
          Incluye electricidad y desgaste de la impresora.
        </p>
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



      {/* Si NO hay usuario, aparece el botón */}
      {/* {!usuario && 
            <div className="flex flex-col items-center mt-2">
                <label className="block">Para cargar / guardar tu configuración</label>
<div id="googleLoginBtn" className="mt-6"></div>
      </div>
      
      } */}

    </div>
  );
}
