import { RootState } from '@wua/store/Store.ts';
import { useSelector } from 'react-redux';

export function useAccountId(): string {
  const accountId = useSelector((state: RootState) => state.account.accountId);
  return accountId ?? '';
}

export function useIsRegistered(): boolean {
  return useAccountId() !== '';
}
