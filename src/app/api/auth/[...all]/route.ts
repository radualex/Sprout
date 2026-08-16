import { toNextJsHandler } from 'better-auth/next-js';

// Lib
import { auth } from '@/js/lib/auth';

export const { GET, POST } = toNextJsHandler(auth.handler);
