export interface Pedido {
    id: number; // Identificador único del pedido
    producto_nombre: string; // Nombre del producto
    cantidad: number; // Cantidad solicitada
    precio_unitario: number; // Precio por unidad del producto
    total: number; // Total calculado (cantidad * precio_unitario)
    estado: string; // Estado del pedido (Pendiente, Completado, Cancelado, etc.)
    fecha_pedido?: string; // Fecha y hora del pedido (Opcional si no se proporciona)
  }
  