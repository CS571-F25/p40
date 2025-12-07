// src/components/CommentSection.jsx
import { useState, useEffect } from "react";
import { Container, Card, Row, Col, Badge } from "react-bootstrap";
import { getCityComments, getAverageRating, getRatingDistribution } from "../utils/commentUtils";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import "./CommentSection.css";

export default function CommentSection({ cityId, cityName }) {
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});

  // 初始化和监听评论更新
  useEffect(() => {
    loadComments();
  }, [cityId]);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (!e.detail || e.detail.cityId === cityId) {
        loadComments();
      }
    };

    window.addEventListener("commentsUpdated", handleUpdate);
    return () => window.removeEventListener("commentsUpdated", handleUpdate);
  }, [cityId]);

  const loadComments = () => {
    const cityComments = getCityComments(cityId);
    setComments(cityComments);
    setAverageRating(getAverageRating(cityId));
    setRatingDistribution(getRatingDistribution(cityId));
  };

  const handleCommentAdded = () => {
    loadComments();
  };

  const handleCommentDeleted = () => {
    loadComments();
  };

  const renderRatingBar = (rating, count, total) => {
    const percentage = total === 0 ? 0 : (count / total) * 100;
    return (
      <div key={rating} className="rating-bar-row d-flex align-items-center mb-2">
        <span className="rating-label">{rating}★</span>
        <div className="rating-bar-container">
          <div className="rating-bar-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <span className="rating-count">{count}</span>
      </div>
    );
  };

  return (
    <div className="comment-section mt-5 pt-5 border-top">
      <Container>
        <div className="comments-header mb-5">
          <h2 className="mb-4">🗣️ Visitor Reviews</h2>

          {/* 评分统计卡片 */}
          {comments.length > 0 && (
            <Card className="rating-summary-card mb-4 border-0 shadow-sm">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={4} className="text-center border-end">
                    <div className="average-rating-display">
                      <div className="rating-number">{averageRating}</div>
                      <div className="rating-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`star-lg ${
                              i < Math.round(averageRating) ? "filled" : "empty"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <small className="text-muted d-block mt-2">
                        Based on {comments.length} review{comments.length !== 1 ? "s" : ""}
                      </small>
                    </div>
                  </Col>
                  <Col md={8}>
                    <h6 className="mb-3">Rating Distribution</h6>
                    {[5, 4, 3, 2, 1].map((rating) =>
                      renderRatingBar(rating, ratingDistribution[rating], comments.length)
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </div>

        {/* 评论表单 */}
        <CommentForm cityId={cityId} onCommentAdded={handleCommentAdded} />

        {/* 评论列表 */}
        <div className="comments-list mt-5">
          {comments.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted fs-5">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          ) : (
            <>
              <h5 className="mb-4">All Reviews ({comments.length})</h5>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={handleCommentDeleted}
                />
              ))}
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
