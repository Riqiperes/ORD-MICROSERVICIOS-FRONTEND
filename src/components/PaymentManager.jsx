import React, { useEffect, useState } from 'react';
import { getOrdenes, crearPago, getPagos } from '../services/api';

const PaymentManager = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pago, setPago] = useState({ ordenId: '', monto: 0 });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [ordRes, pagRes] = await Promise.all([getOrdenes(), getPagos()]);
      // Órdenes pendientes de pago total
      setOrdenes(ordRes.data.filter(o => o.estado !== 'PAGADA'));
      setPagos(pagRes.data.reverse());
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePago = async (e) => {
    e.preventDefault();
    if (pago.monto <= 0) {
        setMensaje({ texto: 'El monto debe ser mayor a cero.', tipo: 'danger' });
        return;
    }
    setLoading(true);
    try {
      await crearPago(pago);
      setMensaje({ texto: '¡Pago aplicado correctamente!', tipo: 'success' });
      setPago({ ordenId: '', monto: 0 });
      setSearchTerm('');
      fetchData();
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
    } catch (err) {
      setMensaje({ texto: 'Fallo al procesar el pago. Intente de nuevo.', tipo: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = ordenes.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectOrder = (o) => {
    setPago({ ...pago, ordenId: o.id, monto: o.montoTotal });
    setSearchTerm(o.id);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="fw-bold mb-4">Módulo de Pagos</h2>

      <div className="card border-0 shadow-sm mb-5" style={{ zIndex: 10 }}>
        <div className="card-header bg-white py-3 border-0">
          <h5 className="mb-0 fw-bold"><i className="bi bi-wallet2 me-2 text-primary"></i>Registrar Transacción</h5>
        </div>
        <div className="card-body p-4" style={{ overflow: 'visible' }}>
          {mensaje.texto && <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`}>{mensaje.texto}</div>}
          <form onSubmit={handlePago} className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold">ID de Orden o Buscar</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Pegue el ID o seleccione..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPago({...pago, ordenId: e.target.value});
                  }}
                  required
                />
                <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"></button>
                <ul className="dropdown-menu dropdown-menu-end w-100 shadow border-0" style={{maxHeight: '250px', overflowY: 'auto'}}>
                  <li className="dropdown-header">Órdenes con saldo pendiente</li>
                  {filteredOrders.map(o => (
                    <li key={o.id}>
                      <button className="dropdown-item py-2" type="button" onClick={() => selectOrder(o)}>
                        <div className="d-flex justify-content-between">
                          <span className="fw-bold">ID: {o.id.substring(0,8)}...</span>
                          <span className="text-success">${o.montoTotal}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                  {filteredOrders.length === 0 && <li><span className="dropdown-item-text text-muted">Sin órdenes pendientes</span></li>}
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">Monto a Pagar (MXN)</label>
              <div className="input-group">
                <span className="input-group-text bg-light">$</span>
                <input 
                  type="number" 
                  step="0.01" 
                  className="form-control" 
                  placeholder="0.00"
                  value={pago.monto || ''}
                  onChange={(e) => setPago({...pago, monto: parseFloat(e.target.value)})}
                  required 
                />
              </div>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading}>
                {loading ? '...' : 'Procesar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="card-header bg-dark text-white py-3 border-0">
          <h5 className="mb-0 fw-bold">Caja y Liquidaciones</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">ID Pago</th>
                <th className="px-4 py-3">ID Orden</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-end">Fecha/Hora</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map(p => (
                <tr key={p.id}>
                  <td className="px-4"><code className="text-muted small">{p.id?.substring(0,8)}</code></td>
                  <td className="px-4"><code className="text-muted small">{p.ordenId?.substring(0,8)}</code></td>
                  <td className="px-4 fw-bold text-success">${p.monto.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="px-4">
                    <span className={`badge ${p.estado === 'COMPLETADO' ? 'bg-success' : 'bg-danger'} bg-opacity-10 text-${p.estado === 'COMPLETADO' ? 'success' : 'danger'}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-4 text-end text-muted small">{new Date(p.fechaPago).toLocaleString()}</td>
                </tr>
              ))}
              {pagos.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">No se han registrado movimientos de caja.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentManager;
