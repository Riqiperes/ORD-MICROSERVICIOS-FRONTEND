import React, { useEffect, useState } from 'react';
import { getProductos, getClientes, crearOrden } from '../services/api';

const OrderForm = () => {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [orden, setOrden] = useState({ clienteId: '', productoId: '', cantidad: 1 });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, cliRes] = await Promise.all([getProductos(), getClientes()]);
        setProductos(prodRes.data);
        setClientes(cliRes.data);
      } catch (err) {
        console.error('Error fetching data', err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (orden.cantidad <= 0) {
      setMensaje({ texto: 'La cantidad debe ser mayor a cero.', tipo: 'danger' });
      return;
    }

    try {
      await crearOrden(orden);
      setMensaje({ texto: 'Orden creada exitosamente.', tipo: 'success' });
      setOrden({ clienteId: '', productoId: '', cantidad: 1 });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setMensaje({ texto: err.response.data.message || 'Error en la solicitud.', tipo: 'danger' });
      } else {
        setMensaje({ texto: 'Error al crear la orden.', tipo: 'danger' });
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Orden</h2>
      {mensaje.texto && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}
      
      <form onSubmit={handleSubmit} className="p-4 border rounded">
        <div className="mb-3">
          <label className="form-label">Cliente</label>
          <select 
            className="form-select" 
            value={orden.clienteId}
            onChange={(e) => setOrden({...orden, clienteId: e.target.value})}
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Producto</label>
          <select 
            className="form-select" 
            value={orden.productoId}
            onChange={(e) => setOrden({...orden, productoId: e.target.value})}
            required
          >
            <option value="">Seleccione un producto</option>
            {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stock})</option>)}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad</label>
          <input 
            type="number" 
            className="form-control" 
            value={orden.cantidad}
            onChange={(e) => setOrden({...orden, cantidad: parseInt(e.target.value)})}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">Crear Orden</button>
      </form>
    </div>
  );
};

export default OrderForm;
