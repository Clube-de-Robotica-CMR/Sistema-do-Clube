import { ApiError } from "@/lib/api_error";
import { GetServerSidePropsContext } from "next";

export type ApiResponse<T> =
    | { ok: true; data: T; message?: string }
    | { ok: true; message: string; data?: T }
    | { ok: false; error: string };

export async function serverRpcClient(
    ctx: GetServerSidePropsContext,
    route: string,
    action: string,
    data?: unknown
) {
    const protocol =
        process.env.NODE_ENV === "development"
            ? "http"
            : "https";

    const host = process.env.HOST;
    try {
        const response = await fetch(
            `${protocol}://${host}${route}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(ctx.req.headers.cookie
                        ? {
                            Cookie: ctx.req.headers.cookie,
                        }
                        : {}),
                },
                body: JSON.stringify({
                    action,
                    data,
                }),
            }
        );

        // Propaga cookies (refresh -> browser)
        const setCookie = response.headers.get("set-cookie");

        if (setCookie) {
            ctx.res.setHeader("Set-Cookie", setCookie);
        }

        const result: ApiResponse<any> = await response.json();

        if (!result.ok && response.status >= 500) {
            throw new Error(result.error);
        }

        if (!result.ok) {
            throw new ApiError(result.error);
        }

        return result;

    } catch (err) {
        throw err;
    }
}

export async function serverRpcData<T>(
    ctx: GetServerSidePropsContext,
    route: string,
    action: string,
    data?: unknown
) {
    const result: ApiResponse<T> = await serverRpcClient(ctx, route, action, data);

    if (!result.data) {
        throw new Error("A API não retornou dados.");
    }

    return result.data;
}