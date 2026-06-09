export interface Author {
  id: string;
  name: string;
  avatar: string | null;
}

export interface PostItem {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  author: Author;
  isOwn: boolean;
  commentCount: number;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  content: string;
  author: Author;
  isOwn: boolean;
  createdAt: string;
}

export interface PostDetail extends PostItem {
  comments: CommentItem[];
}

export interface MyComment extends CommentItem {
  post: {
    id: string;
    title: string;
  };
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
