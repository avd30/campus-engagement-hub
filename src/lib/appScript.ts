// src/lib/appsScript.ts
import { College } from '@/types/campus';

export const API_URL = '/.netlify/functions/database';

export async function fetchColleges(): Promise<College[]> {
  // Add redirect: 'follow' here to handle Google's 302 redirect
  const res = await fetch(API_URL, { 
    method: 'GET', 
    redirect: 'follow' 
  });
  
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return Array.isArray(json.data) ? json.data : Object.values(json.data || {});
}

export async function saveColleges(colleges: College[]): Promise<void> {
  // Add redirect: 'follow' here as well
  const res = await fetch(API_URL, {
    method: 'POST',
    redirect: 'follow',
    body: JSON.stringify({ action: 'save', data: colleges }),
  });
  
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
}