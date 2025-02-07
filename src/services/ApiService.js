import { setCookie, getCookie } from "utils/Cookies";

const NICE = 'http://34.59.90.108:80';

function getDefaultHeaders(authRequired = false) {
  const headers = {
    'Content-Type': 'application/json'
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
    const response = await fetch(`${NICE}/mi-sg/seguridad/login`, {
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

import { useNavigate } from "react-router-dom";

export async function changePassword(username, newPassword, securityAnswer, navigate) {
  try {
    const API_URL = "http://34.59.90.108:80/mi-sg/seguridad/cambiar-contrasena";

    const response = await fetch(API_URL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username, 
        password: newPassword,  // Corrección del campo
        preguntaSeguridad: securityAnswer,
      }),
    });

    if (response.status === 200 || response.status === 201) {
      console.log("✅ Contraseña cambiada correctamente");
      return true; // 
    } else {
      const errorDetails = await response.text();
      console.error("❌ Error en la API:", errorDetails);
      return false;
    }
  } catch (error) {
    console.error("❌ Error en changePassword:", error);
    return false;
  }
}


export async function register(username, password, correo, direccion, telefono, preguntaSeguridad) {
  try {
    const response = await fetch(`${NICE}/mi-sg/seguridad/registro`, {
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

    if (response.status === 200 || response.status === 201) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error durante el registro:', error);
    return false;
  }
}

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
    const response = await fetch(`${NICE}/mi-pr/productos`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("❌ Error al crear el producto:", errorDetails);
      throw new Error("Error al crear el producto");
    }

    console.log("✅ Producto creado correctamente.");

    // ✅ Extraer el ID del producto desde la respuesta JSON
    const jsonResponse = await response.json();
    if (jsonResponse.id) {
      console.log(`🔹 ID del producto recibido: ${jsonResponse.id}`);
      return jsonResponse.id;
    }

    console.warn("⚠️ No se encontró el ID del producto en la respuesta.");
    return null;
  } catch (error) {
    console.error("❌ Error en createProduct:", error);
    throw error;
  }
};




export const getAllProducts = async () => {
  try {
    const response = await fetch(`${NICE}/mi-pr/productos`, {
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
    const response = await fetch(`${NICE}/mi-pr/productos/imagen/${productId}`, {
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
  if (!productId) {
    console.error("❌ No se puede subir la imagen sin un productId.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file); // 🔥 Asegúrate de que "file" sea el nombre correcto

  try {
    const response = await fetch(`${NICE}/mi-pr/productos/upload/${productId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("jwt_token")}`, // 🔥 Asegúrate de que el token es correcto
        "Cache-Control": "no-store",
        "Pragma": "no-cache",
        "X-Content-Type-Options": "nosniff",
        // ❌ No agregues 'Content-Type': 'multipart/form-data' aquí, porque fetch lo maneja automáticamente.
      },
      body: formData,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("❌ Error al subir la imagen:", errorDetails);
      throw new Error("Error al subir la imagen");
    }

    console.log("✅ Imagen subida correctamente.");
    return true;
  } catch (error) {
    console.error("❌ Error en uploadImage:", error);
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
  try {
    const response = await fetch(`${NICE}/mi-pe/pedidos/crear`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(pedido),
    });

    const responseText = await response.text();
    console.log("📡 Respuesta del backend:", responseText);

    if (!response.ok) {
      console.error("❌ Error en la API:", responseText);
      throw new Error("Error al crear el pedido");
    }

    return responseText;
  } catch (error) {
    console.error("❌ Error en createOrder:", error);
    throw error;
  }
};


export const getOrders = async () => {
  const response = await fetch(`${NICE}/mi-pe/pedidos/usuario`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al obtener los pedidos');
  }

  return await response.json();
};
