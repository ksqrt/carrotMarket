import React, { useState, useEffect } from 'react';
import { createReview, getReviews } from '../../../services/ReviewData';
import { useParams } from 'react-router-dom';
import './ReviewForm.css'; // Import the CSS file for styling




const ReviewForm = () => {
    const { id } = useParams();
    const [content, setContent] = useState('');
    const [reviews, setReviews] = useState([]);

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const reviewData = {
            id,
            content,
        };

        console.log(reviewData, '처음 js에서 보내기');

        createReview(reviewData);
    };

    useEffect(() => {
        const fetchReviews = async () => {
            const fetchedReviews = await getReviews(id);
            setReviews(fetchedReviews);
        };

        fetchReviews();
    }, [id]);

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
                                    <span className="review-board__username">{review.username}</span>
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
                </div>
                <button type="submit" className="review-form__submit-btn">
                    리뷰 작성
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
