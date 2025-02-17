interface Customer {
    customer_id: number;
    username: string;
    password: string;
    email: string;
    full_name?: string;
    phone_number?: string;
    address?: string;
    avatar?: string;
    date_of_birth?: Date;
    registration_date: Date;
    last_login?: Date;
    is_active: boolean;
    balance: number;
  }