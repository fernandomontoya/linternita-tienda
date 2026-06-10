import Image from "next/image";

/**
 * Overlay de marca de agua con el logo de Linternita.
 * Colócalo dentro de un contenedor con position: relative.
 */
export default function Watermark({ size = 56, position = "bottom-right" }: { size?: number; position?: "bottom-right" | "bottom-left" }) {
  const posCls = position === "bottom-left" ? "bottom-3 left-3" : "bottom-3 right-3";
  return (
    <div
      className={`pointer-events-none select-none absolute ${posCls} opacity-60 z-10`}
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
