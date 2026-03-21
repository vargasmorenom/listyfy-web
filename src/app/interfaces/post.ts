export interface Post {
  _id: string;
  likes?: string[];
  postedBy?: string;
  content?: string;
}