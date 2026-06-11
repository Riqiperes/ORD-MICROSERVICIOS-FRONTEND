import React, { useEffect, useState } from 'react';
import { getOrdenes, getProductos, getClientes, crearOrden } from '../services/api';

const OrderManager = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [nuevaOrden, setNuevaOrden] = useState({ clienteId: '', productoId: '', cantidad: 1 });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [ordRes, prodRes, cliRes] = await Promise.all([
        getOrdenes(),
        getProductos(),
        getClientes()
      ]);
      setOrdenes(ordRes.data.reverse());
      setProductos(prodRes.data);
      setClientes(cliRes.data);
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nuevaOrden.cantidad <= 0) {
      setMensaje({ texto: 'La cantidad debe ser mayor a cero.', tipo: 'danger' });
      return;
    }

    setLoading(true);
    try {
      await crearOrden(nuevaOrden);
      setMensaje({ texto: '¡Orden creada! Procesando inventario...', tipo: 'success' });
      setNuevaOrden({ clienteId: '', productoId: '', cantidad: 1 });
      fetchData();
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error: Verifique stock o ID de cliente.';
      setMensaje({ texto: errorMsg, tipo: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (estado) => {
    const styles = {
      'PENDIENTE': 'bg-warning text-dark',
      'PAGADA': 'bg-success',
      'ENVIADA': 'bg-info text-dark',
      'CANCELADA': 'bg-danger'
    };
    return <span className={`badge rounded-pill ${styles[estado] || 'bg-secondary'}`}>{estado}</span>;
  };

  return (
    <div className="animate-fade-in">
      <h2 className="fw-bold mb-4">Gestión de Órdenes</h2>

      <div className="card border-0 shadow-sm mb-5">
        <div className="card-header bg-white py-3 border-0">
          <h5 className="mb-0 fw-bold"><i className="bi bi-cart-plus me-2 text-success"></i>Nueva Orden</h5>
        </div>
        <div className="card-body p-4">
          {mensaje.texto && (
            <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`} role="alert">
              {mensaje.texto}
              <button type="button" className="btn-close" onClick={() => setMensaje({texto:'', tipo:''})}></button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-bold">Seleccionar Cliente</label>
              <select 
                className="form-select" 
                value={nuevaOrden.clienteId}
                onChange={(e) => setNuevaOrden({...nuevaOrden, clienteId: e.target.value})}
                required
              >
                <option value="">-- Buscar Cliente --</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">Producto</label>
              <select 
                className="form-select" 
                value={nuevaOrden.productoId}
                onChange={(e) => setNuevaOrden({...nuevaOrden, productoId: e.target.value})}
                required
              >
                <option value="">-- Buscar Producto --</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                    {p.nombre} ({p.stock} disp.) - ${p.precio}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-bold">Cantidad</label>
              <input 
                type="number" 
                className="form-control" 
                value={nuevaOrden.cantidad}
                onChange={(e) => setNuevaOrden({...nuevaOrden, cantidad: parseInt(e.target.value)})}
                min="1"
                required
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-success w-100 fw-bold" disabled={loading}>
                {loading ? 'Creando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="card-header bg-dark text-white py-3 border-0 d-flex justify-content-between">
          <h5 className="mb-0 fw-bold">Historial de Ventas</h5>
          <small className="opacity-75">Actualizado hace un momento</small>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">ID Orden</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Cant.</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map(o => (
                <tr key={o.id}>
                  <td className="px-4">
                    <div className="d-flex align-items-center gap-2">
                      <code className="text-muted small">{o.id?.substring(0,8)}</code>
                      <button 
                        className="btn btn-sm btn-link p-0 text-decoration-none" 
                        onClick={() => {
                          navigator.clipboard.writeText(o.id);
                          setMensaje({ texto: 'ID copiado al portapapeles', tipo: 'info' });
                          setTimeout(() => setMensaje({ texto: '', tipo: '' }), 2000);
                        }}
                        title="Copiar ID completo"
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 fw-bold">{clientes.find(c => c.id === o.clienteId)?.nombre || 'Desconocido'}</td>
                  <td className="px-4">{productos.find(p => p.id === o.productoId)?.nombre || 'Producto eliminado'}</td>
                  <td className="px-4">{o.cantidad}</td>
                  <td className="px-4 fw-bold text-primary">${o.montoTotal?.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="px-4">{getStatusBadge(o.estado)}</td>
                </tr>
              ))}
              {ordenes.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">Aún no se han generado órdenes hoy.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManager;
