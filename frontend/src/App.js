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

  // Configurar axios para usar /api como prefixo
  useEffect(() => {
    axios.defaults.baseURL = '/api';
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carregar carros, marcas e modelos em paralelo
      const [carsResponse, brandsResponse, modelsResponse] = await Promise.all([
        axios.get('/cars.json'),
        axios.get('/brands'),
        axios.get('/models')
      ]);

      setCars(carsResponse.data);
      setBrands(brandsResponse.data);
      setModels(modelsResponse.data);
      
      console.log('Dados carregados:', {
        cars: carsResponse.data.length,
        brands: brandsResponse.data.length,
        models: modelsResponse.data.length
      });
      
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(
        err.response?.status === 404 
          ? 'API não encontrada. Verifique se o backend está rodando na porta 8000.'
          : 'Erro ao carregar dados. Verifique se a API está funcionando.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Função para recarregar carros após adicionar novo
  const handleCarAdded = () => {
    loadInitialData();
    setActiveTab('list');
  };

  // Função para lidar com clique em um carro
  const handleCarClick = (car) => {
    console.log('Carro selecionado:', car);
    // Aqui você pode implementar navegação para detalhes do carro
  };

  // Função para lidar com delete de carro
  const handleCarDeleted = (carId) => {
    // Remove o carro da lista local imediatamente para melhor UX
    setCars(prevCars => prevCars.filter(car => car.id !== carId));
    
    // Opcionalmente, recarregar dados para garantir sincronização
    // loadInitialData();
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
          <h2>Erro de Conexão</h2>
          <p>{error}</p>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
            <p>Certifique-se de que:</p>
            <ul style={{ textAlign: 'left', marginTop: '0.5rem' }}>
              <li>• O backend FastAPI está rodando na porta 8000</li>
              <li>• Execute: <code>python main.py</code> na pasta do backend</li>
              <li>• O frontend está rodando na porta 3000</li>
            </ul>
          </div>
          <button onClick={loadInitialData} className="retry-btn">
            🔄 Tentar Novamente
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
          📋 Listagem de Carros ({cars.length})
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
          <CarsList 
            cars={cars} 
            onCarClick={handleCarClick}
            onCarDeleted={handleCarDeleted}
          />
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
        <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.5rem' }}>
          Backend: FastAPI | Frontend: React | Total de veículos: {cars.length}
        </p>
      </footer>
    </div>
  );
}

export default App;