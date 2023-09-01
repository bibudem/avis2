import { useDispatch, useSelector } from 'react-redux'
import { updateDataLastUpdated } from '@/redux/slices/appSlice'

export function useDataLastUpdated() {
  const dataLastUpdated = useSelector(state => state.app.dataLastUpdated)
  const dispatch = useDispatch()

  return [
    dataLastUpdated,
    () => dispatch(updateDataLastUpdated())
  ]
}