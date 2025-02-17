 // product.model.ts
 interface Product {
    productID: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stockQuantity: number;
    createdAt: Date;
     // ... other product information
}

export type {Product};