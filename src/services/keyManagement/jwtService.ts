import * as jose from 'jose';
import CryptoJS from 'crypto-js';

function hashPayload(payload: any): string {
    return CryptoJS.SHA256(JSON.stringify(payload)).toString(CryptoJS.enc.Hex);
}

export async function generateJWT(data: any, publicKeyJWK: any, privateKeyJWK: any): Promise<string> {
    // Hash the payload
    const hashedPayload = hashPayload(data);

    // Create the JWT payload
    const jwtPayload = {
        hash: hashedPayload,
        publicKey: publicKeyJWK, // Use the public key as is
    };

    // Convert the JWK to a CryptoKey
    const privateKey = await jose.importJWK(privateKeyJWK, 'ES256');

    // Sign the JWT with the private key
    const jwt = await new jose.SignJWT(jwtPayload)
        .setProtectedHeader({ alg: 'ES256' })
        .sign(privateKey);

    return jwt;
}
