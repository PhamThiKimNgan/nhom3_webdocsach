interface Review {
    review_id: number;
    customer_id: number;
    story_id: number;
    rating: number;
    comment?: string;
    review_date: Date;
  }