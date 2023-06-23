import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const MannerModal = ({ onClose }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState('');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setError('');
  };

  const handleSubmit = () => {
    if (selectedOption === '') {
      setError('하나의 옵션을 선택해야 합니다.');
    } else {
      // Handle the submission of the selected option
      // You can send an API request or perform any other action here
      console.log('Selected Option:', selectedOption);

      // Close the modal window
      onClose();
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
    </Modal>
  );
};

export default MannerModal;
