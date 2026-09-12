import { toNextJsHandler } from 'better-auth/next-js';

// Auth
import { auth } from '@/lib/auth';

export const { GET, POST } = toNextJsHandler(auth.handler);
