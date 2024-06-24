import React, { useState } from 'react';

const Modal = ({ isOpen, closeModal, request }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Details</h2>
        <p><strong>Name:</strong> {request.name}</p>
        <p><strong>Email:</strong> {request.email}</p>
        <p><strong>Phone:</strong> {request.phoneNumber}</p>
        <p><strong>Message:</strong> {request.message}</p>
      </div>
    </div>
  );
};

export default Modal;
