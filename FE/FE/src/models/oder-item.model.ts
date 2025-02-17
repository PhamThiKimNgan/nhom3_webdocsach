  // order.model.ts
  
  interface OrderItem {
    productID: string;
    productName: string;
    quantity: number;
    price: number;
    imeis: string[];
}

export type {OrderItem};