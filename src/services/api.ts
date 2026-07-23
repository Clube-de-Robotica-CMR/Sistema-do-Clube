import { ApiError } from "@/lib/api_error";
import { FieldErrors, ValidationError } from "@/lib/validation_error";

export type ApiResponse<T> =
  | { ok: true; data: T; message?: string }
  | { ok: true; message: string; data?: T }
  | {
    ok: false;
    error: string;
    details: {
      formErrors: string[];
      fieldErrors: FieldErrors;
    };
  }
  | {
    ok: false;
    error: string;
  };

type Endpoints = 'auth' | 'users' | 'members' | 'meetings' | 'competitions' | 'inventory';

/**
 * Cliente HTTP responsável por disparar as requisições RPC para o backend.
 * Rodando exclusivamente no contexto do navegador (Frontend).
 */
export async function rpcClient<T = any>(
  endpoint: Endpoints,
  action: string,
  data?: any
): Promise<T> {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, data }),
    });

    if (!response.ok) {
      const errorData: ApiResponse<any> = await response.json().catch(() => ({}));
      throw new Error(!errorData.ok ? errorData.error : 'Erro na comunicação com o servidor.');
    }

    const result: ApiResponse<T> =
      await response.json();

    if (!result.ok) {
      if ("details" in result) {
        throw new ValidationError(
          result.error,
          result.details
        );
      }

      throw new ApiError(result.error);
    }

    return result.data !== undefined
      ? result.data
      : result.message! as T;
  } catch (error: any) {
    throw error;
  }
}