import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActiveCard: null
}

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
    },

    updateCurrentActiveCard: (state, action) => {
      state.currentActiveCard = action.payload
    }
  },

  extraReducers: () => { }
})

export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const activeCardReducer = activeCardSlice.reducer