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
        id: index + 1, // Genera un ID basado en el índice
        title: product.nombre,
        price: product.precio,
        description: product.descripcion,
        image: product.imagen || 'https://placehold.co/600x400', // Imagen por defecto
        rating: 4.0, // Asigna un rating fijo por ahora
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
        return await response.json(); // Retorna los datos del producto creado
      } else {
        throw new Error('Error al crear el producto');
      }
    } catch (error) {
      console.error('Error durante la creación del producto:', error);
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