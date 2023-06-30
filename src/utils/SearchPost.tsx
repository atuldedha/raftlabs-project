export type SearchPersonNode = {
  data: {
    timestamp: Date;
    caption: string;
    postImage: string;
    likes: number;
    comments: number;
    username: string;
    userImage: string;
    uid: string;
  };
  left?: SearchPersonNode;
  right?: SearchPersonNode;
};

export const insertNode = (
  root: SearchPersonNode,
  data: {
    timestamp: Date;
    caption: string;
    postImage: string;
    likes: number;
    comments: number;
    username: string;
    userImage: string;
    uid: string;
  }
): SearchPersonNode => {
  if (!root) {
    return { data };
  }

  if (data.username < root.data.username) {
    if (root.left) {
      root.left = insertNode(root.left, data);
    }
  } else if (data.username > root.data.username) {
    if (root.right) {
      root.right = insertNode(root.right, data);
    }
  }

  return root;
};

export const searchByUsername = (
  root: SearchPersonNode | null,
  username: string
): SearchPersonNode | null => {
  if (!root || root.data.username === username) {
    return root;
  }

  if (username < root.data.username) {
    if (root.left) return searchByUsername(root.left, username);
  }
  if (root.right) return searchByUsername(root.right, username);

  return null;
};
