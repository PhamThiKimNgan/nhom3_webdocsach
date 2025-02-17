  // warranty.model.ts
  interface Warranty {
    imei: string;
    productID: string;
    purchaseDate: Date;
    expiryDate: Date;
    status: 'active' | 'expired' | 'claimed';
    customerUID:string;
     // ... other warranty information
}

export type {Warranty};