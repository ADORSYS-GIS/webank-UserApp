import { generateJWT } from "./jwtService";
import { KeyManagement } from "./requestService";

export async function signTransaction(
  accountId: string,
  amount: number,
  accountJwt: string,
): Promise<string> {
  try {
    const { privateKey } = await KeyManagement();

    const data = [accountId, amount.toString()];

    const jwt = await generateJWT(
      privateKey,
      null,
      null,
      null,
      accountJwt,
      ...data,
    );

    return jwt;
  } catch (error) {
    console.error("Error signing transaction:", error);
    throw new Error("faile to sign transaction");
  }
}
