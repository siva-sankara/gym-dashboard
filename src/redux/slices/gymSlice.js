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
        updateGymMembers: (state, action) => {
            const { gymId, members } = action.payload;
            if (state.selectedGym?._id === gymId) {
                state.selectedGym.members = members;
            }
        },
    },
});

export const { setGymList, setSelectedGym ,updateGymMembers } = gymSlice.actions;
export default gymSlice.reducer;