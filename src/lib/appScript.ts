

// src/lib/appsScript.ts
// Use the relative path to your Netlify function
export const API_URL = '/.netlify/functions/database'; 

export async function fetchColleges() {
  const res = await fetch(API_URL, { method: 'GET' }); 
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return json.data;
}

export async function saveColleges(colleges: any) {
  await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'save', data: colleges }),
  });
}