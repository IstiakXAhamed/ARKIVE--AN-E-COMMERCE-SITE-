export const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
  ? process.env.NEXT_PUBLIC_APP_URL 
  : process.env.NODE_ENV === 'production' 
    ? 'https://arkivee.com' 
    : 'http://localhost:3000';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Use absolute URL for server-side fetches
  const url = typeof window === 'undefined' ? `${baseUrl}${path}` : path;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'API Error' }));
    throw new Error(error.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}
