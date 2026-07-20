import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import PasswordInput from "@/components/ui/password_input";

import { rpcClient } from "@/services/api";
import Head from "next/head";
import { checkAuth } from "@/lib/auth";
import { GetServerSideProps } from "next";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);

    try {
      await rpcClient("auth", "login", {
        name: form.get("name"),
        password: form.get("password"),
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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

      <main
        className="
    relative
    flex
    min-h-screen
    items-center
    justify-center
    overflow-hidden
    px-6
    py-10
    bg-[linear-gradient(to_bottom_right,#6D28D9,#8B5CF6,#D946EF)]
  "
      >
        <div
          className="
    pointer-events-none
    absolute
    left-1/2
    top-1/2
    h-[700px]
    w-[700px]
    -translate-x-1/2
    -translate-y-1/2
    rounded-full
    bg-white/10
    blur-3xl
"
        />
        <Card
          className="
        relative
        w-full
        max-w-md
        overflow-hidden
        rounded-3xl
        border
        border-white/40
        bg-white
        p-10
        shadow-2xl
    "
        >
          <div className="mb-10 text-center">
            <div
              className="
    mx-auto
    mb-6
    flex
    h-20
    w-20
    items-center
    justify-center
    rounded-2xl
    bg-violet-100
    shadow-sm
"
            >
              <Image
                src="/logo.png"
                alt="Clube de Robótica"
                width={120}
                height={120}
                priority
              />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Clube de{" "}
              <span className="text-violet-700">
                Robótica
              </span>
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Faça login para acessar o sistema.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Input
              name="name"
              label="Usuário"
              placeholder="Digite seu usuário"
              autoComplete="username"
              required
            />

            <PasswordInput
              name="password"
              label="Senha"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
            >
              Entrar
            </Button>
          </form>
        </Card>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps =
  async (ctx) => {

    const authenticated = await checkAuth(ctx);


    if (authenticated) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }


    return {
      props: {},
    };
  };