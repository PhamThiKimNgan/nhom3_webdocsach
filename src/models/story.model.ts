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