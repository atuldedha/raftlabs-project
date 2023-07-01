import { PostsState } from "../../typings";
// bst type declaration
export interface SearchPersonNode {
  username: string;
  posts: PostsState[];
  left: SearchPersonNode | null;
  right: SearchPersonNode | null;
}
// create node func.
const createNode = (post: PostsState): SearchPersonNode => ({
  username: post.username,
  posts: [post],
  left: null,
  right: null,
});

// insert a node func.
export const insertNode = (
  node: SearchPersonNode | null,
  post: PostsState
): SearchPersonNode => {
  if (node === null) {
    return createNode(post);
  }

  if (post.username < node.username) {
    node.left = insertNode(node.left, post);
  } else if (post.username > node.username) {
    node.right = insertNode(node.right, post);
  } else {
    node.posts.push(post);
  }

  return node;
};

// search node func.
export const searchByUsername = (
  node: SearchPersonNode | null,
  username: string
): PostsState[] => {
  if (node === null) {
    return [];
  }
  if (username) {
    if (node.username.includes(username)) {
      return node.posts;
    } else if (username < node.username) {
      return searchByUsername(node.left, username);
    } else {
      return searchByUsername(node.right, username);
    }
  } else {
    return [];
  }
};
