// ✅ src/components/car/BookingModal.tsx 
import { Button } from "../ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  carName: string;
}

export default function BookingModal({ open, onClose, carName }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-yellow-800">
          Book / Inquire - {carName}
        </h3>
        <div className="flex flex-col gap-3 mb-4">
          <a
            href={`https://wa.me/254700000000?text=Hello,%20I'm%20interested%20in%20the%20${encodeURIComponent(
              carName
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-green-500 hover:bg-green-400 w-full">WhatsApp</Button>
          </a>
          <a href={`sms:+254700000000?body=I'm interested in ${carName}`}>
            <Button className="bg-blue-400 hover:bg-blue-300 w-full">Send SMS</Button>
          </a>
          <a href={`tel:+254700000000`}>
            <Button className="bg-red-400 hover:bg-red-300 w-full">Call Now</Button>
          </a>
        </div>
        <Button onClick={onClose} variant="outline" className="w-full">
          Close
        </Button>
      </div>
    </div>
  );
}
