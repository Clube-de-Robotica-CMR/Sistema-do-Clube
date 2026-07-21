import { GetServerSidePropsContext } from "next";
import { serverRpcClient } from "@/services/server_api";

export interface AuthUser {
    id: string;
    name: string;
    role: "admin" | "diretoria";
}

export interface AuthResult {
    authenticated: boolean;
    user?: AuthUser;
}

export async function checkAuth(
    ctx: GetServerSidePropsContext
): Promise<AuthResult> {
    const cookies = ctx.req.headers.cookie ?? "";

    const hasAccessToken = cookies.includes("access_token");
    const hasRefreshToken = cookies.includes("refresh_token");

    if (!hasAccessToken && !hasRefreshToken) {
        return {
            authenticated: false,
        };
    }

    // Primeiro tenta usar o access_token atual
    if (hasAccessToken) {
        try {
            const response = await serverRpcClient(
                ctx,
                "/api/auth",
                "me"
            );

            return {
                authenticated: true,
                user: response.data,
            };
        } catch (err) {
        }
    }

    // Se falhou ou só existe refresh_token
    if (hasRefreshToken) {
        try {
            await serverRpcClient(
                ctx,
                "/api/auth",
                "refresh"
            );

            const response = await serverRpcClient(
                ctx,
                "/api/auth",
                "me"
            );

            return {
                authenticated: true,
                user: response.data,
            };
        } catch (err) {
            return {
                authenticated: false,
            };
        }
    }

    return {
        authenticated: false,
    };
}