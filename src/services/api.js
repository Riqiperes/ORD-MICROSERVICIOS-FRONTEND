import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getProductos = () => api.get('/productos');
export const crearProducto = (producto) => api.post('/productos', producto);
export const eliminarProducto = (id) => api.delete(`/productos/${id}`);

export const getClientes = () => api.get('/clientes');
export const crearCliente = (cliente) => api.post('/clientes', cliente);

export const crearOrden = (orden) => api.post('/ordenes', orden);
export const getOrdenes = () => api.get('/ordenes'); // Note: Make sure backend has this or handle error

export const crearPago = (pago) => api.post('/pagos', pago);
export const getPagos = () => api.get('/pagos');

export const getEnvios = () => api.get('/retry/envios'); // Consultando a message-broker-be que tiene los envios en JPA

export default api;
