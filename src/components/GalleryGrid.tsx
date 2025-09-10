// components/GalleryGrid.tsx
import Link from "next/link";
import Image from "next/image";
import React from "react";

export type Item = {
  slug: string;
  cover: string;      // ruta en /public/photos/...
  title?: string;
  images?: string[];  // si tiene varias -> carrusel
  category?: string;
};

export default function GalleryGrid({ items }: { items: Item[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "4px",
      }}
    >
      {items.map((it) => {
        const isCarousel = (it.images?.length ?? 0) > 1;
        return (
          <Link key={it.slug} href={`/p/${it.slug}`} style={{ position: "relative" }}>
            <div
              style={{
                position: "relative",
                aspectRatio: "1 / 1",
                overflow: "hidden",
              }}
            >
              <Image
                src={it.cover}
                alt={it.title ?? it.slug}
                fill
                sizes="(max-width: 640px) 33vw, 33vw"
                style={{ objectFit: "cover" }}
                priority={false}
              />
              {isCarousel && (
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    padding: "2px 6px",
                    background: "rgba(0,0,0,0.55)",
                    color: "#fff",
                    fontSize: 12,
                    borderRadius: 6,
                  }}
                >
                  ◁▷
                </div>
              )}
            </div>
          </Link>
        );
      })}
      <style jsx>{`
        @media (max-width: 900px) {
          div[style*="grid"] {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 640px) {
          div[style*="grid"] {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
