export type BookData = {
  id: string;
  title: string;
  author: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MemoData = {
  id: number;
  content: string;
  bookId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
