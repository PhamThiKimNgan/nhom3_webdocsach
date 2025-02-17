// user.model.ts
interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    role: 'admin' | 'staff' | 'customer'; // Định nghĩa rõ các loại vai trò
    createdAt: Date;
    photoURL:string | null;
     // ... other user information
  }
  
  
 export type {User};