import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../atoms/Card';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import { useAppStore } from '../../stores/appStore';
import { fetchSheetData } from '../../utils/api';
import type { UserData } from '../../types';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setCurrentUser, setAllUsersData } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('Mencoba masuk...');
    setLoading(true);

    try {
      const data = (await fetchSheetData(false)) as UserData[];
      setAllUsersData(data);

      const user = data.find(
        (u) => u.name.toLowerCase() === username.toLowerCase(),
      );

      if (user) {
        setCurrentUser(user);
        navigate('/dashboard');
      } else {
        setError('Pengguna tidak ditemukan. Silakan periksa nama.');
      }
    } catch {
      setError('Gagal memuat data. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    const password = prompt('Masukkan kata sandi admin:', '');
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    if (password === adminPassword) {
      navigate('/admin');
    } else if (password) {
      alert('Kata sandi salah.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Text variant="h1" className="text-center mb-2">
        PDAM Bill Calculator
      </Text>
      <Text variant="small" className="text-center mb-8">
        Masuk dengan nama Anda dari Google Sheet.
      </Text>
      <form onSubmit={handleSubmit}>
        <Input
          label="Nama Pengguna"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="contoh: Zenith"
          required
          disabled={loading}
        />
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Memuat...' : 'Masuk'}
        </Button>
        {error && (
          <Text variant="error" className="text-center mt-4">
            {error}
          </Text>
        )}
      </form>
      <div className="text-center mt-4">
        <button
          onClick={handleAdminLogin}
          className="text-sm text-gray-400 hover:text-white"
        >
          Masuk sebagai Admin
        </button>
      </div>
    </Card>
  );
}
