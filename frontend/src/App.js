import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarsList from './components/CarsList';
import CarForm from './components/CarForm';
import './App.css';

function App() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('list');

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Carregar carros, marcas e modelos em paralelo
      const [carsResponse, brandsResponse, modelsResponse] = await Promise.all([
        axios.get('/cars.json'),
        axios.get('/brands'),
        axios.get('/models')
      ]);

      setCars(carsResponse.data);
      setBrands(brandsResponse.data);
      setModels(modelsResponse.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Verifique se a API está funcionando.');
    } finally {
      setLoading(false);
    }
  };

  // Função para recarregar carros após adicionar novo
  const handleCarAdded = () => {
    loadInitialData();
    setActiveTab('list');
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Erro</h2>
          <p>{error}</p>
          <button onClick={loadInitialData} className="retry-btn">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚗 WS Work Cars</h1>
        <p>Sistema de Gerenciamento de Veículos</p>
      </header>

      <nav className="app-nav">
        <button 
          className={`nav-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          📋 Listagem de Carros
        </button>
        <button 
          className={`nav-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          ➕ Adicionar Carro
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'list' && (
          <CarsList cars={cars} />
        )}
        
        {activeTab === 'form' && (
          <CarForm 
            brands={brands}
            models={models}
            onCarAdded={handleCarAdded}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2025 WS Work Cars - Teste Frontend React</p>
      </footer>
    </div>
  );
}

export default App;