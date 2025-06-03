export interface TransactionProjection {
  id: number;
  date: number;
  amount: string;
  title: string;
}

export const toTransactionProjection = (data: any): TransactionProjection => {
  return {
    id: data.id,
    date: data.date,
    amount: data.amount,
    title: data.title
  };
}; 