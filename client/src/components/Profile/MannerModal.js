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
     

      // Check if the last praising was within the allowed time frame
      const lastPraisingTime = localStorage.getItem('lastPraisingTime');
      if (lastPraisingTime) {
        const lastPraisingDate = new Date(Number(lastPraisingTime));
        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - lastPraisingDate.getTime();
        const hoursDiff = timeDiff / (1000 * 3600); // Convert milliseconds to hours

        // if (hoursDiff < 24) {
        //   setError('하루에 한 번만 칭찬할 수 있습니다.');
        //   return;
        // }
      }
      setLoading(true);
      // Handle the submission of the selected option
      console.log('Selected Option:', selectedOption);

      // Calculate the manner score change based on the selected option
      let mannerScoreChange = 0;
      if (selectedOption === '아쉬워요') {
        mannerScoreChange = -1.0;
      } else if (selectedOption === '좋아요') {
        mannerScoreChange = 1.0;
      } else if (selectedOption === '매우 좋아요') {
        mannerScoreChange = 2.0;
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
        <div className="emoji-buttons">
          <Button
            variant={`outline-secondary ${selectedOption === '아쉬워요' ? 'selected' : ''}`}
            onClick={() => handleOptionClick('아쉬워요')}
          >
            아쉬워요 &#128532;
          </Button>
          <Button
            variant={`outline-secondary ${selectedOption === '좋아요' ? 'selected' : ''}`}
            onClick={() => handleOptionClick('좋아요')}
          >
            좋아요 &#128522;
          </Button>
          <Button
            variant={`outline-secondary ${selectedOption === '매우 좋아요' ? 'selected' : ''}`}
            onClick={() => handleOptionClick('매우 좋아요')}
          >
            매우 좋아요 &#128525;
          </Button>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="submit-container">
          <Button className="submit-button" onClick={handleSubmit}>
            등록
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="secondary" onClick={onClose}>
          닫기
        </Button> */}
      </Modal.Footer>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading...</div>
        </div>
      )}
    </Modal>
  );
};

export default MannerModal;
