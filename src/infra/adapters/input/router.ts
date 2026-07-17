import { RouterError } from '@/core/errors/router-error';
import { NextApiRequest, NextApiResponse } from 'next';

type ActionHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<any>;
type Middleware = (req: NextApiRequest, res: NextApiResponse) => Promise<any> | any

interface ActionRoutes {
  [actionName: string]: ActionHandler;
}

export function create_router(routes: ActionRoutes, middleware?: Middleware) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (middleware) await middleware(req, res)

    if (req.method !== 'POST') {
      throw new RouterError('Método não permitido. Utilize POST.');
    }

    const { action } = req.body;

    if (!action) {
      throw new RouterError("O campo 'action' é obrigatório no corpo da requisição.");
    }

    const handler = routes[action];

    if (!handler) {
      throw new RouterError(`Ação '${action}' não encontrada ou inválida.` );
    }

    await handler(req, res);
  };
}