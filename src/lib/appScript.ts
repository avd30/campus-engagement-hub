// src/lib/appsScript.ts
import { College } from '@/types/campus';

export const API_URL = 'https://script.google.com/macros/s/AKfycbwgEB6xIPfaeiW1Araflxx4GJM267cCGUZ-PkGp7oBLp_OcQzbK4KE7OILrrEbKBcjI/exec';

export async function fetchColleges(): Promise<College[]> {
  const res = await fetch(API_URL, {
    method: 'GET',
    redirect: 'follow',           // ← added here
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return Array.isArray(json.data) ? json.data : Object.values(json.data || {});
}

export async function saveColleges(colleges: College[]): Promise<void> {
  await fetch(API_URL, {
    method: 'POST',
    redirect: 'follow',           // ← added here
    body: JSON.stringify({ action: 'save', data: colleges }),
  });
}