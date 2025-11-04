import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentUser: null
}

export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    return response.data
  }
)

export const registerUserAPI = createAsyncThunk(
  'user/registerUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async () => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    return response.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)
    return response.data
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateCurrentUser: (state, action) => {
      state.currentUser = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload
    })
    builder.addCase(registerUserAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      if (action.payload.isLoggedOut) {
        state.currentUser = null
        return
      }
      state.currentUser = action.payload
    })
  }
})

export const { updateCurrentUser } = userSlice.actions

export const selectCurrentUser = (state) => { return state.user.currentUser }

export const userReducer = userSlice.reducer