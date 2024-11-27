const API = 'http://localhost:8080';

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
      return true;  
    } else {
      return false; 
    }
  } catch (error) {
    console.error('Error durante el login:', error);
    return false; 
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
      return Promise.all(data._embedded.productos.map(async (product) => ({
        id: product.id,
        title: product.nombre,
        price: product.precio,
        description: product.descripcion,
        image: await getProductImage(product.id) || 'https://placehold.co/600x400',
        rating: 4.0,
      })));
    } else {
      console.error(`Error al obtener productos: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.error('Error durante la solicitud de productos:', error);
    return [];
  }
}

export async function createProduct(product) {
  try {
    const response = await fetch(`${API}/data-api/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al crear el producto');
    }
  } catch (error) {
    console.error('Error durante la creación del producto:', error);
    throw error;
  }
}

export async function updateProduct(productId, productData) {
  try {
    const response = await fetch(`${API}/data-api/productos/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Error al actualizar el producto');
    }
  } catch (error) {
    console.error('Error durante la actualización del producto:', error);
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await fetch(`${API}/data-api/productos/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el producto');
    }
    return true;
  } catch (error) {
    console.error('Error durante la eliminación del producto:', error);
    throw error;
  }
}

export const getAllProducts = async () => {
  const response = await fetch(`${API}/data-api/productos`);
  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }
  return await response.json();
};

export const getProductImage = async (productoId) => {
  try {
    const response = await fetch(`${API}/productos/imagen/${productoId}`);
    
    if (!response.ok) {
      return 'https://placehold.co/600x400';
    }

    const blob = await response.blob();
    
    if (blob.size === 0) {
      return 'https://placehold.co/600x400';
    }

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error obteniendo imagen:', error);
    return 'https://placehold.co/600x400';
  }
};

export const uploadProductImage = async (productId, imageFile) => {
  try {
    validateImage(imageFile);

    const formData = new FormData();
    formData.append('file', imageFile);

    console.log('Subiendo imagen:', {
      productId,
      fileName: imageFile.name,
      fileSize: imageFile.size
    });

    const response = await fetch(`${API}/productos/upload/${productId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error al subir la imagen:', errorText);
      throw new Error(errorText || 'Error al subir la imagen');
    }

    const result = await response.text();
    console.log('Respuesta del servidor:', result);
    return result;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

const validateImage = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5 MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no válido. Solo se permiten JPEG, PNG y GIF.');
  }

  if (file.size > maxSize) {
    throw new Error('El archivo es demasiado grande. Máximo 5 MB.');
  }
};