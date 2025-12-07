// src/components/CommentForm.jsx
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { addComment } from "../utils/commentUtils";
import "./CommentForm.css";

export default function CommentForm({ cityId, onCommentAdded }) {
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const newComment = addComment(cityId, author, rating, text);
      setSuccess("Comment added successfully!");
      setAuthor("");
      setRating(5);
      setText("");

      // 延迟调用回调，让用户看到成功消息
      setTimeout(() => {
        onCommentAdded(newComment);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderRatingOptions = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const value = i + 1;
      return (
        <option key={value} value={value}>
          {"★".repeat(value)} {value}/5
        </option>
      );
    });
  };

  return (
    <div className="comment-form-container mb-5 p-4 bg-light rounded">
      <h5 className="mb-4">Share Your Experience</h5>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Your Name *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={50}
            disabled={loading}
          />
          <Form.Text className="text-muted">
            {author.length}/50 characters
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rating *</Form.Label>
          <Form.Select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            disabled={loading}
          >
            {renderRatingOptions()}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Your Comment *</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Share your thoughts about this destination..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            disabled={loading}
          />
          <Form.Text className="text-muted">
            {text.length}/500 characters
          </Form.Text>
        </Form.Group>

        <div className="d-flex gap-2">
          <Button
            variant="primary"
            type="submit"
            disabled={loading || !author.trim() || !text.trim()}
            className="comment-submit-btn"
          >
            {loading ? "Posting..." : "Post Comment"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setAuthor("");
              setRating(5);
              setText("");
              setError("");
            }}
            disabled={loading}
          >
            Clear
          </Button>
        </div>
      </Form>
    </div>
  );
}
