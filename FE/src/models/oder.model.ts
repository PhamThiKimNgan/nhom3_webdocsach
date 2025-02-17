import { OrderItem,ShippingAddress  } from "@/models";

interface Order {
    orderID: string;
    customerUID: string;
    customerInfo: {
      displayName: string | null;
      email: string | null;
      phoneNumber: string | null;
        // ... other customer information
    };
    orderDate: Date;
    status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
    totalAmount: number;
    orderItems: OrderItem[];
    shippingAddress:ShippingAddress;
  }

  export type {Order};