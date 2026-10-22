import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const ROOT_DIRECTORY = fileURLToPath(new URL('../..', import.meta.url));
const SOURCE_DIRECTORY = fileURLToPath(new URL('src', import.meta.url));
const API_ROUTE_PREFIX = '/api';
const CLIENT_ENV_PREFIXES = ['VITE_', 'TIME_ZONE'];

function resolveApiTarget(mode: string): string {
  const { API_PORT: apiPort } = loadEnv(mode, ROOT_DIRECTORY, '');

  if (apiPort === undefined || apiPort.length === 0) {
    throw new Error('API_PORT is not defined in the root .env file');
  }

  return `http://localhost:${apiPort}`;
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  envDir: ROOT_DIRECTORY,
  envPrefix: CLIENT_ENV_PREFIXES,
  resolve: {
    alias: { '@': SOURCE_DIRECTORY },
  },
  server: {
    proxy: { [API_ROUTE_PREFIX]: resolveApiTarget(mode) },
  },
}));
