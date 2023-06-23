import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { updateMannerTemperature } from '../../services/userData';
import './MannerModal.css'; // CSS 파일의 경로에 맞게 import


const MannerModal = ({ onClose, id }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setError('');
  };

  const handleSubmit = async () => {
    if (selectedOption === '') {
      setError('하나를 선택하셔야 합니다.');
    } else {
      // Handle the submission of the selected option
      console.log('Selected Option:', selectedOption);
  
      // Calculate the manner score change based on the selected option
      let mannerScoreChange = 0;
      if (selectedOption === '아쉬워요') {
        mannerScoreChange = -0.5;
      } else if (selectedOption === '좋아요') {
        mannerScoreChange = 0.5;
      } else if (selectedOption === '매우 좋아요') {
        mannerScoreChange = 1.5;
      }
  
      // Show loading state
      setLoading(true);
  
      // Pass the selected option and manner score change to the parent component or send them as userdata
      const MannerTemperature = {
        mannerScoreChange: Number(mannerScoreChange), // Convert to numeric value
      };
  
      try {
        await updateMannerTemperature(id, MannerTemperature);
        // Update the userdata in the parent component
        onClose(MannerTemperature);
        // Add CSS class to indicate successful submission
      } catch (error) {
        console.error('Error updating MannerTemperature:', error);
      }
  
      // Delay the reload for 2 seconds
      setTimeout(() => {
        // Reload the page
        window.location.reload();
      }, 2000);
        // Hide the loading state
        setLoading(false);
        setSuccess(true);
    }
  };
  
  

  return (

    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>매너 칭찬하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2>매너 칭찬하기</h2>
        <p>아쉬워요, 좋아요, 매우 좋아요 중에서 선택해주세요!</p>
        <div className="emoji-buttons">
          <Button
            variant={`outline-secondary ${selectedOption === '아쉬워요' ? 'selected' : ''}`}
            onClick={() => handleOptionClick('아쉬워요')}
          >
            아쉬워요
          </Button>
          <Button
            variant={`outline-secondary ${selectedOption === '좋아요' ? 'selected' : ''}`}
            onClick={() => handleOptionClick('좋아요')}
          >
            좋아요
          </Button>
          <Button
            variant={`outline-secondary ${selectedOption === '매우 좋아요' ? 'selected' : ''}`}
            onClick={() => handleOptionClick('매우 좋아요')}
          >
            매우 좋아요
          </Button>
        </div>
        {error && <p className="error">{error}</p>}
        <Button onClick={handleSubmit}>제출</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
      <div>
        {/* 컴포넌트 내의 나머지 JSX 코드 */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading...</div>
          </div>
        )}
      </div>
    </Modal>

  );
};

export default MannerModal;
