import type { Reading } from '../../types';
import { formatCurrency, extractImageUrl } from '../../utils/helpers';

interface HistoryTableProps {
  readings: Reading[];
  onViewPhoto: (url: string) => void;
}

export default function HistoryTable({
  readings,
  onViewPhoto,
}: HistoryTableProps) {
  if (!readings || readings.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Bulan
                </th>
                <th scope="col" className="py-3 px-6 text-right">
                  Angka Meter
                </th>
                <th scope="col" className="py-3 px-6 text-right">
                  Penggunaan (m³)
                </th>
                <th scope="col" className="py-3 px-6 text-right">
                  Tagihan
                </th>
                <th scope="col" className="py-3 px-6 text-center">
                  Foto Bukti
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="py-4 px-6 text-center text-gray-400">
                  Tidak ada data riwayat.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const reversedReadings = [...readings].reverse();

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="py-3 px-6">
                Bulan
              </th>
              <th scope="col" className="py-3 px-6 text-right">
                Angka Meter
              </th>
              <th scope="col" className="py-3 px-6 text-right">
                Penggunaan (m³)
              </th>
              <th scope="col" className="py-3 px-6 text-right">
                Tagihan
              </th>
              <th scope="col" className="py-3 px-6 text-center">
                Foto Bukti
              </th>
            </tr>
          </thead>
          <tbody>
            {reversedReadings.map((reading, index) => (
              <tr key={index} className="bg-gray-800 border-b border-gray-700">
                <td className="py-4 px-6 font-medium whitespace-nowrap">
                  {reading.month}
                </td>
                <td className="py-4 px-6 text-right">{reading.meteran}</td>
                <td className="py-4 px-6 text-right">
                  {reading.penggunaan} m³
                </td>
                <td className="py-4 px-6 text-right">
                  {formatCurrency(reading.tagihan)}
                </td>
                <td className="py-4 px-6 text-center">
                  {reading.foto ? (
                    <button
                      onClick={() =>
                        onViewPhoto(extractImageUrl(reading.foto!))
                      }
                      className="text-blue-400 hover:underline"
                    >
                      Lihat
                    </button>
                  ) : (
                    'N/A'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
