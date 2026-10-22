import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';
import '@/styles/index.css';

const ROOT_ELEMENT_SELECTOR = '#root';

const rootElement = document.querySelector<HTMLElement>(ROOT_ELEMENT_SELECTOR);

if (rootElement === null) {
  throw new Error(`Missing ${ROOT_ELEMENT_SELECTOR} element`);
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
