import { createAsyncThunk } from '@reduxjs/toolkit';
import { KeyManagement } from '@wua/services/keyManagement/requestService.ts';
import CryptoJS from 'crypto-js';
import * as jose from 'jose';

export interface GenerateJwtRequest {
  devJwt?: string,
  phoneNumberJwt?: string,
  accountJwt?: string,
  transactionJwt?: string,
  kycJwt?: string,
  recoveryJwt?: string,
  payload: string;
}

export const generateJwtTokenAsyncThunk = createAsyncThunk(
  'jwt/generateJwt',
  async (request: GenerateJwtRequest) => {
    const { publicKey: publicKeyJWK, privateKey: privateKeyJWK } = await KeyManagement();

    const hashedPayload = CryptoJS.SHA256(request.payload).toString(CryptoJS.enc.Hex);

    const privateKey = await jose.importJWK(privateKeyJWK, 'ES256');

    const header: jose.JWTHeaderParameters = {
      typ: 'JWT',
      alg: 'ES256',
      jwk: publicKeyJWK,
    };

    if (request.devJwt) {
      header['devJwt'] = request.devJwt;
    }
    if (request.phoneNumberJwt) {
      header['phoneNumberJwt'] = request.phoneNumberJwt;
    }
    if (request.accountJwt) {
      header['accountJwt'] = request.accountJwt;
    }
    if (request.transactionJwt) {
      header['transactionJwt'] = request.transactionJwt;
    }

    if (request.kycJwt) {
      header['kycCertJwt'] = request.kycJwt;
    }
    if (request.recoveryJwt) {
      header['recoveryJwt'] = request.recoveryJwt;
    }

    return await new jose.SignJWT({
      hash: hashedPayload,
    })
      .setProtectedHeader(header)
      .sign(privateKey);
  },
);
