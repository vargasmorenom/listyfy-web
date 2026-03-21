export interface LikeUpdate {
  postId: string;
  newLikeCount: number;
  userId: string;
  action: 'like' | 'unlike';
}