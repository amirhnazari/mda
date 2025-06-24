import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import SendIcon from "@mui/icons-material/Send";
import { Comment } from "@models/index";
import { createNewComment } from "@utils/CommentsHandler";
import { getAvatarByAlias } from "@utils/avatarMapping";
import { getDoneButtonStyles, getDoneIconStyles } from "@styles/commentsStyles";
import DeleteConfirmationDialog from "@components/common/DeleteConfirmationDialog";

interface CommentsProps {
  open: boolean;
  onClose: () => void;
  comments: Comment[];
  onCommentAdd: (newComment: Comment) => void;
  onCommentDelete: (commentId: string) => void;
  onCommentDone: (commentId: string) => void;
}

/**
 * Comments Component
 *
 * Slide-out drawer interface for patient comments management:
 * - Displays existing comments in chronological order
 * - Add new comments with rich text input
 * - Delete individual comments
 * - Keyboard shortcuts for comment submission
 * - Responsive design for mobile and desktop
 * - Auto-focus on text input for better UX
 *
 * Features:
 * - Drawer slides from right side of screen
 * - Real-time comment addition
 * - Author avatars and timestamps
 * - Keyboard navigation (Enter to submit)
 */
const Comments: React.FC<CommentsProps> = ({
  open,
  onClose,
  comments,
  onCommentAdd,
  onCommentDelete,
  onCommentDone,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  /**
   * Handle new comment submission
   * Validates input, creates comment object, and clears input
   */
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = createNewComment(newComment);
      onCommentAdd(comment);
      setNewComment("");
    }
  };

  /**
   * Handle keyboard shortcuts for comment submission
   * Enter without Shift submits comment, Shift+Enter creates new line
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAddComment();
    }
  };

  const handleDeleteClick = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (commentToDelete) {
      onCommentDelete(commentToDelete);
    }
    handleCancelDelete();
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          // Responsive drawer width
          paper: { sx: { width: { xs: "100%", sm: 450 } } },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
        >
          {/* Comments List - Scrollable Area */}
          <List sx={{ flexGrow: 1, overflow: "auto", mb: 2 }}>
            {comments
              .sort((a, b) => {
                // Sort: not done comments first, then done comments
                if (a.done !== b.done) {
                  return a.done ? 1 : -1;
                }
                // Within each group, sort by timestamp (newest first)
                return b.timestamp.valueOf() - a.timestamp.valueOf();
              })
              .map((comment) => (
                <ListItem
                  key={comment.id}
                  alignItems="flex-start"
                  sx={{
                    "& .MuiListItemAvatar-root": {
                      alignSelf: "center",
                      minHeight: "auto",
                    },
                    "& .MuiListItemText-root": {
                      marginRight: 2,
                      maxWidth: "240px", // Constrain width to encourage wrapping
                      wordWrap: "break-word", // Ensure long words also wrap
                    },
                    opacity: comment.done ? 0.6 : 1,
                    transition: "opacity 0.2s ease-in-out",
                  }}
                  secondaryAction={
                    // Done and Delete button for each comment
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        edge="end"
                        aria-label="done"
                        onClick={() => onCommentDone(comment.id)}
                        sx={getDoneButtonStyles(comment.done)}
                      >
                        <DoneIcon sx={getDoneIconStyles(comment.done)} />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(comment.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  {/* Comment author avatar */}
                  <ListItemAvatar>
                    <Avatar src={getAvatarByAlias(comment.avatarAlias)} />
                  </ListItemAvatar>

                  {/* Comment content and metadata */}
                  <ListItemText
                    primary={
                      <Typography
                        component="span"
                        variant="subtitle2"
                        color="text.primary"
                      >
                        {comment.author}
                      </Typography>
                    }
                    secondary={
                      <>
                        {/* Comment text */}
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: "block" }}
                        >
                          {comment.content}
                        </Typography>
                        {/* Comment timestamp */}
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {comment.timestamp.format("MMM D, YYYY h:mm A")}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
          </List>

          {/* Comment Input Area - Fixed at Bottom */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a comment..."
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Drawer>
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName="comment"
      />
    </>
  );
};

export default Comments;
