import { configureStore } from '@reduxjs/toolkit'
import formSliceReducer, { FormState } from './slices/formSlice'

export type RootStore = {
  form: FormState
}

export default configureStore({
  reducer: {
    form: formSliceReducer,
  },
})