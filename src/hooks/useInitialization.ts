import moment from 'moment';
import { useCallback } from 'react';
import { usePostDevInitMutation, usePostDevValidateMutation } from '@gen/store/prf-api.gen';
import { proofOfWorkAsyncThunk } from '@wua/slices/pow.thunk.ts';
import { useAppDispatch } from '@wua/store/re-export.ts';
import { usePostRegistrationMutation } from '@gen/store/obs-api.gen';
import { setAccountCert, setAccountId } from '@wua/slices/account.slice.ts';

export const useMakeInit = () => {
  const [registerDevice] = usePostRegistrationMutation();
  const [getNonce] = usePostDevInitMutation();
  const [validateDeviceRegistration] = usePostDevValidateMutation();
  const dispatch = useAppDispatch();

  const makeInit = useCallback(async () => {
    const timeStamp = moment().toISOString();
    const response = await getNonce({
      timeStampRequest: {
        timeStamp: timeStamp,
      },
    });

    if (response.error) {
      throw response.error;
    }

    const initiationNonce = response.data?.initiationNonce;
    if (!initiationNonce) {
      throw new Error('Failed to receive initiation nonce from the server.');
    }

    const { payload } = await dispatch(proofOfWorkAsyncThunk({ initiationNonce }));
    const { powHash, powNonce } = payload as { powHash: string, powNonce: number };
    if (!powHash || !powNonce) {
      throw new Error('Failed to perform proof of work.');
    }

    const devRegResponse = await validateDeviceRegistration({
      deviceValidationRequest: {
        initiationNonce,
        powHash,
        powNonce: powNonce.toString(),
      },
    });

    if (devRegResponse.error) {
      throw devRegResponse.error;
    }

    const devCert = devRegResponse.data?.message;
    if (!devCert) {
      throw new Error('Failed to receive device certificate from the server.');
    }

    const registerDeviceResponse = await registerDevice({
      body: {
        devJwt: devCert,
      },
    });

    if (registerDeviceResponse.error) {
      throw registerDeviceResponse.error;
    }

    const message = registerDeviceResponse.data?.accountId;
    if (!message?.startsWith('Bank account successfully created.')
    ) {
      throw new Error('Failed to create bank account.');
    }

    const accountId = message.split('\n')[2];
    const accountCert = accountId.split('\n')[4];

    dispatch(setAccountId(accountId));
    dispatch(setAccountCert(accountCert));
  }, [dispatch, getNonce, registerDevice, validateDeviceRegistration]);

  return { makeInit };
};