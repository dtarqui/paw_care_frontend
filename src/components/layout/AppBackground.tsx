/**
 * Fondo decorativo del shell autenticado: dos capas detrás del contenido de
 * `AppShell`, así que se ve en todas las pantallas de `/app/*` y en ninguna de
 * las públicas (login, recuperar contraseña, invitación).
 *
 * Los dos colores salen de `--primary` a través de las clases de `index.css`,
 * no de un hex escrito acá: el fondo acompaña solo al modo claro/oscuro y a los
 * tres acentos (violeta/océano/rosa) sin una regla por tema.
 *
 * Es decoración pura — `aria-hidden` para que ningún lector de pantalla lo
 * anuncie, y `pointer-events-none` para que no se coma un clic de la pantalla
 * que tiene detrás. Es estático a propósito: no hay nada que apagar bajo
 * `prefers-reduced-motion`.
 */
export function AppBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="app-bg-glow absolute inset-x-0 top-0 h-72 sm:h-80 lg:h-96" />
      <PawTrail />
    </div>
  );
}

/**
 * Un rastro de huellas caminando hacia la esquina superior derecha.
 *
 * Las posiciones están sobre una recta con un zigzag lateral de ±10px: un animal
 * no pisa sobre una sola línea, y alinearlas perfectamente delata el patrón
 * generado. La opacidad baja con la distancia, así que el rastro se desvanece en
 * vez de cortarse contra el borde.
 *
 * **Desde `sm` para arriba.** Medido a 320px: ahí el área de contenido no tiene
 * un solo pixel libre, y el rastro termina pisando la primera fila de tarjetas
 * en vez de un margen vacío. En un teléfono el fondo es el resplandor solo — que
 * vive detrás del encabezado y no le disputa el lugar a nada.
 */
function PawTrail() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="app-bg-paws absolute right-0 bottom-0 hidden w-76 sm:block lg:w-[27rem]"
      fill="currentColor"
    >
      {PAW_TRAIL.map((paw, i) => (
        <g
          key={i}
          opacity={paw.opacity}
          transform={`translate(${paw.x} ${paw.y}) rotate(${paw.angle}) scale(0.5) translate(-50 -50)`}
        >
          <PawPrint />
        </g>
      ))}
    </svg>
  );
}

/**
 * La pisada: almohadilla y **cuatro** dedos en arco.
 *
 * No es la patita del logo (`public/pwa-icon.svg`), que tiene tres dedos y está
 * dibujada de frente. Medido contra la app: girada 54° y a 50px, la del logo se
 * lee como cuatro burbujas sueltas — el arco de cuatro dedos es lo que hace que
 * una mancha tenue se reconozca como una huella sin mirarla fijo. El logo se
 * sigue viendo entero, y de frente, en el sidebar y en la cabecera móvil.
 */
function PawPrint() {
  return (
    <>
      <ellipse cx="50" cy="68" rx="22" ry="18" />
      <ellipse cx="24" cy="45" rx="8.5" ry="10" transform="rotate(-20 24 45)" />
      <ellipse cx="40" cy="27" rx="9" ry="10.5" transform="rotate(-8 40 27)" />
      <ellipse cx="61" cy="27" rx="9" ry="10.5" transform="rotate(8 61 27)" />
      <ellipse cx="77" cy="45" rx="8.5" ry="10" transform="rotate(20 77 45)" />
    </>
  );
}

const PAW_TRAIL = [
  { x: 40, y: 274, angle: 54, opacity: 1 },
  { x: 90, y: 213, angle: 51, opacity: 0.84 },
  { x: 164, y: 184, angle: 57, opacity: 0.68 },
  { x: 214, y: 123, angle: 52, opacity: 0.54 },
  { x: 288, y: 94, angle: 56, opacity: 0.4 },
  { x: 338, y: 33, angle: 53, opacity: 0.27 },
];
