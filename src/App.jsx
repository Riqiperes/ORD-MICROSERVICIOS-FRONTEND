import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import ClientManager from './components/ClientManager';
import OrderManager from './components/OrderManager';
import PaymentManager from './components/PaymentManager';
import ShipmentList from './components/ShipmentList';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mb-5">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<ClientManager />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/ordenes" element={<OrderManager />} />
          <Route path="/pagos" element={<PaymentManager />} />
          <Route path="/envios" element={<ShipmentList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
