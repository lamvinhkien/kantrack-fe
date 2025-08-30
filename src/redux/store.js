import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './user/userSlice'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { activeCardReducer } from './activeCard/activeCardSlice'
import storage from 'redux-persist/lib/storage'

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user']
}

const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  activeCard: activeCardReducer,
  user: userReducer
})

const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})