# Raj Travels - Complete Travel Booking Platform

Raj Travels is a comprehensive, full-stack travel booking application that provides users with a seamless experience for searching and booking flights, hotels, and buses, as well as applying for visas. The platform features an interactive map UI, multi-step application forms, secure authentication, and a robust payment integration.

## Features

- **Flight Booking**: Search for real-time flight fares and routes powered by the Amadeus API.
- **Hotel Reservations**: Discover hotels with advanced filtering, price add-ons, and an interactive map view (using Leaflet).
- **Bus Booking**: Reserve bus tickets securely and instantly download your confirmed tickets as PDFs.
- **Visa Applications**: A smooth, multi-step form to manage itineraries, upload documents, and process payments for visa applications.
- **Secure Authentication**: User login and registration safeguarded by JWT and bcrypt password hashing.
- **Payment Gateway**: Integrated with Razorpay to process secure transactions for all bookings and services.

## Tech Stack

### Frontend (Client)
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS for responsive and modern UI
- **Routing**: React Router DOM
- **Maps**: Leaflet & React-Leaflet
- **File Generation**: jsPDF & jsPDF-AutoTable (for tickets)
- **HTTP Client**: Axios
- **Icons**: React Icons

### Backend (Server)
- **Framework**: Node.js & Express.js
- **Database**: MongoDB with Mongoose
- **External APIs**: Amadeus API (Flights)
- **Payments**: Razorpay
- **Emails**: Nodemailer
- **Security & Auth**: jsonwebtoken, bcryptjs, express-rate-limit, express-validator

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- A running MongoDB instance (local or MongoDB Atlas)
- Amadeus for Developers API keys
- Razorpay Dashboard credentials

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/RajTravels.git
cd RajTravels
```

### 2. Setup Backend Server
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and configure the required environment variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
AMADEUS_CLIENT_ID=your_amadeus_api_key
AMADEUS_CLIENT_SECRET=your_amadeus_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```
Start the development server:
```bash
npm run dev
```

### 3. Setup Frontend Client
Open a new terminal window and navigate to the client side.
```bash
cd client
npm install
```
*(Optional)* Create a `.env` file in the `client` directory if needed for frontend specific variables (e.g., `VITE_API_URL=http://localhost:5000`).

Start the frontend Vite server:
```bash
npm run dev
```

## Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## License
This project is licensed under the MIT License.
