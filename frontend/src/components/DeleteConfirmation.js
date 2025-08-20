import React from 'react';
import PropTypes from 'prop-types';
import './DeleteConfirmation.css'; // Importa os estilos do modal

const DeleteConfirmation = ({ car, onConfirm, onCancel, isDeleting }) => {
  if (!car) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Confirmar Exclusão</h3>
        </div>
        <div className="modal-body">
          <p>Tem certeza que deseja deletar o veículo:</p>
          <div className="car-preview">
            <strong>{car.name}</strong>
            <span>{car.brand} {car.model} ({car.year})</span>
          </div>
          <p className="warning-text">Esta ação não pode ser desfeita.</p>
        </div>
        <div className="modal-actions">
          <button 
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button 
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner-small"></span>
                Deletando...
              </>
            ) : (
              'Confirmar Exclusão'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmation.propTypes = {
  car: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    brand: PropTypes.string,
    model: PropTypes.string,
    year: PropTypes.number
  }),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool
};

export default DeleteConfirmation;