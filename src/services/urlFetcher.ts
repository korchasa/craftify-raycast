// src/extract.ts
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

/**
 * Loads a page by URL and returns the main text content.
 * @param url — page address
 */
export async function fetchUrlAndExtractText(url: string): Promise<string> {
  // 1. Load HTML
  const res = await fetch(url, {
    headers: {
      // set User-Agent so that sites do not block requests
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36',
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to load page: ${res.status} ${res.statusText}`);
  }
  const html = await res.text();

  // 2. Parse into DOM
  const dom = new JSDOM(html, {
    url,           // needed so that relative links work correctly
    contentType: 'text/html',
  });

  // 3. Apply Readability
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) {
    throw new Error('Failed to extract page content');
  }

  // article.textContent already contains the "clean" text
  // You can also use article.title, article.excerpt, article.byline, etc.
  if (!article.textContent) {
    throw new Error('Failed to extract article text');
  }
  return article.textContent.trim();
}
