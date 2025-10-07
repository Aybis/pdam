interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function ImageModal({
  isOpen,
  imageUrl,
  onClose,
}: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div className="bg-gray-800 p-4 rounded-2xl shadow-2xl w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full h-10 w-10 flex items-center justify-center text-2xl font-bold hover:bg-red-700"
        >
          ×
        </button>
        <img
          src={imageUrl}
          alt="Bukti Foto Meteran"
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
