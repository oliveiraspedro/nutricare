// src/api/fatsecret.ts
export async function getFatSecretToken() {
  const clientId = 'c35c4e743d47433791233bc78b73a727';
  const clientSecret = 'b889f6ac8ed84d24b3b912deebfab6cf';
  const response = await fetch('https://oauth.fatsecret.com/connect/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=basic',
  });

  const data = await response.json();
  return data.access_token;
}
