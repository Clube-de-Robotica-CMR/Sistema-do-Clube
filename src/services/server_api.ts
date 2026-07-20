import { GetServerSidePropsContext } from "next";

export async function serverRpcClient(
    ctx: GetServerSidePropsContext,
    route: string,
    action: string,
    data?: unknown
) {
    const cookie = ctx.req.headers.cookie;

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${route}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(cookie
                    ? {
                        Cookie: cookie,
                    }
                    : {}),
            },
            body: JSON.stringify({
                action,
                data,
            }),
        }
    );

    return response.json();
}