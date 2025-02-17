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