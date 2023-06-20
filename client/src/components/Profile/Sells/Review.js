import React, { useState } from 'react';
import axios from 'axios'; // axios를 사용하여 서버로 데이터를 전송합니다.
import {createReview} from '../../../services/ReviewData';

const ReviewForm = () => {
  const [content, setContent] = useState('');

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 작성한 후기 데이터
    const reviewData = {
      content,
    };



    // try {
    //   // 서버로 후기 데이터 전송
    //   await axios.post('/api/reviews', reviewData); // 실제 서버 API 엔드포인트로 수정해야 합니다.
    //   console.log('Review submitted:', reviewData);

    //   // 후기 작성 후 처리할 로직 추가 가능

    //   // 폼 초기화
    //   setContent('');
    // } catch (error) {
    //   console.error('Error submitting review:', error);
    // }

    console.log(reviewData);

    createReview(reviewData);

  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Write a Review</h2>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
        ></textarea>
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
