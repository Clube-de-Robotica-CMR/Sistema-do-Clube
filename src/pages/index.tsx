import { checkAuth } from "@/lib/auth";
import { GetServerSideProps } from "next";
import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Clube de Robótica</title>
        <meta
          name="description"
          content="Sistema de Gestão do Clube de Robótica"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <h1 className="text-2xl font-bold text-zinc-950">
          Painel do Clube de Robótica 🤖
        </h1>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps =
  async (ctx) => {

    const authenticated = await checkAuth(ctx);


    if (!authenticated) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }


    return {
      props: {},
    };
  };