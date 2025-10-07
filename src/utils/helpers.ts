export const calculateBill = (currentReading: number, lastReading: number) => {
  const usage = currentReading - lastReading;

  if (usage < 0) {
    return {
      usage: 0,
      bill: 0,
      error: 'Angka saat ini tidak boleh lebih rendah dari sebelumnya.',
    };
  }

  let bill = 0;
  if (usage <= 20) {
    bill = 20000;
  } else {
    bill = 20000 + (usage - 20) * 3000;
  }

  return { usage, bill, error: null };
};

export const formatCurrency = (value: number): string => {
  return `Rp ${value.toLocaleString('id-ID')}`;
};

export const getCurrentMonthYear = (): string => {
  const date = new Date();
  return date.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
};

export const getCurrentMonth = (): string => {
  const date = new Date();
  return date.toLocaleString('default', { month: 'long' });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const extractImageUrl = (url: string): string => {
  const fileIdMatch = url.match(/d\/(.*?)\//);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/uc?id=${fileIdMatch[1]}`;
  }
  return url;
};
