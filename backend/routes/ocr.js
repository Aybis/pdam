const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const { authenticateToken } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/meter-photos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'meter-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Process meter photo with OCR
router.post('/process-meter', authenticateToken, upload.single('meterPhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imagePath = req.file.path;
    
    // Process image with Tesseract OCR
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(m)
    });

    // Extract numbers from OCR text
    const numbers = text.match(/\d+/g);
    let extractedReading = null;

    if (numbers && numbers.length > 0) {
      // Find the longest number sequence (likely the meter reading)
      extractedReading = numbers.reduce((longest, current) => 
        current.length > longest.length ? current : longest
      );
    }

    res.json({
      message: 'OCR processing completed',
      filePath: imagePath,
      extractedText: text,
      extractedReading: extractedReading ? parseFloat(extractedReading) : null,
      suggestions: numbers ? numbers.map(n => parseFloat(n)) : []
    });

  } catch (error) {
    console.error('OCR processing error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'OCR processing failed', error: error.message });
  }
});

// Serve uploaded images
router.get('/image/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, '../uploads/meter-photos', filename);
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(path.resolve(imagePath));
  } else {
    res.status(404).json({ message: 'Image not found' });
  }
});

module.exports = router;