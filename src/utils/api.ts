import type { UserData, AdminResponse, SaveDataPayload } from '../types';
import { SHEET_CONFIG, getSheetURL } from './constants';

const robustSplit = (rowStr: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuote = false;

  for (let i = 0; i < rowStr.length; i++) {
    const char = rowStr[i];
    if (char === '"' && (i === 0 || rowStr[i - 1] !== '\\')) {
      inQuote = !inQuote;
    } else if (char === ',' && !inQuote) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map((v) => v.trim().replace(/^"|"$/g, ''));
};

const parseCSV = (text: string): UserData[] => {
  const rows = text.split('\n').map((row) => row.trim());

  const subHeaderRowIndex = rows.findIndex((row) =>
    row.toLowerCase().includes('meteran,penggunaan,tagihan'),
  );
  if (subHeaderRowIndex === -1) return [];

  const subHeaderRow = robustSplit(rows[subHeaderRowIndex]);
  const monthHeaderRowIndex = subHeaderRowIndex - 1;
  if (monthHeaderRowIndex < 0) return [];

  const monthHeaderRow = robustSplit(rows[monthHeaderRowIndex]);

  const dataRows = rows.slice(subHeaderRowIndex + 1).filter((row) => {
    const cols = robustSplit(row);
    return (
      cols.length > 1 &&
      !isNaN(parseInt(cols[0], 10)) &&
      cols[1] &&
      cols[1].trim() !== ''
    );
  });

  const users: Record<string, UserData> = {};

  dataRows.forEach((rowStr) => {
    const rowData = robustSplit(rowStr);
    const name = rowData[1].trim();
    if (!name) return;

    if (!users[name]) {
      users[name] = { name: name, readings: [] };
    }

    let currentMonth = '';
    for (let i = 2; i < subHeaderRow.length; i++) {
      if (monthHeaderRow[i]) {
        currentMonth = monthHeaderRow[i];
      }
      if (!currentMonth) continue;
      if (i >= rowData.length || !rowData[i]) continue;

      const subHeader = subHeaderRow[i];
      const value = rowData[i];

      let reading = users[name].readings.find((r) => r.month === currentMonth);
      if (!reading) {
        reading = {
          month: currentMonth,
          meteran: NaN,
          penggunaan: NaN,
          tagihan: NaN,
          foto: null,
        };
        users[name].readings.push(reading);
      }

      if (subHeader === 'Meteran') reading.meteran = parseInt(value, 10);
      if (subHeader === 'Penggunaan') reading.penggunaan = parseInt(value, 10);
      if (subHeader === 'Tagihan')
        reading.tagihan = parseInt((value || '').replace(/[^0-9]/g, ''), 10);
      if (
        subHeader.toLowerCase().includes('image') ||
        subHeader.toLowerCase().includes('foto')
      ) {
        reading.foto = value;
      }
    }
  });

  return Object.values(users).map((user) => {
    user.readings = user.readings.filter((r) => !isNaN(r.meteran) && r.month);
    return user;
  });
};

export const fetchSheetData = async (
  isAdmin = false,
): Promise<UserData[] | AdminResponse> => {
  try {
    const url = isAdmin
      ? SHEET_CONFIG.SCRIPT_URL
      : `${getSheetURL()}&t=${new Date().getTime()}`;

    const options = isAdmin
      ? { method: 'GET', redirect: 'follow' as RequestRedirect }
      : { cache: 'no-store' as RequestCache };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    if (isAdmin) {
      return await response.json();
    } else {
      const csvText = await response.text();
      return parseCSV(csvText);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const saveDataToSheet = async (
  payload: SaveDataPayload,
): Promise<{ status: string; imageUrl?: string; message?: string }> => {
  try {
    const response = await fetch(SHEET_CONFIG.SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Kesalahan Jaringan! Status: ${response.status}. Pastikan skrip di-deploy dengan akses 'Anyone'.`,
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};
