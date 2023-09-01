'use client'

import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import appReducer from './slices/appSlice'

const store = configureStore({
  reducer: {
    app: appReducer
  }
})

export function StoreProvider(props) {
  return <Provider store={store}>{props.children}</Provider>
}