// src/components/CommentItem.jsx
import { Card, Button, Badge } from "react-bootstrap";
import { ThumbsUp, Trash2 } from "lucide-react";
import { formatTime, markCommentHelpful, deleteComment } from "../utils/commentUtils";
import "./CommentItem.css";

export default function CommentItem({ comment, onDelete }) {
  const handleHelpful = () => {
    markCommentHelpful(comment.id);
    // 触发父组件更新
    window.dispatchEvent(new CustomEvent("commentsUpdated"));
  };

  const handleDelete = () => {
    if (window.confirm("Delete this comment?")) {
      deleteComment(comment.id);
      onDelete(comment.id);
    }
  };

  // 生成星星评分显示
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`star ${i < rating ? "filled" : "empty"}`}>
        ★
      </span>
    ));
  };

  return (
    <Card className="comment-item mb-3 border-0 shadow-sm">
      <Card.Body>
        <div className="comment-header d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="comment-author mb-1">{comment.author}</h6>
            <div className="comment-rating mb-2">
              {renderStars(comment.rating)}
              <span className="rating-text ms-2">({comment.rating}/5)</span>
            </div>
          </div>
          <small className="text-muted">{formatTime(comment.timestamp)}</small>
        </div>

        <p className="comment-text mb-3">{comment.text}</p>

        <div className="comment-footer d-flex justify-content-between align-items-center">
          <div className="comment-actions">
            <Button
              variant="link"
              size="sm"
              className="p-0 me-3 d-inline-flex align-items-center"
              onClick={handleHelpful}
            >
              <ThumbsUp size={16} className="me-1" />
              <span className="helpful-count">{comment.helpful}</span>
            </Button>
            <Button
              variant="link"
              size="sm"
              className="p-0 text-danger d-inline-flex align-items-center"
              onClick={handleDelete}
            >
              <Trash2 size={16} className="me-1" />
              Delete
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
