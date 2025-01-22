import { getCookie } from './Cookies';

export const decodeToken = (token) => {
  try {
    const payloadBase64 = token.split('.')[1]; // Obtiene la segunda parte del token
    const payloadDecoded = atob(payloadBase64); // Decodifica la base64
    return JSON.parse(payloadDecoded); // Convierte a objeto JSON
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};

export const getUserIdFromToken = () => {
  const token = getCookie('jwt_token'); // Obtiene el token de la cookie
  if (!token) return null;

  const decoded = decodeToken(token); // Decodifica el token
  return decoded?.sub || null; // Retorna el campo `sub` (ID del usuario)
};
