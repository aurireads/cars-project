import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './CarForm.css';

const CarForm = ({ brands, models, onCarAdded }) => {
  const [carData, setCarData] = useState({
    name: '',
    model_id: '',
    year: '',
    color: '',
    price: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarData({
      ...carData,
      [name]: value,
    });
  };

  const handlePriceChange = (e) => {
    const priceInCents = Math.round(parseFloat(e.target.value.replace(',', '.')) * 100);
    setCarData({
      ...carData,
      price: isNaN(priceInCents) ? '' : priceInCents,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    const price = carData.price ? parseFloat(carData.price) : null;
    const year = carData.year ? parseInt(carData.year) : null;

    if (price && isNaN(price) || year && isNaN(year)) {
      setSubmitStatus({ type: 'error', message: 'Dados de ano ou preço inválidos.' });
      setLoading(false);
      return;
    }

    try {
      await axios.post('/cars', carData);
      setSubmitStatus({ type: 'success', message: 'Carro adicionado com sucesso!' });
      setCarData({
        name: '',
        model_id: '',
        year: '',
        color: '',
        price: '',
        description: '',
      });
      onCarAdded();
    } catch (err) {
      console.error('Erro ao adicionar carro:', err);
      setSubmitStatus({ type: 'error', message: 'Erro ao adicionar carro. Verifique os dados.' });
    } finally {
      setLoading(false);
    }
  };

  const getModelsByBrand = (brandId) => {
    return models.filter((model) => model.brand.id === parseInt(brandId));
  };
  
  const getBrandByModel = (modelId) => {
    const model = models.find(m => m.id === parseInt(modelId));
    return model ? model.brand : null;
  };

  const getFilteredModels = () => {
    const brandId = getBrandByModel(carData.model_id)?.id;
    return brandId ? getModelsByBrand(brandId) : [];
  };

  return (
    <form className="car-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>➕ Adicionar Novo Carro</h2>
        <p>Preencha os campos abaixo para cadastrar um novo veículo.</p>
      </div>
      <div className="form-container">
        {submitStatus && (
          <div className={`alert alert-${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="brand-select">Marca</label>
            <select
              id="brand-select"
              value={getBrandByModel(carData.model_id)?.id || ''}
              onChange={(e) => {
                const brandId = e.target.value;
                const newModels = getModelsByBrand(brandId);
                setCarData({
                  ...carData,
                  model_id: newModels.length > 0 ? newModels[0].id : '',
                });
              }}
              required
            >
              <option value="" disabled>Selecione uma marca</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="model-select">Modelo</label>
            <select
              id="model-select"
              name="model_id"
              value={carData.model_id}
              onChange={handleInputChange}
              required
              disabled={!getBrandByModel(carData.model_id)?.id}
            >
              <option value="" disabled>Selecione um modelo</option>
              {getFilteredModels().map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={carData.name}
              onChange={handleInputChange}
              placeholder="Ex: Corolla XEI"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="year">Ano</label>
            <input
              type="number"
              id="year"
              name="year"
              value={carData.year}
              onChange={handleInputChange}
              placeholder="Ex: 2023"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="color">Cor</label>
            <input
              type="text"
              id="color"
              name="color"
              value={carData.color}
              onChange={handleInputChange}
              placeholder="Ex: Branco"
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Preço (R$)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={carData.price}
              onChange={handleInputChange}
              placeholder="Ex: 95000.00"
              step="any"
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={carData.description}
              onChange={handleInputChange}
              placeholder="Descreva o carro..."
            ></textarea>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span> Adicionando...
              </>
            ) : (
              'Adicionar Carro'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

CarForm.propTypes = {
  brands: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  models: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      brand: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    })
  ).isRequired,
  onCarAdded: PropTypes.func.isRequired,
};

export default CarForm;