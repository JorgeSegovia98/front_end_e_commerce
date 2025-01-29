import { setCookie, getCookie } from "utils/Cookies";

const NICE = import.meta.env.VITE_CHARIZARD_PIKACHU_777;

function getDefaultHeaders(authRequired = false) {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  };

  if (authRequired) {
    const token = getCookie('jwt_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.error("No se encontró el token JWT en las cookies.");
    }
  }

  return headers;
}

export async function login(username, password) {
  try {
    const response = await fetch(`${NICE}/login`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response.status === 200) {
      const token = await response.text(); 
      setCookie("jwt_token", token); 
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error durante el login:', error);
    return false;
  }
}

export function getAuthHeaders() {
  return getDefaultHeaders(true);
}

export function getAuthenticatedUser() {
  const token = getCookie('jwt_token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
}

export async function changePassword(username, newPassword, securityAnswer) {
  try {
    const response = await fetch(`${NICE}/cambiar-contrasena`, {
      method: 'PATCH',
      headers: getDefaultHeaders(),
      body: JSON.stringify({
        username: username, 
        nuevaContrasena: newPassword, 
        preguntaSeguridad: securityAnswer, 
      }),
    });

    if (response.status === 200) {
      return true; 
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
    const response = await fetch(`${NICE}/registro`, {
      method: 'POST',
      headers: getDefaultHeaders(),
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
    const response = await fetch(`${NICE}/productos/usuario`, {
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
    const response = await fetch(`${NICE}/productos/editar/${productId}`, {
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
    const response = await fetch(`${NICE}/productos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        nombre: productData.nombre,
        precio: productData.precio,
        descripcion: productData.descripcion,
        imagen: null, 
        usuario: {
          id_usuario: productData.usuario.id, 
        },
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error del servidor:', errorDetails);
      throw new Error('Error al crear el producto');
    }

    return await response.json(); 
  } catch (error) {
    console.error('Error en createProduct:', error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${NICE}/productos`, {
      method: 'GET',
      headers: getAuthHeaders(),
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

export async function getProductImage(productId) {
  try {
    const response = await fetch(`${NICE}/productos/imagen/${productId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } else {
      console.error(
        `Error al obtener la imagen para el producto ${productId}: ${response.status} ${response.statusText}`
      );
      return null;
    }
  } catch (error) {
    console.error(
      `Error al conectar con el servidor para obtener la imagen del producto ${productId}:`,
      error
    );
    return null;
  }
}

export const uploadImage = async (productId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${NICE}/productos/upload/${productId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getCookie('jwt_token')}`,
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error al subir la imagen:', errorDetails);
      throw new Error('Error al subir la imagen');
    }

    return await response.text();
  } catch (error) {
    console.error('Error en uploadImage:', error);
    throw error;
  }
};

export const createPayment = async (total) => {
  const response = await fetch(
    `${NICE}/paypal/pagar?total=${total}`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error('Error al crear el pago');
  }

  return await response.text();
};

export const createOrder = async (pedido) => {
  const response = await fetch(`${NICE}/pedidos/crear`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(pedido),
  });

  if (!response.ok) {
    throw new Error('Error al crear el pedido');
  }

  return await response.text();
};

export const getOrders = async () => {
  const response = await fetch(`${NICE}/pedidos`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al obtener los pedidos');
  }

  return await response.json();
};
