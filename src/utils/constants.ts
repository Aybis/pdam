export const SHEET_CONFIG = {
  SHEET_ID: import.meta.env.VITE_SHEET_ID || '',
  GID: import.meta.env.VITE_GID || '0',
  SCRIPT_URL: import.meta.env.VITE_SCRIPT_URL || '',
};

export const getSheetURL = () =>
  `https://docs.google.com/spreadsheets/d/${SHEET_CONFIG.SHEET_ID}/export?format=csv&gid=${SHEET_CONFIG.GID}`;

export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
