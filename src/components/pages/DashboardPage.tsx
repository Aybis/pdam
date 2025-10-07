import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import Card from '../atoms/Card';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import StatCard from '../atoms/StatCard';
import RefreshIcon from '../atoms/RefreshIcon';
import UsageChart from '../organisms/UsageChart';
import HistoryTable from '../molecules/HistoryTable';
import ImageModal from '../molecules/ImageModal';
import { formatCurrency } from '../../utils/helpers';
import { fetchSheetData } from '../../utils/api';
import type { UserData } from '../../types';

export default function DashboardPage() {
  const { currentUser, setCurrentUser, setAllUsersData, logout } =
    useAppStore();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = (await fetchSheetData(false)) as UserData[];
      setAllUsersData(data);
      const user = data.find(
        (u) => u.name.toLowerCase() === currentUser?.name.toLowerCase(),
      );
      if (user) {
        setCurrentUser(user);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Gagal memuat ulang data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewPhoto = (url: string) => {
    setSelectedImageUrl(url);
    setImageModalOpen(true);
  };

  if (!currentUser) return null;

  const latestReading = currentUser.readings[currentUser.readings.length - 1];

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6">
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <Text variant="h1">
                Selamat Datang, <span>{currentUser.name}</span>!
              </Text>
              <Text variant="small">Berikut riwayat penggunaan air Anda.</Text>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                title="Refresh Data"
              >
                <RefreshIcon
                  className={`w-6 h-6 text-gray-400 ${
                    refreshing ? 'spin-animation' : ''
                  }`}
                />
              </button>
              <Button variant="secondary" onClick={handleLogout}>
                Keluar
              </Button>
            </div>
          </div>

          {currentUser.readings && currentUser.readings.length > 0 && (
            <UsageChart readings={currentUser.readings} />
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              label="Penggunaan Bulan Terakhir"
              value={
                latestReading
                  ? `${latestReading.penggunaan || 0} m³`
                  : 'Tidak ada data'
              }
              variant="blue"
            />
            <StatCard
              label="Tagihan Bulan Terakhir"
              value={
                latestReading
                  ? formatCurrency(latestReading.tagihan || 0)
                  : 'Tidak ada data'
              }
              variant="green"
            />
          </div>

          <div className="mt-6">
            <Text variant="h3" className="mb-4">
              Rincian Riwayat
            </Text>
            <HistoryTable
              readings={currentUser.readings}
              onViewPhoto={handleViewPhoto}
            />
          </div>

          <div className="mt-8 text-center">
            <Button
              variant="primary"
              className="text-lg px-8 py-4"
              onClick={() => navigate('/add-reading')}
            >
              Hitung Tagihan Bulan Ini
            </Button>
          </div>
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
