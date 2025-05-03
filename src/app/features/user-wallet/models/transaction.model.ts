export interface ITransaction {
  _id: string;
  userId: string;
  walletId: string;
  type: 'topup' | 'purchase' | 'reward';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  createdAt: string;
  updatedAt: string;
}