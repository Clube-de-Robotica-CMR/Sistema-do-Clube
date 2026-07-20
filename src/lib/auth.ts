import { GetServerSidePropsContext } from "next";
import { serverRpcClient } from "@/services/server_api";


export async function checkAuth(
    ctx: GetServerSidePropsContext
) {
    const cookies = ctx.req.headers.cookie ?? "";

    const hasAccessToken =
        cookies.includes("access_token");

    const hasRefreshToken =
        cookies.includes("refresh_token");


    // Caso não exista nenhum cookie
    if (!hasAccessToken && !hasRefreshToken) {
        return false;
    }


    // Primeiro tenta validar a sessão atual
    if (hasAccessToken) {
        return true;
    }


    // Se só tem refresh, tenta renovar
    if (hasRefreshToken) {
        try {
            const response = await serverRpcClient(
                ctx,
                "/api/auth",
                "refresh"
            );

            return response.ok === true;

        } catch {
            return false;
        }
    }


    return false;
}