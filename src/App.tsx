import { useEffect, useState } from "react";
import { Printer, Settings } from "lucide-react";
import Calculadora from "./views/Calculadora";
import Configuracion from "./views/Configuracion";

const BASE_CONFIG = {
  precioKilo: 250,
  precioHora: 20,
  margenPorcentaje: 50,
};

const API_BASE = "https://print3d-calculator-api-production.up.railway.app";

type BackendUser = {
  id: number;
  googleId: string;
  email: string;
  name: string;
  pictureUrl?: string;
  config?: {
    id: number;
    precioPorKilo: number;
    precioPorHora: number;
    margenGananciaPorcentaje: number;
  };
};

export default function App() {
  const [vista, setVista] = useState<"calculadora" | "configuracion">(
    "calculadora"
  );

  const [precioPorKilo, setPrecioPorKilo] = useState(BASE_CONFIG.precioKilo);
  const [precioPorHora, setPrecioPorHora] = useState(BASE_CONFIG.precioHora);
  const [margenPorcentaje, setMargenPorcentaje] = useState(
    BASE_CONFIG.margenPorcentaje
  );

  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);

  const precioPorGramo = precioPorKilo / 1000;
  const margen = 1 + margenPorcentaje / 100;

  // 🔹 Al iniciar: cargar config (local o backend)
  useEffect(() => {
    const rawUser = JSON.parse(localStorage.getItem("user") || "null");

    // 👉 Sin sesión: usamos localStorage
    if (!rawUser) {
      const preconfiguracion = localStorage.getItem("preconfiguracion");

      if (preconfiguracion) {
        try {
          const configStorage = JSON.parse(preconfiguracion);
          const cfg = { ...BASE_CONFIG, ...configStorage };

          setPrecioPorKilo(cfg.precioKilo);
          setPrecioPorHora(cfg.precioHora);
          setMargenPorcentaje(cfg.margenPorcentaje);
        } catch (e) {
          console.error("Error al parsear preconfiguracion", e);
        }
      } else {
        localStorage.setItem("preconfiguracion", JSON.stringify(BASE_CONFIG));
      }

      setConfigLoaded(true);
      return;
    }

    // 👉 Con sesión Google: hablamos con el backend
    (async () => {
      try {
        // Mapeamos el payload de Google al formato que espera tu backend
        const googleUserForBackend = {
          googleId: rawUser.sub || rawUser.googleId,
          email: rawUser.email,
          name: rawUser.name,
          pictureUrl: rawUser.picture || rawUser.pictureUrl,
        };

        const resp = await fetch(`${API_BASE}/api/users/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(googleUserForBackend),
        });

        if (!resp.ok) {
          throw new Error("Error al guardar/obtener usuario en backend");
        }

        const userFromBackend: BackendUser = await resp.json();
        console.log("Usuario backend:", userFromBackend);
        setBackendUser(userFromBackend);

        // 👇 Si ya tiene configuración, la usamos
        if (userFromBackend.config) {
          setPrecioPorKilo(userFromBackend.config.precioPorKilo);
          setPrecioPorHora(userFromBackend.config.precioPorHora);
          setMargenPorcentaje(
            userFromBackend.config.margenGananciaPorcentaje
          );
        } else {
          // Primera vez: aplicamos la configuración base
          setPrecioPorKilo(BASE_CONFIG.precioKilo);
          setPrecioPorHora(BASE_CONFIG.precioHora);
          setMargenPorcentaje(BASE_CONFIG.margenPorcentaje);

          // Opcional: crear la config en backend de una vez
          await fetch(
            `${API_BASE}/api/config/users/${googleUserForBackend.googleId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                precioPorKilo: BASE_CONFIG.precioKilo,
                precioPorHora: BASE_CONFIG.precioHora,
                margenGananciaPorcentaje: BASE_CONFIG.margenPorcentaje,
              }),
            }
          );
        }
      } catch (err) {
        console.error("Error al cargar config de backend:", err);
      } finally {
        setConfigLoaded(true);
      }
    })();
  }, []);

  // 🔹 Cada que cambie la config: guardar (local o backend)
  useEffect(() => {
    if (!configLoaded) return; // evita disparar antes de que cargue

    const rawUser = JSON.parse(localStorage.getItem("user") || "null");

    // 👉 Sin sesión -> guardamos en localStorage
    if (!rawUser) {
      const data = {
        precioKilo: precioPorKilo,
        precioHora: precioPorHora,
        margenPorcentaje,
      };
      localStorage.setItem("preconfiguracion", JSON.stringify(data));
      return;
    }

    // 👉 Con sesión -> guardamos en backend (PUT)
    (async () => {
      try {
        const googleId =
          backendUser?.googleId || rawUser.sub || rawUser.googleId;

        if (!googleId) {
          console.warn("No hay googleId para actualizar config");
          return;
        }

        const payload = {
          precioPorKilo,
          precioPorHora,
          margenGananciaPorcentaje: margenPorcentaje,
        };

        await fetch(`${API_BASE}/api/config/users/${googleId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("Error al guardar config en backend:", err);
      }
    })();
  }, [precioPorKilo, precioPorHora, margenPorcentaje, configLoaded, backendUser]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        {vista === "calculadora" && (
          <Calculadora
            precioPorGramo={precioPorGramo}
            precioPorHora={precioPorHora}
            margen={margen}
          />
        )}
        {vista === "configuracion" && (
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
          onClick={() => setVista("calculadora")}
          className={`flex-1 p-2 flex flex-col items-center gap-1 ${
            vista === "calculadora"
              ? "font-bold text-blue-600"
              : "text-gray-500"
          }`}
        >
          <Printer size={20} />
          <span className="text-xs">Calculadora</span>
        </button>
        <button
          onClick={() => setVista("configuracion")}
          className={`flex-1 p-2 flex flex-col items-center gap-1 ${
            vista === "configuracion"
              ? "font-bold text-blue-600"
              : "text-gray-500"
          }`}
        >
          <Settings size={20} />
          <span className="text-xs">Configuración</span>
        </button>
      </nav>
    </div>
  );
}
