import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../atoms/Card';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import AdminTable from '../molecules/AdminTable';
import ImageModal from '../molecules/ImageModal';
import { fetchSheetData } from '../../utils/api';
import type { AdminResponse } from '../../types';

export default function AdminPage() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<AdminResponse['data']>([]);
  const [loading, setLoading] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const response = (await fetchSheetData(true)) as AdminResponse;
      if (response.status === 'success') {
        setAdminData(response.data);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPhoto = (url: string) => {
    setSelectedImageUrl(url);
    setImageModalOpen(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6">
      <div className="w-full max-w-6xl mx-auto">
        <Card>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <Text variant="h1">Dasbor Admin</Text>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Keluar
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Text variant="body" className="text-gray-400">
                Memuat data...
              </Text>
            </div>
          ) : (
            <AdminTable data={adminData} onViewPhoto={handleViewPhoto} />
          )}
        </Card>

        <ImageModal
          isOpen={imageModalOpen}
          imageUrl={selectedImageUrl}
          onClose={() => setImageModalOpen(false)}
        />
      </div>
    </div>
  );
}
