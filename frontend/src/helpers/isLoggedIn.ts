// at the moment it does it by checking the time left. but what if the token is stolen? Maybe should be done by an API... for the future...
export function isLoggedIn() {
  const token = localStorage.getItem('access');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // atob is a built-in browser function that decodes a Base64-encoded string back into plain text.
    //console.log(payload)
    return payload.exp * 1000 > Date.now(); // exp is in seconds, Date.now() is ms
  } catch {
    return false;
  }
}
