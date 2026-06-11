import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Inicio', icon: 'bi-house-door' },
    { path: '/clientes', label: 'Clientes', icon: 'bi-people' },
    { path: '/productos', label: 'Productos', icon: 'bi-box-seam' },
    { path: '/ordenes', label: 'Órdenes', icon: 'bi-cart' },
    { path: '/pagos', label: 'Pagos', icon: 'bi-credit-card' },
    { path: '/envios', label: 'Envíos', icon: 'bi-truck' },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="bi bi-rocket-takeoff me-2 text-info"></i>
          <span>Surtido Express</span>
        </Link>
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.path}>
                <Link 
                  className={`nav-link px-3 d-flex align-items-center ${location.pathname === link.path ? 'active text-info fw-bold' : ''}`} 
                  to={link.path}
                >
                  <i className={`bi ${link.icon} me-2`}></i>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
