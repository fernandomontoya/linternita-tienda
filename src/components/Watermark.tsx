import Image from "next/image";

/**
 * Overlay de marca de agua con el logo de Linternita.
 * Colócalo dentro de un contenedor con position: relative.
 */
export default function Watermark({ size = 56 }: { size?: number }) {
  return (
    <div
      className="pointer-events-none select-none absolute bottom-3 right-3 opacity-60 z-10"
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt=""
        fill
        className="object-contain drop-shadow-md"
        draggable={false}
      />
    </div>
  );
}
