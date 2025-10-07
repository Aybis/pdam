import Button from '../atoms/Button';
import Text from '../atoms/Text';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
        <Text variant="h3" className="mb-4">
          {title}
        </Text>
        <Text className="text-gray-300 mb-6">{message}</Text>
        <div className="flex justify-center space-x-4">
          <Button variant="secondary" onClick={onCancel}>
            Batal
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Timpa
          </Button>
        </div>
      </div>
    </div>
  );
}
