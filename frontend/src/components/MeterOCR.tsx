import React, { useState, useCallback } from 'react';
import { ocrAPI } from '../services/api';
import { OCRResult } from '../types';

interface MeterOCRProps {
  onReadingExtracted: (reading: number) => void;
}

const MeterOCR: React.FC<MeterOCRProps> = ({ onReadingExtracted }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState('');

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError('');
        setResult(null);
      } else {
        setError('Please select an image file');
      }
    }
  }, []);

  const processMeterPhoto = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const response = await ocrAPI.processMeterPhoto(selectedFile);
      const ocrResult: OCRResult = response.data;
      setResult(ocrResult);

      if (ocrResult.extractedReading) {
        onReadingExtracted(ocrResult.extractedReading);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'OCR processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const selectSuggestion = (reading: number) => {
    onReadingExtracted(reading);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Upload Meter Photo for OCR
      </h3>

      {/* File Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select meter photo
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {selectedFile && (
            <button
              onClick={clearFile}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <div className="mb-4">
          <img
            src={previewUrl}
            alt="Meter preview"
            className="max-w-full h-auto max-h-64 object-contain border rounded-lg"
          />
        </div>
      )}

      {/* Process Button */}
      {selectedFile && (
        <div className="mb-4">
          <button
            onClick={processMeterPhoto}
            disabled={processing}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Process Image'
            )}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* OCR Results */}
      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">OCR Results</h4>
            
            {result.extractedReading && (
              <div className="mb-3">
                <span className="text-sm text-gray-600">Detected Reading:</span>
                <div className="text-lg font-bold text-green-600">
                  {result.extractedReading} m³
                </div>
              </div>
            )}

            {result.suggestions.length > 0 && (
              <div className="mb-3">
                <span className="text-sm text-gray-600 block mb-2">
                  Other possible readings:
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.suggestions.slice(0, 5).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <details className="mt-3">
              <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                View raw OCR text
              </summary>
              <div className="mt-2 p-2 bg-white border rounded text-xs text-gray-700 max-h-32 overflow-y-auto">
                {result.extractedText || 'No text detected'}
              </div>
            </details>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>Tips for better OCR results:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Ensure good lighting and clear focus</li>
          <li>Take photo straight-on, not at an angle</li>
          <li>Make sure the meter numbers are clearly visible</li>
          <li>Remove any glare or shadows</li>
        </ul>
      </div>
    </div>
  );
};

export default MeterOCR;