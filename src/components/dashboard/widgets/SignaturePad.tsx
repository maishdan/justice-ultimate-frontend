import React, { useRef, useEffect } from 'react';
import SignaturePad from 'signature_pad';

interface SignaturePadProps {
  onSign: (dataUrl: string) => void;
}

const SignatureCanvas: React.FC<SignaturePadProps> = ({ onSign }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sigPadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      sigPadRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: '#fff',
        penColor: '#2563eb', // Professional blue
        minWidth: 2,
        maxWidth: 4,
      });
    }
    return () => {
      sigPadRef.current?.off();
    };
  }, []);

  const handleSave = () => {
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      const dataUrl = sigPadRef.current.toDataURL();
      onSign(dataUrl);
    }
  };

  const handleClear = () => {
    sigPadRef.current?.clear();
  };

  return (
    <div className="flex flex-col items-center w-full">
      <canvas
        ref={canvasRef}
        width={400}
        height={180}
        className="border-2 border-blue-500 rounded-lg bg-white shadow-lg"
        style={{ touchAction: 'none', cursor: 'crosshair' }}
      />
      <div className="flex gap-4 mt-4">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          onClick={handleSave}
        >
          Save Signature
        </button>
        <button
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold shadow hover:bg-gray-300 transition"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SignatureCanvas; 