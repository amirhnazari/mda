import { Comment } from "@models/index";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

interface RawComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatarAlias?: string;
  done: boolean;
}

export const initializeComments = (
  patientComments: RawComment[]
): Comment[] => {
  return patientComments.map((rawComment) => {
    const avatarAlias =
      rawComment.avatarAlias ??
      rawComment.author.toLowerCase().replace(/[. ]/g, "-");

    return {
      id: rawComment.id,
      author: rawComment.author,
      content: rawComment.content,
      timestamp: moment(rawComment.timestamp),
      avatarAlias,
      done: rawComment.done,
    };
  });
};

export const createNewComment = (content: string): Comment => {
  return {
    id: uuidv4(),
    author: "Dev Amir Nazari",
    content: content.trim(),
    timestamp: moment(),
    avatarAlias: "dev-amir-nazari",
    done: false,
  };
};

export const deleteComment = (
  comments: Comment[],
  commentId: string
): Comment[] => {
  return comments.filter((comment) => comment.id !== commentId);
};

export const addComment = (
  comments: Comment[],
  newComment: Comment
): Comment[] => {
  return [...comments, newComment];
};
