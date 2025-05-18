import { createAsyncThunk } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';
import { canonicalize } from 'json-canonicalize';
import { getProjectEnvVariables } from '@wua/shared/projectEnvVariables.ts';
import { retrieveKeyPair } from '@wua/services/keyManagement/storeKey.ts';

const { envVariables } = getProjectEnvVariables();

export interface ProofOfWork {
  initiationNonce: string,
  difficulty?: number,
}

export const proofOfWorkAsyncThunk = createAsyncThunk(
  'pow/proofOfWork',
  async ({ difficulty = envVariables.VITE_POW_DIFFICULTY, initiationNonce }: ProofOfWork) => {
    const { publicKey } = await retrieveKeyPair(1);

    const target = '0'.repeat(difficulty);
    let powNonce = 0;
    let powHash = '';

    const start = Date.now();
    // Iterate until a hash matching the difficulty is found
    // const canonicalDevicePub = canonicalize(devicePub);
    let canonicalInput;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Proiduce an input JSON out of initiationNonce, devicePub, and powNonce
      const input = {
        initiationNonce,
        devicePub: publicKey,
        powNonce: powNonce.toString(),
      };

      // Canonicalize the input to generate a hash
      canonicalInput = canonicalize(input);
      powHash = CryptoJS.SHA256(canonicalInput).toString(CryptoJS.enc.Hex);

      // Check if hash meets the difficulty
      if (powHash.startsWith(target)) {
        console.log(`Proof of Work completed in ${(Date.now() - start) / 1000}s`);
        break;
      }

      powNonce++;

      // Optional: Log progress every 1M attempts
      if (powNonce % 1_000_000 === 0) {
        console.log(`Attempts: ${powNonce}`);
      }
    }

    console.log(canonicalInput);
    return { powHash, powNonce };
  },
);
