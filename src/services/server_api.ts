import { GetServerSidePropsContext } from "next";

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

    return response.json();
}