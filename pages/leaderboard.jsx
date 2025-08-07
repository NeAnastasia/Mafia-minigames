import Head from "next/head";
import Header from "./components/Header";
import GameResults from "./components/GameResults";

export default function leaderboard() {
  return (
    <>
      <Header />
      <Head>
        <title>Login | Game</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <GameResults />
      </div>
    </>
  );
}
