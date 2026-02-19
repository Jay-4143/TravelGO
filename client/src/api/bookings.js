import api from './axios';

export const createFlightBooking = (data) => api.post('/bookings/flight', data);
export const createHotelBooking = (data) => api.post('/bookings/hotel', data);
export const getMyBookings = (params) => {
  const q = new URLSearchParams(params || {}).toString();
  return api.get(`/bookings${q ? `?${q}` : ''}`);
};
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id, reason) => api.post(`/bookings/${id}/cancel`, { reason });
