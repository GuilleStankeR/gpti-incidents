import { createContext } from 'react';

import type { AuthContextValue } from './session.types';

export const AuthContext = createContext<AuthContextValue | null>(null);
