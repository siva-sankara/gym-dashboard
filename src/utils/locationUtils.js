import axios from 'axios';

const LOCATION_IQ_API_KEY = 'pk.88f655e1c2a39a18eba810792c609ad0';

export const getLocationFromAddress = async (address) => {
    try {
        const response = await axios.get(
            `https://us1.locationiq.com/v1/search`,
            {
                params: {
                    key: LOCATION_IQ_API_KEY,
                    q: address,
                    format: 'json',
                    limit: 1,
                    addressdetails: 1
                }
            }
        );

        if (response.data && response.data.length > 0) {
            const location = response.data[0];
            const locationData = {
                coordinates: {
                    latitude: parseFloat(location.lat),
                    longitude: parseFloat(location.lon)
                },
                address: {
                    display_name: location.display_name,
                    area: location?.address?.suburb || location?.address?.neighbourhood || '',
                    city: location?.address?.city || location?.address?.town || '',
                    state: location?.address?.state || '',
                    country: location?.address?.country || 'India',
                    pincode: location?.address?.postcode || ''
                },
                placeId: location.place_id,
                osmType: location.osm_type,
                importance: location.importance
            };

            return locationData;
        } else {
            throw new Error('No location found for this address');
        }
    } catch (error) {
        console.error('Error fetching location data:', error);
        throw new Error(error.response?.data?.error || 'Failed to get location data');
    }
};

