import { Timestamp } from "firebase/firestore";

export interface CommonState {
  username: string;
  userImage: string;
  following: Array<CommonState>;
  followers: Array<CommonState>;
  uid: string;
  status: string;
  [key: string]: any;
}

export interface PostsState {
  caption: string;
  postImage: string;
  timestamp: Timestamp;
  uid: string;
  username: string;
  userImage: string;
  id: string;
}

export interface CommentState {
  comment: string;
  commentedUsername: string;
  commentedUserImage: string;
  timestamp: Timestamp;
  id: string;
}

export interface LikeState {
  likedPersonUsername: string;
  id: string;
}
