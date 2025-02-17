interface Transaction {
      transaction_id: number;
      customer_id: number;
      transaction_date: Date;
      amount: number;
      type: 'DEPOSIT' | 'WITHDRAWAL' | 'PURCHASE';
      description?: string;
      status: 'PENDING' | 'COMPLETED' | 'FAILED';
      payment_method?: string;
      payment_plan_id?: number;
  }