import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import HueGame from "./games/hue";
import NonogramGame from "./games/nonogramm";
import SudokuGame from "./games/sudoku";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мини-Игры</h1>
      <div className={styles.gameGrid}>
        <Link href="/games/hue" className={styles.gameCard}>
          <h2>I Love Hue</h2>
        </Link>
        <Link href="/games/nonogramm" className={styles.gameCard}>
          <h2>Нонограммы</h2>
        </Link>
        <Link href="/games/sudoku" className={styles.gameCard}>
          <h2>Судоку</h2>
        </Link>
        <Link href="/games/flowfree" className={styles.gameCard}>
          <h2>Flow free</h2>
        </Link>
      </div>
    </div>
  );
}
