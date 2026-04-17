// netlify/functions/database.ts
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const API_URL = process.env.VITE_APPS_SCRIPT_URL; 

  if (!API_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "API_URL not set in Netlify" })
    };
  }

  try {
    // This forwards the request to Google Apps Script
    const response = await fetch(API_URL, {
      method: event.httpMethod,
      body: event.body,
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    };
  } catch (error: any) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ ok: false, error: error.message }) 
    };
  }
};