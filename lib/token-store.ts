let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
  sessionStorage.setItem("accessToken", token);
}

export function getAccessToken() {
  if (accessToken) return accessToken;
  accessToken = sessionStorage.getItem("accessToken");
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
  sessionStorage.removeItem("accessToken");
}
