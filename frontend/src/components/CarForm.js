import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import './CarsList.css';

/**
 * CarsList Component
 * 
 * Componente para exibir uma listagem de veículos agrupada por marcas.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.cars - Array de objetos representando os carros
 * @param {string} props.className - Classe CSS adicional (opcional)
 * @param {Function} props.onCarClick - Função callback ao clicar em um carro (opcional)
 * 
 * Estrutura esperada para cada carro:
 * {
 *   id: number,
 *   name: string,
 *   brand: string,
 *   model: string,
 *   year: number,
 *   color: string,
 *   price: number (em centavos),
 *   description: string
 * }
 * 
 * Exemplo de uso:
 * 
 * ```jsx
 * import CarsList from './components/CarsList';
 * 
 * const cars = [
 *   {
 *     id: 1,
 *     name: "Corolla XEI",
 *     brand: "Toyota",
 *     model: "Corolla",
 *     year: 2023,
 *     color: "Branco",
 *     price: 9500000,
 *     description: "Sedan confortável"
 *   }
 * ];
 * 
 * function App() {
 *   const handleCarClick = (car) => {
 *     console.log('Carro selecionado:', car);
 *   };
 * 
 *   return (
 *     <CarsList 
 *       cars={cars}
 *       onCarClick={handleCarClick}
 *       className="custom-cars-list"
 *     />
 *   );
 * }
 * ```
 */
const CarsList = ({ cars = [], className = '', onCarClick }) => {
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
  const handleCarClick = (car) => {
    if (onCarClick && typeof onCarClick === 'function') {
      onCarClick(car);
    }
  };

  if (!cars || cars.length === 0) {
    return (
      <div className={`cars-list empty ${className}`}>
        <div className="empty-state">
          <h3>🚗 Nenhum carro encontrado</h3>
          <p>Adicione alguns carros para vê-los listados aqui.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`cars-list ${className}`}>
      <div className="cars-header">
        <h2>📋 Listagem de Veículos</h2>
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
              🏷️ {brand}
              <span className="brand-count">
                ({carsByBrand[brand].length})
              </span>
            </h3>
            
            <div className="cars-grid">
              {carsByBrand[brand].map(car => (
                <div 
                  key={car.id} 
                  className={`car-card ${onCarClick ? 'clickable' : ''}`}
                  onClick={() => handleCarClick(car)}
                >
                  <div className="car-header">
                    <h4 className="car-name">{car.name}</h4>
                    <span className="car-year">{car.year}</span>
                  </div>
                  
                  <div className="car-details">
                    <div className="car-info">
                      <span className="car-model">
                        🚙 {car.model}
                      </span>
                      {car.color && (
                        <span className="car-color">
                          🎨 {car.color}
                        </span>
                      )}
                    </div>
                    
                    <div className="car-price">
                      💰 {formatPrice(car.price)}
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
  onCarClick: PropTypes.func
};

export default CarsList;