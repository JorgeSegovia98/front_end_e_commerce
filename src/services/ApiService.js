import { setCookie, getCookie } from "utils/Cookies";

const API = 'https://backend-ecommerse-b6anfne4gqgacyc5.canadacentral-01.azurewebsites.net';

// Función para establecer el token JWT
export async function login(username, password) {
  try {
    const response = await fetch(`${API}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response.status === 200) {
      const token = await response.text(); // El token se devuelve como texto
      setCookie("jwt_token", token); // Guardamos el token en cookies
      console.log("Token recibido y guardado:", token);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error durante el login:', error);
    return false;
  }
}

// Función para obtener el encabezado de autorización
export function getAuthHeaders() {
  const token = getCookie('jwt_token'); // Obtén el token de las cookies
  if (!token) {
    console.error("No se encontró el token JWT en las cookies.");
    return {};
  }

  return {
    'Authorization': `Bearer ${token}`, // Encabezado con el token
    'Content-Type': 'application/json',
  };
}

// Función para obtener el usuario autenticado desde el token
export function getAuthenticatedUser() {
  const token = getCookie('jwt_token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decodificamos el JWT
    return payload.sub; // Supongamos que "sub" es el ID del usuario
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
}

export async function changePassword(username, newPassword, securityAnswer) {
  try {
    const response = await fetch(`${API}/cambiar-contrasena`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username, // Nombre de usuario
        nuevaContrasena: newPassword, // Nueva contraseña
        preguntaSeguridad: securityAnswer, // Respuesta de seguridad
      }),
    });

    if (response.status === 200) {
      return true; // Contraseña actualizada correctamente
    } else {
      const errorDetails = await response.text();
      console.error('Error al cambiar la contraseña:', errorDetails);
      return false;
    }
  } catch (error) {
    console.error('Error en changePassword:', error);
    return false;
  }
}


export async function register(username, password, correo, direccion, telefono, preguntaSeguridad) {
  try {
    const response = await fetch(`${API}/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        correo: correo,
        direccion: direccion,
        telefono: telefono,
        preguntaSeguridad: preguntaSeguridad
      }),
    });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error durante el registro:', error);
    return false;
  }
}

// Obtener productos de usuario
export async function getUserProducts() {
  try {
    const response = await fetch(`${API}/productos/usuario`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.status}`);
    }

    const productos = await response.json();
    return productos.map((product) => ({
      id: product.id,
      title: product.nombre,
      price: product.precio,
      description: product.descripcion,
      image: product.imagen ? `data:image/png;base64,${product.imagen}` : 'https://placehold.co/600x400',
      rating: 4.0,
    }));
  } catch (error) {
    console.error('Error al obtener productos del usuario:', error);
    return [];
  }
}

// Editar un producto
export async function editProduct(productId, formData) {
  try {
    const response = await fetch(`${API}/productos/editar/${productId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error del servidor:', errorDetails);
      throw new Error('Error al editar el producto');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al editar producto:', error);
    throw error;
  }
}


export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API}/data-api/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('jwt_token')}`, // Incluye el token JWT
      },
      body: JSON.stringify({
        nombre: productData.nombre,
        precio: productData.precio,
        descripcion: productData.descripcion,
        imagen: null, // Backend espera este valor explícitamente
        usuario: {
          id_usuario: productData.usuario.id, // Asegúrate de enviar "id_usuario"
        },
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error del servidor:', errorDetails);
      throw new Error('Error al crear el producto');
    }

    return await response.json(); // Devuelve el producto creado
  } catch (error) {
    console.error('Error en createProduct:', error);
    throw error;
  }
};



// Ejemplo: Obtener todos los productos
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API}/data-api/productos`, {
      method: 'GET',
      headers: getAuthHeaders(), // Incluimos el encabezado con el token
    });

    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error durante la solicitud de productos:', error);
    throw error;
  }
};

// Obtener la URL de la imagen de un producto por su ID
export async function getProductImage(productId) {
  try {
    // Log para verificar el producto solicitado
    console.log(`Solicitando imagen para el producto: ${productId}`);
    
    const response = await fetch(`${API}/productos/imagen/${productId}`, {
      method: 'GET',
      headers: getAuthHeaders(), // Incluye el token JWT aquí
    });

    if (response.ok) {
      // Convierte la respuesta binaria a un objeto URL para usar como fuente de imagen
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } else {
      console.error(
        `Error al obtener la imagen para el producto ${productId}: ${response.status} ${response.statusText}`
      );
      return null; // Devuelve `null` si la imagen no se puede cargar
    }
  } catch (error) {
    console.error(
      `Error al conectar con el servidor para obtener la imagen del producto ${productId}:`,
      error
    );
    return null;
  }
}



// Subir la imagen de un producto
export const uploadImage = async (productId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API}/productos/upload/${productId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getCookie('jwt_token')}`, // Incluye el token JWT
      },
      body: formData,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error al subir la imagen:', errorDetails);
      throw new Error('Error al subir la imagen');
    }

    console.log('Imagen subida exitosamente');
    return await response.text(); // Devuelve un mensaje del servidor
  } catch (error) {
    console.error('Error en uploadImage:', error);
    throw error;
  }
};



// Crear producto con imagen
export const createProductWithImage = async (productData, file) => {
  const formData = new FormData();

  formData.append("nombre", productData.nombre);
  formData.append("precio", productData.precio);
  formData.append("descripcion", productData.descripcion);
  formData.append("usuario", JSON.stringify({ id: productData.usuario.id })); // Corrige el usuario
  if (file) {
    formData.append("imagen", file); // Adjunta la imagen si existe
  }

  try {
    const response = await fetch(`${API}/data-api/productos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("jwt_token")}`, // Incluye el token JWT
      },
      body: formData,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Error del servidor:", errorDetails);
      throw new Error("Error al crear el producto");
    }

    return await response.json(); // Devuelve el producto creado
  } catch (error) {
    console.error("Error en createProductWithImage:", error);
    throw error;
  }
};




export const createOrder = async (pedido) => {
  try {
    const response = await fetch(`${API}/data-api/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedido),
    });

    if (!response.ok) {
      throw new Error('Error al crear el pedido');
    }

    const createdOrder = await response.json();
    return createdOrder;
  } catch (error) {
    console.error('Error en createOrder:', error);
    throw error;
  }
};
