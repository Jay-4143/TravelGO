import api from './axios';

export const searchHotels = (params) => {
  const q = new URLSearchParams();
  if (params.city) q.set('city', params.city);
  if (params.minPrice != null) q.set('minPrice', params.minPrice);
  if (params.maxPrice != null) q.set('maxPrice', params.maxPrice);
  if (params.minRating != null) q.set('minRating', params.minRating);
  if (params.starCategory != null) q.set('starCategory', params.starCategory);
  if (params.amenities) q.set('amenities', Array.isArray(params.amenities) ? params.amenities.join(',') : params.amenities);
  if (params.freeCancellation === true) q.set('freeCancellation', 'true');
  if (params.propertyType) q.set('propertyType', params.propertyType);
  if (params.checkIn) q.set('checkIn', params.checkIn);
  if (params.checkOut) q.set('checkOut', params.checkOut);
  if (params.sort) q.set('sort', params.sort);
  if (params.order) q.set('order', params.order);
  q.set('page', params.page || 1);
  q.set('limit', params.limit || 20);
  return api.get(`/hotels/search?${q.toString()}`);
};

export const getHotelById = (id) => api.get(`/hotels/${id}`);
export const getFeaturedHotels = (limit = 8) => api.get(`/hotels/featured`, { params: { limit } });
export const getPopularDestinations = () => api.get(`/hotels/destinations`);
export const getRoomAvailability = (hotelId, checkIn, checkOut) =>
  api.get(`/hotels/${hotelId}/rooms/availability`, { params: { checkIn, checkOut } });
