"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ImageViewerProps {
  images: Array<{ original: string; thumb: string; large: string }>;
  productName: string;
}

export default function ImageViewer({ images, productName }: ImageViewerProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mainRef.current) return;
      const rect = mainRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x, y });
    },
    []
  );

  const current = images[active];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        ref={mainRef}
        className="relative w-full aspect-square bg-white rounded-2xl border border-[#E6E8EB] overflow-hidden cursor-zoom-in select-none"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={current?.large ?? current?.original}
          alt={productName}
          fill
          className={`object-contain p-6 transition-transform duration-100 ${zoomed ? "scale-150" : "scale-100"}`}
          style={
            zoomed
              ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
              : undefined
          }
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {zoomed && (
          <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full pointer-events-none">
            Hover to zoom
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-colors ${
                i === active
                  ? "border-blue-500"
                  : "border-[#E6E8EB] hover:border-blue-300"
              }`}
            >
              <Image
                src={img.thumb}
                alt={`${productName} ${i + 1}`}
                fill
                className="object-contain p-1.5"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
