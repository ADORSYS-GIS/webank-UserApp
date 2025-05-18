import { useSelector } from 'react-redux';
import { RootState } from '@wua/store/Store.ts';

export function useAccountId(): string {
  const accountId = useSelector((state: RootState) => state.account.accountId);
  return accountId ?? '';
}

export function useIsRegistered(): boolean {
  return useAccountId() !== '';
}