import React, { useEffect, useState } from 'react';
import { getEnvios } from '../services/api';

const ShipmentList = () => {
  const [envios, setEnvios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnvios = async () => {
    try {
      const response = await getEnvios();
      setEnvios(response.data.reverse());
    } catch (err) {
      console.error('Error fetching shipments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvios();
    const interval = setInterval(fetchEnvios, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Monitor de Logística</h2>
        <div className="text-muted small">
          <i className="bi bi-arrow-clockwise me-1"></i> Sincronizando en tiempo real
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-info bg-opacity-10 border-info border-opacity-25 p-3 text-center">
            <h2 className="fw-bold text-info mb-0">{envios.length}</h2>
            <small className="text-info fw-bold">ENVÍOS GENERADOS</small>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-dark text-white">
              <tr>
                <th className="px-4 py-3">Folio Envío</th>
                <th className="px-4 py-3">Folio Orden</th>
                <th className="px-4 py-3">Destino</th>
                <th className="px-4 py-3">Estado Logístico</th>
                <th className="px-4 py-3 text-end">Fecha de Despacho</th>
              </tr>
            </thead>
            <tbody>
              {envios.map(e => (
                <tr key={e.id}>
                  <td className="px-4 fw-bold text-primary">{e.id}</td>
                  <td className="px-4"><code className="text-muted small">{e.ordenId}</code></td>
                  <td className="px-4">
                    <i className="bi bi-geo-alt me-1 text-danger"></i>
                    {e.direccion}
                  </td>
                  <td className="px-4">
                    <div className="d-flex align-items-center">
                      <div className="spinner-grow spinner-grow-sm text-info me-2" role="status"></div>
                      <span className="badge bg-info text-dark fw-bold">{e.estadoEnvio}</span>
                    </div>
                  </td>
                  <td className="px-4 text-end text-muted">{new Date(e.fechaEnvio).toLocaleString()}</td>
                </tr>
              ))}
              {!loading && envios.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <i className="bi bi-box-seam display-4 text-light d-block mb-3"></i>
                    <p className="text-muted mb-0">Esperando liquidación de órdenes para generar envíos...</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="alert alert-light border mt-4 small text-secondary shadow-sm">
        <i className="bi bi-info-circle me-2 text-primary"></i>
        <strong>Nota:</strong> Los envíos se generan automáticamente cuando el saldo de una orden es cubierto al 100% mediante el microservicio de pagos y el broker de mensajes.
      </div>
    </div>
  );
};

export default ShipmentList;
