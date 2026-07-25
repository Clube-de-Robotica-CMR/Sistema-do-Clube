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

type Endpoints =
  | "auth"
  | "users"
  | "members"
  | "meetings"
  | "competitions"
  | "inventory";

let refreshPromise: Promise<void> | null = null;

async function doRequest(
  endpoint: Endpoints,
  action: string,
  data: any = {}
) {
  const response = await fetch(`/api/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ action, data }),
  });

  return {
    response,
    body: await response
      .json()
      .catch(() => ({})),
  };
}

/**
 * Cliente HTTP responsável por disparar as requisições RPC para o backend.
 * Rodando exclusivamente no contexto do navegador (Frontend).
 */
export async function rpcClient<T = any>(
  endpoint: Endpoints,
  action: string,
  data?: any,
): Promise<T> {
  let {
    response,
    body: result,
  } = await doRequest(
    endpoint,
    action,
    data
  );

  // Access token expirou
  if (
    response.status === 401 &&
    !(endpoint === "auth" && action === "refresh")
  ) {
    try {
      if (!refreshPromise) {
        refreshPromise = doRequest(
          "auth",
          "refresh"
        ).then(({ response }) => {
          if (!response.ok) {
            throw new Error();
          }
        });
      }

      await refreshPromise;
    } catch {
      window.location.href = "/login";
      throw new ApiError("Sessão expirada.");
    } finally {
      refreshPromise = null;
    }

    // Repete a requisição original
    ({
      response,
      body: result,
    } = await doRequest(
      endpoint,
      action,
      data
    ));
  }

  if (!response.ok) {
    throw new ApiError(
      !result.ok
        ? result.error
        : "Erro na comunicação com o servidor."
    );
  }

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
    : (result.message as T);
}