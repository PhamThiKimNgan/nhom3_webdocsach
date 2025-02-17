interface TopList {
      top_list_id: number;
      story_id: number;
      type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
      start_date?: Date;
      end_date?: Date;
      rank?: number;
  }