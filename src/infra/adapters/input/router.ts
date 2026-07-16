import type { NextApiRequest, NextApiResponse } from 'next';
import { AppRouteHandler } from './api-handler';
import { RouterError } from '@/core/errors/router-errors';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RouterConfig = {
  [key in HttpMethod]?: AppRouteHandler;
};

export function create_router(routes: RouterConfig) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method as HttpMethod;
    const handler = routes[method];

    if (!handler) throw new RouterError(`O método ${method} não existe`)
    
    await handler(req, res);
  };
}