// src/utils/commentUtils.js

/**
 * 评论数据结构
 * {
 *   id: 唯一ID (timestamp + random)
 *   cityId: 所属城市ID
 *   author: 评论者名字
 *   rating: 评分 (1-5)
 *   text: 评论内容
 *   timestamp: 创建时间 (毫秒)
 *   helpful: 有用的点赞数
 * }
 */

const COMMENTS_STORAGE_KEY = "cityComments";

/**
 * 获取所有评论
 */
export function getAllComments() {
  try {
    const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading comments:", error);
    return [];
  }
}

/**
 * 获取特定城市的评论
 */
export function getCityComments(cityId) {
  const allComments = getAllComments();
  return allComments
    .filter((comment) => comment.cityId === Number(cityId))
    .sort((a, b) => b.timestamp - a.timestamp); // 按时间倒序
}

/**
 * 添加评论
 */
export function addComment(cityId, author, rating, text) {
  if (!author.trim() || !text.trim() || !rating) {
    throw new Error("Please fill in all fields");
  }

  const allComments = getAllComments();
  const newComment = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    cityId: Number(cityId),
    author: author.trim(),
    rating: Number(rating),
    text: text.trim(),
    timestamp: Date.now(),
    helpful: 0,
  };

  allComments.push(newComment);
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(allComments));

  // 触发更新事件
  window.dispatchEvent(new CustomEvent("commentsUpdated", { detail: { cityId } }));

  return newComment;
}

/**
 * 删除评论
 */
export function deleteComment(commentId) {
  const allComments = getAllComments();
  const filtered = allComments.filter((c) => c.id !== commentId);
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(filtered));

  window.dispatchEvent(new CustomEvent("commentsUpdated"));
  return true;
}

/**
 * 点赞评论（有用）
 */
export function markCommentHelpful(commentId) {
  const allComments = getAllComments();
  const comment = allComments.find((c) => c.id === commentId);

  if (comment) {
    comment.helpful += 1;
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(allComments));
    window.dispatchEvent(new CustomEvent("commentsUpdated"));
  }

  return comment;
}

/**
 * 计算城市的平均评分
 */
export function getAverageRating(cityId) {
  const comments = getCityComments(cityId);
  if (comments.length === 0) return 0;

  const sum = comments.reduce((acc, c) => acc + c.rating, 0);
  return (sum / comments.length).toFixed(1);
}

/**
 * 获取评分分布
 */
export function getRatingDistribution(cityId) {
  const comments = getCityComments(cityId);
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  comments.forEach((c) => {
    distribution[c.rating]++;
  });

  return distribution;
}

/**
 * 格式化时间戳为可读时间
 */
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
}
