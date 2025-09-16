# PDAM Water Bills Tracking System

A comprehensive React web application with Node.js/Express backend for tracking PDAM water bills, featuring JWT authentication, OCR for meter reading, and interactive charts.

## Features

- **JWT-based Authentication**: Secure user registration and login
- **Dashboard with Charts**: Visual representation of water usage vs cost using Chart.js
- **OCR Integration**: Upload meter photos and extract readings using Tesseract.js
- **Bill Management**: Create, read, update, and delete water bills
- **Automatic Cost Calculation**: Based on PDAM pricing (Flat fee Rp 20,000 for ≤20m³, then Rp 3,000/m³)
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Chart.js for data visualization
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- PostgreSQL database
- JWT for authentication
- Tesseract.js for OCR
- Multer for file uploads
- bcryptjs for password hashing

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pdam
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE pdam_bills;
   CREATE USER postgres WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE pdam_bills TO postgres;
   ```

4. **Configure environment variables**
   
   Backend (.env):
   ```
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=pdam_bills
   DB_USER=postgres
   DB_PASSWORD=password
   ```

   Frontend (.env):
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Or run separately:
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

## Usage

1. **Registration/Login**
   - Navigate to `/register` to create a new account
   - Login with your credentials at `/login`

2. **Dashboard**
   - View usage and cost statistics
   - Interactive charts showing trends over time

3. **Bill Management**
   - Create new bills with automatic cost calculation
   - Use OCR to extract meter readings from photos
   - Edit and delete existing bills

4. **OCR Feature**
   - Upload clear photos of water meters
   - System automatically extracts numerical readings
   - Manual correction available if needed

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Bills
- `GET /api/bills` - Get all bills for user
- `POST /api/bills` - Create new bill
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill
- `GET /api/bills/dashboard/stats` - Get dashboard statistics

### OCR
- `POST /api/ocr/process-meter` - Process meter photo with OCR

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bills Table
```sql
CREATE TABLE bills (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  period_month INTEGER NOT NULL,
  period_year INTEGER NOT NULL,
  previous_reading DECIMAL(10,2) DEFAULT 0,
  current_reading DECIMAL(10,2) NOT NULL,
  usage_m3 DECIMAL(10,2) GENERATED ALWAYS AS (current_reading - previous_reading) STORED,
  cost DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'unpaid',
  due_date DATE,
  paid_date DATE,
  meter_photo_path VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, period_month, period_year)
);
```

## Bill Calculation Logic

The system uses PDAM's pricing structure:
- **Base Rate**: Rp 20,000 for usage ≤ 20m³
- **Excess Rate**: Rp 3,000 per m³ for usage > 20m³

Example:
- Usage 15m³ = Rp 20,000
- Usage 25m³ = Rp 20,000 + (5 × Rp 3,000) = Rp 35,000

## Production Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   - Update database credentials
   - Set secure JWT secret
   - Configure CORS origins

3. **Deploy to your preferred platform**
   - Frontend: Netlify, Vercel, or serve static files
   - Backend: Heroku, DigitalOcean, AWS, etc.
   - Database: PostgreSQL hosted service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the repository or contact the development team.
