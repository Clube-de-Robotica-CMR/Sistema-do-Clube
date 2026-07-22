import { AppError } from '@/core/errors/app-error';
import { RequestError } from '@/core/errors/domain-errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export type AppRouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<unknown> | unknown;

export function api_handler(handler: AppRouteHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(200).json({
          ok: false,
          error: 'Falha na validação de dados',
          details: z.flattenError(error),
        });
      }

      if (error instanceof RequestError) {
        return res.status(error.status).json({
          ok: false,
          error: error.message,
          details: {
            fieldErrors: error.fieldErrors
          }
        });
      }

      if (error instanceof AppError) {
        if (error.status == 500) {
          console.error(`[Server Error]: ${error.message}`)
          console.error(`[Stack]: ${error.stack}`)
        }

        return res.status(error.status).json({
          ok: false,
          error: error.message,
        });
      }

      const errorMessage = error instanceof Error ? error.message : 'Erro interno no servidor';

      console.error(`[Server Error]: ${errorMessage}`)
      console.error(`[Error]: ${error}`)

      return res.status(500).json({
        ok: false,
        error: errorMessage,
      });
    }
  };
}