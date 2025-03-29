export interface Productos {
  order_id: number; // Identificador único del pedido
  email?: string; // Opcional, ya que puede ser NULL
  fecha?: string; // Fecha en formato ISO (YYYY-MM-DDTHH:MM:SS) o string
  total: number; // Total del pedido
  estado?: string; // Estado del pedido (Pendiente, Completado, etc.)
  codigo: string; // Código del producto
  nombre: string; // Nombre del producto
  descripcion?: string; // Descripción del producto (Opcional)
  precio: number; // Precio unitario
  imagen?: string; // URL de la imagen (Opcional)
  categoria: string; // Categoría del producto
  cantidad: number; // Cantidad disponible
  estadoInventario?: string; // Estado del inventario (Opcional)
  rating?: number; // Calificación del producto (Opcional)
}
