import Head from "next/head";
import { GetServerSideProps } from "next";

import { checkAuth } from "@/lib/auth";
import HomeLayout from "@/components/layout/home_layout";

interface HomeProps {
  role: "admin" | "diretoria";
}

export default function HomePage({ role }: HomeProps) {
  return (
    <>
      <Head>
        <title>Clube de Robótica</title>

        <meta
          name="description"
          content="Sistema de Gestão do Clube de Robótica"
        />

        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <HomeLayout role={role} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx
) => {
  const auth = await checkAuth(ctx);

  if (!auth.authenticated) {
    console.log(auth)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      role: auth.user!.role,
    },
  };
};