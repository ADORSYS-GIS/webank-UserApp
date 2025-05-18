import { setIsMenuOpen } from '@wua/slices/config.slice.ts';
import { useAppDispatch } from '@wua/store/re-export.ts';
import { RootState } from '@wua/store/Store.ts';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

const menuOpenSelector = (state: RootState) => state.config.isMenuOpen;

export function useBottomNav() {
  const isMenuOpen = useSelector(menuOpenSelector);
  const dispatch = useAppDispatch();
  const set = useCallback(
    (state: boolean) => {
      dispatch(setIsMenuOpen(state));
    },
    [dispatch],
  );

  return {
    setIsMenuOpen: set,
    toggleMenu: () => set(!isMenuOpen),
    isMenuOpen,
  };
}
