import LoginForm from "./components/Auth";
import Head from "next/head";
import Header from "./components/Header";

export default function LoginPage() {
  return (
    <>
      <Header />
      <Head>
        <title>Login | Game</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoginForm />
      </div>
    </>
  );
}
