interface Admin {
    admin_id: number;
    username: string;
    password: string;
    email: string;
    full_name?: string;
    role?: string;
    last_login?: Date;
  }

export type { Admin };