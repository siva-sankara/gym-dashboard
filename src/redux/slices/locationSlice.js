import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    city: '',
    area: '',
    state: '',
    coordinates: {
        latitude: null,
        longitude: null
    },
    address: null,
    displayName: '',
    placeId: '',
    fullAddress: {}
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setLocation: (state, action) => {
            const { address, lat, lon, place_id, display_name } = action.payload;
            state.city = address.town || address.city || '';
            state.area = address.road || '';
            state.state = address.state || '';
            state.coordinates = {
                latitude: lat,
                longitude: lon
            };
            state.address = address;
            state.displayName = display_name;
            state.placeId = place_id;
            state.fullAddress = action.payload;
        },
        clearLocation: (state) => {
            return initialState;
        }
    }
});

export const { setLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;