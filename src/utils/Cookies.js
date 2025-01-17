// Obtiene una cookie específica
export function getCookie(name) {
  const matches = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return matches ? matches[2] : null;
}

// Establece una cookie
export function setCookie(name, value, days = 7) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

// Elimina una cookie específica
export function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// Elimina todas las cookies
export function deleteAllCookies() {
  const cookies = document.cookie.split(';'); // Obtiene todas las cookies
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    deleteCookie(name); // Elimina cada cookie individualmente
  }
}
