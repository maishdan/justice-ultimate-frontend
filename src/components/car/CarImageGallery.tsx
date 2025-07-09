// ✅ src/components/car/CarImageGallery.tsx
import { useState } from "react";

interface Props {
  images: string[];
  name: string;
  onError?: () => void; // ✅ Added onError prop
}

export default function CarImageGallery({ images, name, onError }: Props) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="w-full">
      <img
        src={images[current]}
        alt={`${name} image ${current + 1}`}
        className="rounded-xl shadow-lg w-full h-80 object-cover mb-4"
        loading="lazy"
        onError={onError} // ✅ Added
      />
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${name} thumbnail ${idx + 1}`}
            className={`w-20 h-14 object-cover rounded-md cursor-pointer border-2 ${
              current === idx ? "border-yellow-400" : "border-transparent"
            }`}
            onClick={() => setCurrent(idx)}
            loading="lazy"
            onError={onError} // ✅ Added
          />
        ))}
      </div>
    </div>
  );
}
