import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import type { ServerOptions } from 'vite';

const ROOT_DIRECTORY = fileURLToPath(new URL('../..', import.meta.url));
const SOURCE_DIRECTORY = fileURLToPath(new URL('src', import.meta.url));
const API_ROUTE_PREFIX = '/api';
const CLIENT_ENV_PREFIXES = ['VITE_', 'TIME_ZONE'];

function requireVariable(mode: string, name: string): string {
  const value = loadEnv(mode, ROOT_DIRECTORY, '')[name];

  if (value === undefined || value.length === 0) {
    throw new Error(`${name} is not defined in the environment or the root .env file`);
  }

  return value;
}

function createDevelopmentServer(mode: string): ServerOptions {
  return {
    proxy: { [API_ROUTE_PREFIX]: `http://localhost:${requireVariable(mode, 'API_PORT')}` },
  };
}

export default defineConfig(({ command, mode }) => {
  requireVariable(mode, 'TIME_ZONE');

  return {
    plugins: [react(), tailwindcss()],
    envDir: ROOT_DIRECTORY,
    envPrefix: CLIENT_ENV_PREFIXES,
    resolve: {
      alias: { '@': SOURCE_DIRECTORY },
    },
    server: command === 'serve' ? createDevelopmentServer(mode) : undefined,
  };
});
