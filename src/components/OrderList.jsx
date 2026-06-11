import React, { useEffect, useState } from 'react';
import { getOrdenes } from '../services/api';

const OrderList = () => {
  const [ordenes, setOrdenes] = useState([]);

  const fetchOrdenes = async () => {
    try {
      const response = await getOrdenes();
      setOrdenes(response.data);
    } catch (err) {
      console.error('Error fetching orders', err);
    }
  };

  useEffect(() => {
    fetchOrdenes();
    const interval = setInterval(fetchOrdenes, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Historial de Órdenes</h2>
        <button className="btn btn-secondary btn-sm" onClick={fetchOrdenes}>Refrescar</button>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID Orden</th>
              <th>Cliente (ID)</th>
              <th>Producto (ID)</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map(o => (
              <tr key={o.id}>
                <td><small className="text-muted">{o.id}</small></td>
                <td>{o.clienteId}</td>
                <td>{o.productoId}</td>
                <td>{o.cantidad}</td>
                <td><span className="fw-bold">${o.montoTotal.toFixed(2)}</span></td>
                <td>
                  <span className={`badge rounded-pill bg-${o.estado === 'PAGADA' ? 'success' : 'warning text-dark'}`}>
                    {o.estado}
                  </span>
                </td>
              </tr>
            ))}
            {ordenes.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">No se encontraron órdenes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
