import React, { useEffect, useState } from 'react';
import { getClientes, crearCliente } from '../services/api';

const ClientManager = () => {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', email: '', telefono: '' });
  const [loading, setLoading] = useState(false);

  const fetchClientes = async () => {
    try {
      const response = await getClientes();
      setClientes(response.data);
    } catch (err) {
      console.error('Error fetching clients', err);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await crearCliente(nuevoCliente);
      setNuevoCliente({ nombre: '', email: '', telefono: '' });
      fetchClientes();
    } catch (err) {
      alert('Error al registrar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Directorio de Clientes</h2>
        <span className="badge bg-info text-dark">{clientes.length} Clientes Activos</span>
      </div>

      <div className="card border-0 shadow-sm mb-5">
        <div className="card-body p-4">
          <h5 className="card-title mb-4 fw-bold text-secondary">
            <i className="bi bi-person-plus me-2"></i>Registrar Nuevo Cliente
          </h5>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-bold">Nombre Completo</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Juan Pérez"
                value={nuevoCliente.nombre}
                onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">Correo Electrónico</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="juan@ejemplo.com"
                value={nuevoCliente.email}
                onChange={(e) => setNuevoCliente({...nuevoCliente, email: e.target.value})}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold">Teléfono</label>
              <input 
                type="tel" 
                className="form-control" 
                placeholder="5512345678"
                value={nuevoCliente.telefono}
                onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
                required
              />
            </div>
            <div className="col-md-1 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                <i className="bi bi-check-lg"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3 text-end">Estado</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c.id}>
                  <td className="px-4">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-light p-2 me-3 text-primary">
                        <i className="bi bi-person fs-5"></i>
                      </div>
                      <span className="fw-bold">{c.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 text-muted">{c.email}</td>
                  <td className="px-4">{c.telefono}</td>
                  <td className="px-4 text-end">
                    <span className="badge bg-success bg-opacity-10 text-success">Activo</span>
                  </td>
                </tr>
              ))}
              {clientes.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">No hay clientes registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientManager;
