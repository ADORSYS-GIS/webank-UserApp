import { AppDispatch } from '@wua/store/Store.ts';
import { useDispatch } from 'react-redux';

export function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
