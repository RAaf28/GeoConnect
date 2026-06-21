import axios from 'axios';
import { EXPO_PUBLIC_GOOGLE_PLACES_API_KEY } from '@env';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

/**
 * Cari venue terdekat berdasarkan koordinat user
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} radius - dalam meter, default 1000
 * @param {string} type - tipe venue (cafe, restaurant, dsb)
 */
export const getNearbyPlaces = async (latitude, longitude, radius = 1000, type = '') => {
  try {
    const response = await axios.get(`${BASE_URL}/nearbysearch/json`, {
      params: {
        location: `${latitude},${longitude}`,
        radius,
        type,
        key: EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('getNearbyPlaces error:', error);
    throw error;
  }
};

/**
 * Cari venue berdasarkan keyword
 * @param {string} query - keyword pencarian
 * @param {number} latitude
 * @param {number} longitude
 */
export const searchPlaces = async (query, latitude, longitude) => {
  try {
    const response = await axios.get(`${BASE_URL}/textsearch/json`, {
      params: {
        query,
        location: `${latitude},${longitude}`,
        radius: 5000,
        key: EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('searchPlaces error:', error);
    throw error;
  }
};

/**
 * Ambil detail venue by place_id
 * @param {string} placeId - dari hasil getNearbyPlaces
 */
export const getPlaceDetail = async (placeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/details/json`, {
      params: {
        place_id: placeId,
        fields: 'name,rating,formatted_address,photos,types,opening_hours,geometry',
        key: EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error('getPlaceDetail error:', error);
    throw error;
  }
};

/**
 * Ambil URL foto venue dari Places API
 * @param {string} photoReference - dari data foto venue
 * @param {number} maxWidth
 */
export const getPlacePhotoUrl = (photoReference, maxWidth = 400) => {
  return `${BASE_URL}/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`;
};