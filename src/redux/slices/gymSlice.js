import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    gymList: [],
    selectedGym: null,
};

const gymSlice = createSlice({
    name: 'gym',
    initialState,
    reducers: {
        setGymList: (state, action) => {
            state.gymList = action.payload;
            if (action.payload.length > 0 && !state.selectedGym) {
                state.selectedGym = action.payload[0];
            }
        },
        setSelectedGym: (state, action) => {
            state.selectedGym = action.payload;
        },
    },
});

export const { setGymList, setSelectedGym } = gymSlice.actions;
export default gymSlice.reducer;