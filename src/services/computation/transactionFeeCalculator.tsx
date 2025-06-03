// Function to calculate the transaction fee based on the amount
export const calculateTransactionFee = (amount: number) => {
  if (amount <= 5000) {
    return 0; // 0 XAF fee for amounts <= 5000 XAF
  } else if (amount > 5000 && amount <= 50000) {
    return (2.0 / 100) * amount; // 1000 XAF fee for amounts between 5001 XAF and 500000 XAF
  } else {
    return (2.5 / 100) * amount; // Default fee for amounts > 500000 XAF (not allowed)
  }
};
