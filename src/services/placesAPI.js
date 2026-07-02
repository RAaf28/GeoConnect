import axios from "axios";
import { calculateDistance } from "../utils/geoUtils";

// Changed variable name to reflect the environment variable used for Google Maps/Places API
const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

// Mock database matching the visual theme of GeoConnect
const MOCK_PLACES = [
  {
    id: "mock_kinetic_brew",
    name: "The Kinetic Brew",
    category: "Cafe",
    description: "Modernism & Espresso",
    rating: 4.9,
    reviewsCount: 1240,
    address: "42 Meridian Way",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrnsxRXjibSBwD_xcv8jF2V6ybTAeEXdHhIEmoDvG5hwGNaS9SQBiVHJiIKFfoh6gkl0ac2U1rXwf6S62NV3WuFr7CCtuMgW9XJAtAQOh4aLhssQejR1hBzBb1Y60rdos82pZYCd9l9Jb7S355heSvpWEOd0dSsnwwoCRsRcNy5qwKDoP1nTB7O5baSCX5MoPPEEtf-MDyk_NgDx_2SDQzsrH3MXkxEm42nQTn5x94EyQBPHwB6dO-odxDkkcJZKMkdAuQxtRClTWw",
    latOffset: 0.015,
    lngOffset: -0.012,
  },
  {
    id: "mock_gravity_cafe",
    name: "Gravity Cafe & Workspace",
    category: "Cafe",
    description: "Specialty beans & quiet co-working zones",
    rating: 4.8,
    reviewsCount: 680,
    address: "18 Geospatial Road",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLe_ygiAF60MJFXoN9ZuxYCqt36xs0apTpNCCsd7-dI-S0gIUCyAaZxKOM5msbVn6LoKCxuffp-CsN8t4kNZfTO357HjvSjCfca724Ck1pztw_VFblZkftL4ifFfMB8BU2BbM5k3DYbQR6V0UqbRflnHKBCmvd2LL5lUTTeiWFJcgAIdbXsZbH_qSjK-bAMrRPh3pPpbGulKBtXri5cuNgdrhvz2MID-KsxxBuM0zYn-E9NuIqyffj8lK43TsOypb7uwzVqq4SMIE",
    latOffset: -0.008,
    lngOffset: 0.005,
  },
  {
    id: "mock_vertex_plaza",
    name: "Vertex Plaza",
    category: "Park",
    description: "Public Arts & Tech",
    rating: 4.7,
    reviewsCount: 940,
    address: "88 Horizon Blvd",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmBP5y60d-J0Ut-V3ZzAD_tiHYstx35gf9XSGk5_8_V0HJTmDR-8eTvFD7cExJl90HPxn6JNirDA3HbiJVNKzQT_yhq3VqcPe0hdhSxMPZf7EzwiMQqvb6L-zHLVakppcv4vRrwPNLIVp59ANeQv5uREeaWJxCaTW88yBFMAx28kMP999TM95aXrR862_2nKmaAsOy-zNTYYSPEXf0TXKxgXs0hbkhmcFSBOrnyH_D6cDYQcBQ7MvCs0Bqx_BIMfwmobnJThs4FJQ",
    latOffset: 0.006,
    lngOffset: -0.004,
  },
  {
    id: "mock_latitude_park",
    name: "Latitude Park",
    category: "Park",
    description: "Serene walking trails and botanical gardens",
    rating: 4.6,
    reviewsCount: 420,
    address: "100 Equator Parkway",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOjvkDZZHK8pxpM0CoipYY4Y-i4B4IymF_ARLkVPQW93lFbk4etuk4s-T4wJvXfZoCIvcPTfdmtZ7XZs6F4xEjw9MzCJu8BnBWxuEB_tMjJFaujZymckJuWBU3r5-cRAVLgn6dvUUbuZFKBq-lVINGpsr2MdzZb3m34y5stUbN3J_uLFa0N6n05-RCDf11Y9KVhvHwJMBTcNWZL3yHp1wqhYsVjEVTRvXgEvf93-nDjJCyudo8Nusyh59DY-uicnhjE2j4t9z1yuQ",
    latOffset: -0.018,
    lngOffset: 0.014,
  },
  {
    id: "mock_connect_square",
    name: "Connect Square Mall",
    category: "Mall",
    description: "Premier shopping and culinary hotspot",
    rating: 4.5,
    reviewsCount: 2350,
    address: "1 Meridian Center",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuARgKiUxPNXwgIpVhbGbG7mCfUrBZBD3ech4wQgtOMysfXcopoWFCiUYJpnuZ38rP_IM6Hmgqk8JLrNj-Fie8z6JimEiDBxgXE5Kn3O3VtLqAwle4fVQ-vulWs2NV613asTqL43p73vLiMZUCRv3tquTcP3iWtk7bkyWMjQ9ylHeGWZJjcb06F96LzlPc8pYDx7No35lzQsjXyS08ptBeLqpRnybVeErymlzkjMdSi2HywPLHCIY1WA2HYOsd7oWooKb6Wm4HOS-e0IA",
    latOffset: 0.022,
    lngOffset: 0.025,
  },
  {
    id: "mock_prism_museum",
    name: "Prism Modern Museum",
    category: "Culture",
    description: "Contemporary installations & digital art space",
    rating: 4.9,
    reviewsCount: 1530,
    address: "24 Spectrum Avenue",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEai_Klv_9k2j3yby_Nea35rnTKGqMC2fpONYbRi-YbSYaichseMDWfX7QleWqxmyu6qqrkYDcr20vRH1fMQTgL8LoDBaR1hCSV4VxjIbZrQK3zclk0UnzNV3mrdUV83tFdx9eOKNHRPJufQCYQU0tmERJgvXsA6Gwi-TcGEUZXMmRz4hKuMvV9o8S4xd9fdZcict9z2Pthn5QFKwJvDJvOYVHSKHvwDlICXwn-cQ6LfrGPN4Gl-i2TBpNKsbFxRkbigaKSQaTcrI",
    latOffset: -0.005,
    lngOffset: -0.019,
  },
];

export const getNearbyPlaces = async (latitude, longitude, category = "Cafe") => {
  // If a valid Google Places API Key is present, try loading from Google
  if (GOOGLE_PLACES_API_KEY && GOOGLE_PLACES_API_KEY !== "your_google_maps_api_key_here") {
    try {
      if (__DEV__) {
        console.log(`[PlacesAPI] Fetching real Google Places for category: ${category}`);
      }
      const typeMap = {
        Cafe: "cafe",
        Park: "park",
        Mall: "shopping_mall",
        Culture: "museum|art_gallery",
      };
      const type = typeMap[category] || "establishment";
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;
      const response = await axios.get(url);

      if (response.data.status === "OK" || response.data.status === "ZERO_RESULTS") {
        const results = response.data.results || [];
        return results.map((place, idx) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            place.geometry.location.lat,
            place.geometry.location.lng
          );

          let image = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500";
          if (place.photos && place.photos.length > 0) {
            image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`;
          }

          return {
            id: place.place_id || `place_${idx}`,
            name: place.name,
            category: category,
            description: place.vicinity || "Establishment",
            rating: place.rating || 4.5,
            reviewsCount: place.user_ratings_total || 10,
            address: place.vicinity || "Nearby Area",
            image: image,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            distance: distance,
          };
        });
      }
      console.warn(`[PlacesAPI] Google Places API returned status: ${response.data.status}. Falling back to mock data.`);
    } catch (error) {
      console.error("[PlacesAPI] Google Places API call failed:", error.message);
    }
  }

  // Fallback to mock places database relative to the user's location
  if (__DEV__) {
    console.log(`[PlacesAPI] Returning relative mock places for category: ${category}`);
  }
  return MOCK_PLACES.filter((place) => place.category === category).map((place) => {
    const placeLat = latitude + place.latOffset;
    const placeLng = longitude + place.lngOffset;
    const distance = calculateDistance(latitude, longitude, placeLat, placeLng);
    return {
      id: place.id,
      name: place.name,
      category: place.category,
      description: place.description,
      rating: place.rating,
      reviewsCount: place.reviewsCount,
      address: place.address,
      image: place.image,
      latitude: placeLat,
      longitude: placeLng,
      distance: distance,
    };
  });
};