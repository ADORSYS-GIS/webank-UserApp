// Function to calculate the transaction fee based on the amount
export const calculateTransactionFee = (amount: number) => {
  if (amount <= 5000) {
    return 0; // 0 XAF fee for amounts <= 5000 XAF
  } else if (amount > 5000 && amount <= 500000) {
    return 1000; // 1000 XAF fee for amounts between 5001 XAF and 500000 XAF
  } else {
    return 1000; // Default fee for amounts > 500000 XAF (not allowed)
  }
};
