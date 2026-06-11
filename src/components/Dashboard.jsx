import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductos, getOrdenes, getClientes, getEnvios } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, clients: 0, shipments: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [p, o, c, s] = await Promise.all([
          getProductos(),
          getOrdenes(),
          getClientes(),
          getEnvios()
        ]);
        setStats({
          products: p.data.length,
          orders: o.data.length,
          clients: c.data.length,
          shipments: s.data.length
        });
      } catch (err) {
        console.error('Error fetching stats', err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Productos', count: stats.products, icon: 'bi-box-seam', color: 'primary', link: '/productos' },
    { title: 'Clientes', count: stats.clients, icon: 'bi-people', color: 'info', link: '/clientes' },
    { title: 'Órdenes', count: stats.orders, icon: 'bi-cart-check', color: 'success', link: '/ordenes' },
    { title: 'Envíos', count: stats.shipments, icon: 'bi-truck', color: 'warning', link: '/envios' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-dark text-white p-5 border-0 shadow-lg">
            <h1 className="display-4 fw-bold">Panel de Control</h1>
            <p className="lead opacity-75">Bienvenido al sistema centralizado de gestión Surtido Express.</p>
            <div className="d-flex gap-2 mt-3">
              <Link to="/ordenes" className="btn btn-info text-dark fw-bold">Nueva Orden</Link>
              <a href="http://localhost:8025" target="_blank" rel="noreferrer" className="btn btn-outline-light">
                <i className="bi bi-envelope-at me-2"></i>Ver Correos (Mailhog)
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {cards.map((card, idx) => (
          <div className="col-md-3" key={idx}>
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex align-items-center">
                <div className={`rounded-circle bg-${card.color} bg-opacity-10 p-3 me-3`}>
                  <i className={`bi ${card.icon} fs-3 text-${card.color}`}></i>
                </div>
                <div>
                  <h6 className="text-secondary mb-0">{card.title}</h6>
                  <h3 className="fw-bold mb-0">{card.count}</h3>
                </div>
              </div>
              <div className="card-footer bg-transparent border-0 pt-0 text-end">
                <Link to={card.link} className="text-decoration-none small fw-bold text-muted">
                  Gestionar <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-5">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-4">Estado del Sistema</h5>
            <div className="d-flex flex-column gap-3">
              <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                <span><i className="bi bi-check-circle-fill text-success me-2"></i> Eureka Server</span>
                <span className="badge bg-success">ONLINE</span>
              </div>
              <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                <span><i className="bi bi-check-circle-fill text-success me-2"></i> API Gateway</span>
                <span className="badge bg-success">ONLINE</span>
              </div>
              <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                <span><i className="bi bi-cpu text-info me-2"></i> Kafka Broker</span>
                <span className="badge bg-info">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 h-100 bg-primary text-white">
            <h5 className="fw-bold mb-3">Accesos Rápidos</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/pagos" className="text-white text-decoration-none"><i className="bi bi-chevron-right me-1"></i> Procesar Pagos</Link></li>
              <li className="mb-2"><Link to="/productos" className="text-white text-decoration-none"><i className="bi bi-chevron-right me-1"></i> Ajustar Stock</Link></li>
              <li className="mb-2"><Link to="/clientes" className="text-white text-decoration-none"><i className="bi bi-chevron-right me-1"></i> Alta de Clientes</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
