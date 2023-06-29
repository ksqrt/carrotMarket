import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { updateMannerTemperature } from '../../services/userData';
import './MannerModal.css'; // CSS 파일의 경로에 맞게 import


const MannerModal = ({ onClose, id }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(null);
  const MIN_SUBMISSION_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setError('');
  };

  const handleSubmit = async () => {
    if (selectedOption === '') {
      setError('하나를 선택하셔야 합니다.');
    } else {
      // Show loading state
      setLoading(true);
  
      // Check if the last praising was within the allowed time frame
      const lastPraisingTime = localStorage.getItem('lastPraisingTime');
      if (lastPraisingTime) {
        const lastPraisingDate = new Date(Number(lastPraisingTime));
        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - lastPraisingDate.getTime();
        const hoursDiff = timeDiff / (1000 * 3600); // Convert milliseconds to hours
  
        if (hoursDiff < 24) {
          setError('하루에 한 번만 칭찬할 수 있습니다.');
          setLoading(false);
          return;
        }
      }
  
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
  
      // Pass the selected option and manner score change to the parent component or send them as userdata
      const MannerTemperature = {
        mannerScoreChange: Number(mannerScoreChange), // Convert to numeric value
      };
  
      try {
        await updateMannerTemperature(id, MannerTemperature);
        // Update the userdata in the parent component
        onClose(MannerTemperature);
  
        // Save the current time as the last praising time
        localStorage.setItem('lastPraisingTime', Date.now().toString());
  
        // Add CSS class to indicate successful submission
        setSuccess(true);
      } catch (error) {
        console.error('Error updating MannerTemperature:', error);
        setError('칭찬 업데이트 실패.');
      }
      
      window.location.reload();
      // Hide the loading state
      setLoading(false);
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
