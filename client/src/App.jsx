import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Flights from './pages/Flights';
import FlightBooking from './pages/FlightBooking';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import HotelBooking from './pages/HotelBooking';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Flights />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/flights/booking" element={<FlightBooking />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/hotels/booking" element={<HotelBooking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}  

export default App;

