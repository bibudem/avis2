const { createSlice } = require('@reduxjs/toolkit')

const appSlice = createSlice({
  name: 'app',
  initialState: {
    dataLastUpdated: null
  },
  reducers: {
    updateDataLastUpdated(state, action) {
      state.dataLastUpdated = Date.now()
    }
  }
})

export const { updateDataLastUpdated } = appSlice.actions

export default appSlice.reducer