import React, { useState, useEffect, useContext } from 'react';
import { createReview, getReviews, getUserName } from '../../../services/ReviewData';
import { useParams } from 'react-router-dom';
import './ReviewForm.css';
import { Context } from "../../../ContextStore";

const ReviewForm = () => {
  const { userData } = useContext(Context);
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  const handleContentChange = (event) => {
    setContent(event.target.value);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (content.length < 10 || content.length > 500) {
      setError('10글자 이상 500글자 이하');
      return;
    }

    const userName = await getUserName(userData._id);
    const reviewData = {
      id: userData._id,
      content,
      seller: id,
      name: userName,
    };

    console.log(reviewData, '처음 js에서 보내기');

    try {
      await createReview(reviewData);
      window.location.reload();
    } catch (error) {
      console.error('Error creating review:', error);
    }
  };

  useEffect(() => {
    console.log(id, '이것은 판매자 아이디값입니다');
    console.log(userData._id, '이것은 로그인 아이디값입니다');
    console.log(userData);
    const fetchReviews = async () => {
      const fetchedReviews = await getReviews(id);
      setReviews(fetchedReviews);
      console.log(fetchedReviews,'이거확인용@@#!#@$#$!');
    };

    fetchReviews();
  }, [id, userData._id]);

  return (
    <div className="review-page">
      <div className="review-board">
        <h2 className="review-board__title">리뷰 리스트</h2>
        <div className="review-board__list">
          {reviews
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((review) => (
              <div key={review.id} className="review-board__item">
                <p className="review-board__content">{review.content}</p>
                <p className="review-board__timestamp">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
                <div className="review-board__user">
                  <span className="review-board__username">{review.name}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="review-form">
        <h2 className="review-form__title">판매자 리뷰 작성</h2>
        <div className="review-form__content">
          <label htmlFor="content" className="review-form__label">
            <h3>거래 후기</h3>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            className="review-form__textarea"
          ></textarea>
          {error && <p className="review-form__error" style={{ color: 'red' }}>{error}</p>}
        </div>
        <button type="submit" className="review-form__submit-btn">
          리뷰 작성
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
