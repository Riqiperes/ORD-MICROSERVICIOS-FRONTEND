import React, { useEffect, useState } from 'react';
import { getOrdenes, crearPago } from '../services/api';

const PaymentForm = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pago, setPago] = useState({ ordenId: '', monto: 0 });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const response = await getOrdenes();
        // Solo mostrar órdenes que no estén pagadas
        setOrdenes(response.data.filter(o => o.estado !== 'PAGADA'));
      } catch (err) {
        console.error('Error fetching orders', err);
      }
    };
    fetchOrdenes();
  }, []);

  const handlePago = async (e) => {
    e.preventDefault();
    try {
      await crearPago(pago);
      setMensaje({ texto: '¡Pago registrado exitosamente!', tipo: 'success' });
      setPago({ ordenId: '', monto: 0 });
      setSearchTerm('');
    } catch (err) {
      setMensaje({ texto: 'Error al procesar el pago. Verifique los datos.', tipo: 'danger' });
    }
  };

  // Filtrar órdenes para el buscador/scroll
  const filteredOrders = ordenes.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectOrder = (o) => {
    setPago({ ...pago, ordenId: o.id, monto: o.montoTotal });
    setSearchTerm(o.id);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">Registrar Nuevo Pago</h4>
            </div>
            <div className="card-body">
              {mensaje.texto && (
                <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`} role="alert">
                  {mensaje.texto}
                  <button type="button" className="btn-close" onClick={() => setMensaje({texto:'', tipo:''})}></button>
                </div>
              )}

              <form onSubmit={handlePago}>
                <div className="mb-3">
                  <label className="form-label fw-bold">ID de la Orden</label>
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Buscar o ingresar ID manualmente..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPago({...pago, ordenId: e.target.value});
                      }}
                      required
                    />
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"></button>
                    <ul className="dropdown-menu dropdown-menu-end w-100 shadow" style={{maxHeight: '200px', overflowY: 'auto'}}>
                      <li className="dropdown-header">Órdenes Pendientes</li>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map(o => (
                          <li key={o.id}>
                            <button 
                              className="dropdown-item py-2" 
                              type="button"
                              onClick={() => selectOrder(o)}
                            >
                              <div className="d-flex justify-content-between">
                                <span>{o.id.substring(0, 12)}...</span>
                                <span className="badge bg-primary">${o.montoTotal}</span>
                              </div>
                            </button>
                          </li>
                        ))
                      ) : (
                        <li><span className="dropdown-item-text text-muted">No hay resultados</span></li>
                      )}
                    </ul>
                  </div>
                  <div className="form-text">Puedes buscar en la lista o escribir el ID manualmente.</div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Monto a Pagar</label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text">$</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-control" 
                      value={pago.monto}
                      onChange={(e) => setPago({...pago, monto: parseFloat(e.target.value)})}
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-success btn-lg w-100 shadow-sm" disabled={!pago.ordenId}>
                  Procesar Pago
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
