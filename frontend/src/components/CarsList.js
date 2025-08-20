import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './CarsList.css';

/**
 * CarsList Component com funcionalidade de delete
 */
const CarsList = ({ cars = [], className = '', onCarClick, onCarDeleted }) => {
  const [deletingCarId, setDeletingCarId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  // Agrupa os carros por marca usando useMemo para otimização
  const carsByBrand = useMemo(() => {
    return cars.reduce((acc, car) => {
      const brand = car.brand;
      if (!acc[brand]) {
        acc[brand] = [];
      }
      acc[brand].push(car);
      return acc;
    }, {});
  }, [cars]);

  // Ordena as marcas alfabeticamente
  const sortedBrands = useMemo(() => {
    return Object.keys(carsByBrand).sort();
  }, [carsByBrand]);

  // Função para formatar preço
  const formatPrice = (priceInCents) => {
    if (!priceInCents) return 'Preço não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(priceInCents / 100);
  };

  // Função para lidar com clique no carro
  const handleCarClick = (car, event) => {
    // Não abrir detalhes se clicou no botão de delete
    if (event.target.closest('.delete-btn')) {
      return;
    }
    
    if (onCarClick && typeof onCarClick === 'function') {
      onCarClick(car);
    }
  };

  // Função para abrir modal de confirmação
  const handleDeleteClick = (car, event) => {
    event.stopPropagation();
    setCarToDelete(car);
    setShowDeleteModal(true);
  };

  // Função para confirmar delete
  const handleConfirmDelete = async () => {
    if (!carToDelete) return;

    try {
      setDeletingCarId(carToDelete.id);
      
      await axios.delete(`/api/cars/${carToDelete.id}`);
      
      // Chamar callback para atualizar lista
      if (onCarDeleted) {
        onCarDeleted(carToDelete.id);
      }
      
      setShowDeleteModal(false);
      setCarToDelete(null);
      
    } catch (error) {
      console.error('Erro ao deletar carro:', error);
      alert('Erro ao deletar carro. Tente novamente.');
    } finally {
      setDeletingCarId(null);
    }
  };

  // Função para cancelar delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCarToDelete(null);
  };

  if (!cars || cars.length === 0) {
    return (
      <div className={`cars-list empty ${className}`}>
        <div className="empty-state">
          <h3>Nenhum carro encontrado</h3>
          <p>Adicione alguns carros para vê-los listados aqui.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`cars-list ${className}`}>
      <div className="cars-header">
        <h2>Listagem de Veículos</h2>
        <div className="cars-summary">
          <span className="cars-count">
            {cars.length} {cars.length === 1 ? 'veículo' : 'veículos'}
          </span>
          <span className="brands-count">
            {sortedBrands.length} {sortedBrands.length === 1 ? 'marca' : 'marcas'}
          </span>
        </div>
      </div>

      <div className="brands-container">
        {sortedBrands.map(brand => (
          <div key={brand} className="brand-group">
            <h3 className="brand-title">
              {brand}
              <span className="brand-count">
                ({carsByBrand[brand].length})
              </span>
            </h3>
            
            <div className="cars-grid">
              {carsByBrand[brand].map(car => (
                <div 
                  key={car.id} 
                  className={`car-card ${onCarClick ? 'clickable' : ''}`}
                  onClick={(e) => handleCarClick(car, e)}
                >
                  <div className="car-header">
                    <h4 className="car-name">{car.name}</h4>
                    <div className="car-actions">
                      <span className="car-year">{car.year}</span>
                      <button
                        className="delete-btn"
                        onClick={(e) => handleDeleteClick(car, e)}
                        disabled={deletingCarId === car.id}
                        title="Deletar carro"
                      >
                        {deletingCarId === car.id ? (
                          <span className="spinner-small"></span>
                        ) : (
                          '🗑️'
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="car-details">
                    <div className="car-info">
                      <span className="car-model">
                        {car.model}
                      </span>
                      {car.color && (
                        <span className="car-color">
                          {car.color}
                        </span>
                      )}
                    </div>
                    
                    <div className="car-price">
                      {formatPrice(car.price)}
                    </div>
                  </div>
                  
                  {car.description && (
                    <div className="car-description">
                      <p>{car.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmação de delete */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar Exclusão</h3>
            </div>
            
            <div className="modal-body">
              <p>Tem certeza que deseja deletar o veículo:</p>
              <div className="car-preview">
                <strong>{carToDelete?.name}</strong>
                <span>{carToDelete?.brand} {carToDelete?.model} ({carToDelete?.year})</span>
              </div>
              <p className="warning-text">Esta ação não pode ser desfeita.</p>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={handleCancelDelete}
                disabled={deletingCarId}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                disabled={deletingCarId}
              >
                {deletingCarId ? (
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
      )}
    </div>
  );
};

CarsList.propTypes = {
  cars: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    color: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string
  })),
  className: PropTypes.string,
  onCarClick: PropTypes.func,
  onCarDeleted: PropTypes.func
};

export default CarsList;