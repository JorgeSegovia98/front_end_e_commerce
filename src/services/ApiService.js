import { setCookie, getCookie } from "utils/Cookies";

const API = 'https://backend-ecommerse-b6anfne4gqgacyc5.canadacentral-01.azurewebsites.net';

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

export async function changePassword(username, newPassword) {
  try {
    const response = await fetch(`${API}/cambiar-contrasena`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        nuevaContrasena: newPassword,
      }),
    });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error durante el cambio de contraseña:', error);
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

export async function getUserProducts(userId) {
  try {
    const response = await fetch(`${API}/data-api/usuarios/${userId}/productos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data._embedded.productos.map((product, index) => ({
        id: index + 1,
        title: product.nombre,
        price: product.precio,
        description: product.descripcion,
        image: product.imagen || 'https://placehold.co/600x400',
        rating: 4.0,
      }));
    } else {
      console.error(`Error al obtener productos: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.error('Error durante la solicitud de productos:', error);
    return [];
  }
}

export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API}/data-api/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: productData.nombre,
        precio: productData.precio,
        descripcion: productData.descripcion,
        usuario: productData.usuario,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al crear el producto');
    }

    const createdProduct = await response.json();
    return createdProduct;
  } catch (error) {
    console.error('Error en createProduct:', error);
    throw error;
  }
};

export const getAllProducts = async () => {
  const response = await fetch(`${API}/data-api/productos`);
  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }
  return await response.json();
};

export async function getProductImage(productId) {
  try {
    const response = await fetch(`${API}/productos/imagen/${productId}`, {
      method: 'GET',
    });

    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } else {
      console.error(`Error al obtener la imagen para el producto ${productId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error al conectar con el servidor para obtener la imagen del producto ${productId}:`, error);
    return null;
  }
}

export const uploadImage = async (productId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API}/productos/upload/${productId}`, {
    method: 'POST',
    body: formData,
  });

  const responseBody = await response.text();

  if (!response.ok) {
    console.error('Error al subir la imagen:', responseBody);
    throw new Error('Error al subir la imagen');
  }

  try {
    return JSON.parse(responseBody);
  } catch (error) {
    return responseBody;
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
