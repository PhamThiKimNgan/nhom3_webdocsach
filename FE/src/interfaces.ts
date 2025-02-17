// Customers
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
  
  // Admins
  interface Admin {
    admin_id: number;
    username: string;
    password: string;
    email: string;
    full_name?: string;
    role?: string;
    last_login?: Date;
  }
  
  
  // Authors
  interface Author {
    author_id: number;
    name: string;
    slug?: string;
    description?: string;
    avatar?: string;
  }
  
  // Categories
  interface Category {
    category_id: number;
    name: string;
    description?: string;
    slug?: string;
  }
  
  // Stories
  interface Story {
    story_id: number;
    title: string;
    slug?: string;
    description?: string;
    cover_image?: string;
    publication_date?: Date;
    status: 'ONGOING' | 'COMPLETED' | 'PAUSED';
    total_views: number;
    rating: number;
    category_id?: number;
    author_id?: number;
  }
  
  
  // Chapters
  interface Chapter {
    chapter_id: number;
    story_id: number;
    chapter_number: number;
    title?: string;
    slug?: string;
    content: string;
    publication_date: Date;
    is_paid: boolean;
  }
  
  // Payment Plans
  interface PaymentPlan {
    payment_plan_id: number;
    name: string;
    description?: string;
    price: number;
    duration?: number;
    duration_unit?: 'DAY' | 'MONTH' | 'YEAR';
    features?: string;
  }
  
  
  // Transactions
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
  
  
  // Transaction Items
  interface TransactionItem {
    transaction_item_id: number;
    transaction_id?: number;
    chapter_id?: number;
    quantity: number;
    price: number;
  }
  
  
  // Reading History
  interface ReadingHistory {
      history_id: number;
      customer_id: number;
      chapter_id: number;
      last_read_date: Date;
  }
  
  // Follows
  interface Follow {
    follow_id: number;
    customer_id: number;
    story_id: number;
    follow_date: Date;
  }
  
  // Reviews
  interface Review {
    review_id: number;
    customer_id: number;
    story_id: number;
    rating: number;
    comment?: string;
    review_date: Date;
  }
  
  // Top Lists
  interface TopList {
      top_list_id: number;
      story_id: number;
      type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
      start_date?: Date;
      end_date?: Date;
      rank?: number;
  }