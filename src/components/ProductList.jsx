import React, { useEffect, useState } from 'react';
import { getProductos, eliminarProducto, crearProducto } from '../services/api';

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', stock: '', precio: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProductos = async () => {
    try {
      const response = await getProductos();
      setProductos(response.data);
    } catch (err) {
      console.error('Error fetching products', err);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este producto?')) return;
    try {
      await eliminarProducto(id);
      fetchProductos();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al eliminar el producto. Verifique si está asociado a una orden.';
      alert(msg);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (nuevoProducto.stock <= 0) {
      setError('El stock debe ser mayor a cero.');
      return;
    }
    setLoading(true);
    try {
      await crearProducto(nuevoProducto);
      setNuevoProducto({ nombre: '', stock: '', precio: '' });
      setError('');
      fetchProductos();
    } catch (err) {
      alert('Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Gestión de Inventario</h2>
        <span className="badge bg-primary">{productos.length} Productos Registrados</span>
      </div>
      
      <div className="card border-0 shadow-sm mb-5">
        <div className="card-body p-4">
          <h5 className="card-title mb-4 fw-bold text-secondary">
            <i className="bi bi-plus-circle me-2"></i>Agregar Nuevo Producto
          </h5>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={handleCrear} className="row g-3">
            <div className="col-md-5">
              <label className="form-label small fw-bold">Nombre del Producto</label>
              <input 
                type="text" 
                placeholder="Ej. Laptop Dell" 
                className="form-control"
                value={nuevoProducto.nombre}
                onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold">Stock Inicial</label>
              <input 
                type="number" 
                placeholder="Cantidad" 
                className="form-control"
                value={nuevoProducto.stock}
                onChange={(e) => setNuevoProducto({...nuevoProducto, stock: e.target.value})}
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-bold">Precio (MXN)</label>
              <div className="input-group">
                <span className="input-group-text bg-light">$</span>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  className="form-control"
                  value={nuevoProducto.precio}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? '...' : 'Registrar'}
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
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3 text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td className="px-4"><code className="text-muted small">{p.id.substring(0, 8)}...</code></td>
                  <td className="px-4 fw-bold">{p.nombre}</td>
                  <td className="px-4 text-center">
                    <span className={`badge bg-${p.stock < 10 ? 'danger' : 'success'} bg-opacity-10 text-${p.stock < 10 ? 'danger' : 'success'}`}>
                      {p.stock} pz
                    </span>
                  </td>
                  <td className="px-4 fw-bold text-primary">${p.precio?.toLocaleString()}</td>
                  <td className="px-4 text-end">
                    <button 
                      className="btn btn-outline-danger btn-sm border-0" 
                      onClick={() => handleEliminar(p.id)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">No hay productos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
