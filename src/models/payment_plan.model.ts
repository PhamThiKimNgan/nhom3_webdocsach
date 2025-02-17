interface PaymentPlan {
    payment_plan_id: number;
    name: string;
    description?: string;
    price: number;
    duration?: number;
    duration_unit?: 'DAY' | 'MONTH' | 'YEAR';
    features?: string;
  }