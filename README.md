# Tienda Virtual - Principios de Seguridad de Software

Este proyecto es una **Tienda Virtual** desarrollada con React y una API backend, que implementa prácticas seguras de desarrollo de software para garantizar la protección de los datos de los usuarios y la integridad del sistema.

## Características Principales
- **Compra de Productos**: Los usuarios pueden explorar y comprar productos.
- **Gestión de Carrito**: Los productos pueden ser agregados y gestionados desde el carrito de compras.
- **Publicación de Productos**: Los usuarios autenticados pueden publicar productos para su venta, incluyendo imágenes.
- **Detección de errores y navegación segura**.

## Principios de Seguridad Implementados
Este proyecto fue diseñado siguiendo principios clave de seguridad de software para prevenir vulnerabilidades comunes y proteger tanto los datos de los usuarios como la infraestructura del sistema.

### 1. **Validación y Sanitización de Entradas**
Todas las entradas del usuario son validadas y sanitizadas para prevenir ataques como la **inyección de scripts (XSS)** y manipulaciones maliciosas de datos.

- Uso de la biblioteca [DOMPurify](https://github.com/cure53/DOMPurify) para sanitizar entradas de texto, como:
  - Nombres de productos.
  - Descripciones.
  
```javascript
import DOMPurify from 'dompurify';
const sanitizedInput = DOMPurify.sanitize(userInput);
```

- Validación en campos numéricos y archivos para prevenir entradas inválidas.

### 2. **Autenticación Segura**
- El sistema utiliza **tokens JWT** (JSON Web Tokens) para autenticar y autorizar a los usuarios. Los tokens son verificados en cada solicitud para garantizar la identidad del usuario.
- Función para extraer el ID del usuario desde el token:

```javascript
import jwtDecode from 'jwt-decode';
export const getUserIdFromToken = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    const decoded = jwtDecode(token);
    return decoded.userId;
  }
  return null;
};
```

### 3. **Manejo Seguro de Errores**
- Los mensajes de error no exponen información sensible sobre el sistema.
- Ejemplo:

```javascript
try {
  const response = await fetch(apiEndpoint);
  if (!response.ok) {
    throw new Error('Error al obtener los datos');
  }
} catch (error) {
  console.error('Error capturado:', error);
  setError('Ocurrió un problema. Inténtalo de nuevo.');
}
```

### 4. **Subida Segura de Archivos**
- Restricciones en el tipo de archivo permitido: solo imágenes con extensiones comunes como `.jpg`, `.png`.
- Validación adicional para prevenir la ejecución de scripts maliciosos.

```javascript
<input
  type="file"
  accept="image/*"
  onChange={handleImageChange}
/>
```

### 5. **Políticas de Navegación Segura**
- Redirecciones controladas mediante `useNavigate` para evitar accesos no autorizados o rutas inconsistentes.
- Prevención de navegación insegura basada en el estado del usuario.

### 6. **Buenas Prácticas de Configuración**
- Separación de ambientes: las URL de la API se manejan a través de variables de entorno.
- Ejemplo de archivo `.env`:
```
REACT_APP_API_BASE_URL=https://api.tienda-virtual.com
```

### 7. **Código Limpio y Modular**
- Separación de lógica de negocio y presentación:
  - Los servicios de la API están en `services/ApiService.js`.
  - Lógica compartida como el manejo del carrito en `CartLogic/CartContext.js`.

### 8. **Mitigación de CSRF**
- El backend está configurado para validar los tokens y prevenir ataques de falsificación de solicitudes.

### 9. **Evitar Exposición de Datos Sensibles**
- Los mensajes de error y logs de consola están diseñados para no incluir información confidencial.

```javascript
console.error('Error al publicar el producto:', error.message);
```

### 10. **Principio de Menor Privilegio**
- Los usuarios solo tienen acceso a los recursos que les corresponden. La propiedad `usuario: { id: userId }` asegura que los productos están vinculados a su creador.

## Tecnologías Utilizadas
- **Frontend**: React con React Router para la navegación.
- **Backend**: API RESTful.
- **Seguridad**: DOMPurify, JWT, validación del lado del cliente y del servidor.

## Ejecución Local
1. Clonar este repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar las variables de entorno en un archivo `.env`.
4. Iniciar la aplicación:
   ```bash
   npm start
   ```

## Contribuciones
Las contribuciones para mejorar la seguridad o agregar nuevas funcionalidades son bienvenidas. Por favor, asegúrate de seguir las mejores prácticas de seguridad al enviar código.

---
Este proyecto se construyó con un enfoque en la **seguridad** para proteger a los usuarios y mantener la confianza en el sistema.

