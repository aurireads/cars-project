import React from 'react';
import PropTypes from 'prop-types';
import './DeleteConfirmation.css';

/**
 * DeleteConfirmation Component
 * 
 * Modal reutilizável para confirmação de exclusão
 */
const DeleteConfirmation = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  item, 
  loading = false,
  title = "Confirmar Exclusão",
  message = "Tem certeza que deseja deletar este item?",
  confirmText = "Confirmar Exclusão",
  cancelText = "Cancelar"
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onCancel();
    }
  };

  return (
    <div className="delete-modal-overlay" onClick={handleOverlayClick}>
      <div className="delete-modal">
        <div className="delete-modal-header">
          <h3>{title}</h3>
          {!loading && (
            <button 
              className="close-btn"
              onClick={onCancel}
              aria-label="Fechar"
            >
              ×
            </button>
          )}
        </div>
        
        <div className="delete-modal-body">
          <div className="warning-icon">
            ⚠️
          </div>
          
          <p>{message}</p>
          
          {item && (
            <div className="item-preview">
              <div className="item-name">{item.name}</div>
              {item.brand && item.model && (
                <div className="item-details">
                  {item.brand} {item.model} ({item.year})
                </div>
              )}
            </div>
          )}
          
          <div className="warning-text">
            <strong>⚠️ Esta ação não pode ser desfeita!</strong>
          </div>
        </div>
        
        <div className="delete-modal-actions">
          <button 
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button 
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Deletando...
              </>
            ) : (
              <>🗑️ {confirmText}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmation.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  item: PropTypes.object,
  loading: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string
};

export default DeleteConfirmation;