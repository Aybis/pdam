import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import Card from '../atoms/Card';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import FileInput from '../atoms/FileInput';
import StatCard from '../atoms/StatCard';
import ConfirmModal from '../molecules/ConfirmModal';
import {
  calculateBill,
  formatCurrency,
  getCurrentMonthYear,
  getCurrentMonth,
  fileToBase64,
} from '../../utils/helpers';
import { saveDataToSheet } from '../../utils/api';
import { createWorker } from 'tesseract.js';

export default function AddReadingPage() {
  const {
    currentUser,
    setLastReading,
    lastReading,
    selectedFile,
    setSelectedFile,
    updateUserReading,
  } = useAppStore();
  const navigate = useNavigate();
  const [currentReading, setCurrentReading] = useState('');
  const [ocrStatus, setOcrStatus] = useState('');
  const [usage, setUsage] = useState(0);
  const [bill, setBill] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.readings.length > 0) {
      const last =
        currentUser.readings[currentUser.readings.length - 1].meteran;
      setLastReading(last);
    } else {
      setLastReading(0);
    }
  }, [currentUser, setLastReading]);

  useEffect(() => {
    const reading = parseInt(currentReading, 10);
    if (!isNaN(reading) && reading >= lastReading) {
      const result = calculateBill(reading, lastReading);
      setUsage(result.usage);
      setBill(result.bill);
      setShowResult(true);
    } else {
      setShowResult(false);
    }
  }, [currentReading, lastReading]);

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    setOcrStatus('Membaca gambar...');

    try {
      const worker = await createWorker('eng');
      const {
        data: { text },
      } = await worker.recognize(file);
      await worker.terminate();

      const numbers = text.match(/\d+/g);
      if (numbers) {
        const foundNumber = numbers.join('');
        setCurrentReading(foundNumber);
        setOcrStatus(`Angka ditemukan: ${foundNumber}`);
      } else {
        setOcrStatus('Tidak dapat menemukan angka pada gambar.');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setOcrStatus('Gagal memproses gambar.');
    }
  };

  const handleSave = async (forceOverwrite = false) => {
    if (!currentUser) return;

    const currentMonth = getCurrentMonth();
    const readingExists = currentUser.readings.some(
      (r) => r.month.toLowerCase() === currentMonth.toLowerCase(),
    );

    if (readingExists && !forceOverwrite) {
      setShowConfirmModal(true);
      return;
    }

    setSaving(true);
    setSaveMessage('Mengirim data ke sheet...');

    try {
      const payload: any = {
        name: currentUser.name,
        month: currentMonth,
        meteran: parseInt(currentReading, 10),
        penggunaan: usage,
        tagihan: bill,
      };

      if (selectedFile) {
        payload.imageData = await fileToBase64(selectedFile);
        payload.mimeType = selectedFile.type;
      }

      const result = await saveDataToSheet(payload);

      if (result.status === 'success') {
        setSaveMessage('Data disimpan! Memuat ulang...');

        const newReading = {
          month: currentMonth,
          meteran: parseInt(currentReading, 10),
          penggunaan: usage,
          tagihan: bill,
          foto: result.imageUrl || null,
        };

        updateUserReading(newReading);

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        throw new Error(result.message || 'Skrip mengembalikan kesalahan.');
      }
    } catch (error: any) {
      console.error('Error saving data:', error);
      setSaveMessage(`Error: ${error.message}`);
    } finally {
      setTimeout(() => {
        setSaving(false);
        setSaveMessage('');
      }, 3000);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6">
      <div className="w-full max-w-lg mx-auto">
        <Card>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <Text variant="h2">Hitung Tagihan Baru</Text>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              ← Kembali
            </Button>
          </div>

          <Text variant="small" className="mb-6">
            Menghitung untuk: {getCurrentMonthYear()}
          </Text>

          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <Text variant="small">Angka Meter Sebelumnya</Text>
            <Text variant="h2">{lastReading} m³</Text>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <FileInput
                label="Unggah Foto Meteran (Bukti)"
                onFileSelect={handleFileSelect}
              />
              {ocrStatus && (
                <Text variant="small" className="text-yellow-400 mt-2">
                  {ocrStatus}
                </Text>
              )}
            </div>

            <Input
              label="Angka Meter Saat Ini (m³)"
              type="number"
              value={currentReading}
              onChange={(e) => setCurrentReading(e.target.value)}
              placeholder="Masukkan angka manual atau pindai"
            />
          </div>

          {showResult && (
            <div className="mt-6 p-6 bg-gray-900 rounded-xl">
              <Text variant="h3" className="mb-4 text-center">
                Perhitungan Selesai
              </Text>
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  label="Penggunaan Bulan Ini"
                  value={`${usage} m³`}
                  variant="green"
                />
                <StatCard
                  label="Total Tagihan"
                  value={formatCurrency(bill)}
                  variant="green"
                />
              </div>
              <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
                {saveMessage && (
                  <Text variant="small" className="text-gray-300 mb-2">
                    {saveMessage}
                  </Text>
                )}
                <Button
                  variant="primary"
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="w-40"
                >
                  {saving ? 'Menyimpan...' : 'Simpan ke Sheet'}
                </Button>
              </div>
            </div>
          )}
        </Card>

        <ConfirmModal
          isOpen={showConfirmModal}
          title="Konfirmasi Timpa Data"
          message="Data untuk bulan ini sudah ada. Apakah Anda yakin ingin menimpanya?"
          onConfirm={() => {
            setShowConfirmModal(false);
            handleSave(true);
          }}
          onCancel={() => setShowConfirmModal(false)}
        />
      </div>
    </div>
  );
}
