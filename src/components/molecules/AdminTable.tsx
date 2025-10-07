import type { AdminDataItem } from '../../types';
import { formatCurrency, extractImageUrl } from '../../utils/helpers';

interface AdminTableProps {
  data: AdminDataItem[];
  onViewPhoto: (url: string) => void;
}

export default function AdminTable({ data, onViewPhoto }: AdminTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Nama
                </th>
                <th scope="col" className="py-3 px-6">
                  Bulan
                </th>
                <th scope="col" className="py-3 px-6 text-right">
                  Angka Meter
                </th>
                <th scope="col" className="py-3 px-6 text-right">
                  Penggunaan
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
                <td colSpan={6} className="py-4 px-6 text-center text-gray-400">
                  Tidak ada data.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="py-3 px-6">
                Nama
              </th>
              <th scope="col" className="py-3 px-6">
                Bulan
              </th>
              <th scope="col" className="py-3 px-6 text-right">
                Angka Meter
              </th>
              <th scope="col" className="py-3 px-6 text-right">
                Penggunaan
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
            {data.map((item, index) => (
              <tr key={index} className="bg-gray-800 border-b border-gray-700">
                <td className="py-4 px-6 font-medium whitespace-nowrap">
                  {item.nama}
                </td>
                <td className="py-4 px-6">{item.bulan}</td>
                <td className="py-4 px-6 text-right">{item.meteran}</td>
                <td className="py-4 px-6 text-right">{item.penggunaan} m³</td>
                <td className="py-4 px-6 text-right">
                  {formatCurrency(item.tagihan)}
                </td>
                <td className="py-4 px-6 text-center">
                  {item.foto ? (
                    <button
                      onClick={() => onViewPhoto(extractImageUrl(item.foto!))}
                      className="text-blue-400 hover:underline"
                    >
                      Lihat Foto
                    </button>
                  ) : (
                    'Tidak Ada'
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
