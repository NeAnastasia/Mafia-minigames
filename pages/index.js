import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import HueGame from "./games/hue";
import NonogramGame from "./games/nonogramm";
import SudokuGame from "./games/sudoku";
import Header from "./components/Header";

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
    <>
      <div className={styles.background_ours}>
        <div className="min-h-screen flex items-center justify-center">
          <Header />
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
              <Link href="/games/binairo" className={styles.gameCard}>
                <h2>Binairo</h2>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

{
  /* ONE TAP 
  <div>
  <script src="https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js"></script>
  <script type="text/javascript">
    if ('VKIDSDK' in window) {
      const VKID = window.VKIDSDK;

      VKID.Config.init({
        app: 54012193,
        redirectUrl: 'https://mafia-minigames-sdm.netlify.app/api/auth/callback',
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
        scope: '', // Заполните нужными доступами по необходимости
      });

      const oneTap = new VKID.OneTap();

      oneTap.render({
        container: document.currentScript.parentElement,
        showAlternativeLogin: true
      })
      .on(VKID.WidgetEvents.ERROR, vkidOnError)
      .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, function (payload) {
        const code = payload.code;
        const deviceId = payload.device_id;

        VKID.Auth.exchangeCode(code, deviceId)
          .then(vkidOnSuccess)
          .catch(vkidOnError);
      });
    
      function vkidOnSuccess(data) {
        // Обработка полученного результата
      }
    
      function vkidOnError(error) {
        // Обработка ошибки
      }
    }
  </script>
</div> */
}

// ШТОРКА АВТОРИЗАЦИИ
// <div>
//   <script src="https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js"></script>
//   <script type="text/javascript">
//     if ('VKIDSDK' in window) {
//       const VKID = window.VKIDSDK;

//       VKID.Config.init({
//         app: 54012193,
//         redirectUrl: 'https://mafia-minigames-sdm.netlify.app/api/auth/callback',
//         responseMode: VKID.ConfigResponseMode.Callback,
//         source: VKID.ConfigSource.LOWCODE,
//         scope: '', // Заполните нужными доступами по необходимости
//       });

//       const floatingOneTap = new VKID.FloatingOneTap();

//       floatingOneTap.render({
//         appName: 'SDM Self-Management Day',
//         showAlternativeLogin: true
//       })
//       .on(VKID.WidgetEvents.ERROR, vkidOnError)
//       .on(VKID.FloatingOneTapInternalEvents.LOGIN_SUCCESS, function (payload) {
//         const code = payload.code;
//         const deviceId = payload.device_id;

//         VKID.Auth.exchangeCode(code, deviceId)
//           .then(vkidOnSuccess)
//           .catch(vkidOnError);
//       });

//       function vkidOnSuccess(data) {
//         floatingOneTap.close();

//         // Обработка полученного результата
//       }

//       function vkidOnError(error) {
//         // Обработка ошибки
//       }
//     }
//   </script>
// </div>

// 3 в 1
// <div>
//   <script src="https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js"></script>
//   <script type="text/javascript">
//     if ('VKIDSDK' in window) {
//       const VKID = window.VKIDSDK;

//       VKID.Config.init({
//         app: 54012193,
//         redirectUrl: 'https://mafia-minigames-sdm.netlify.app/api/auth/callback',
//         responseMode: VKID.ConfigResponseMode.Callback,
//         source: VKID.ConfigSource.LOWCODE,
//         scope: '', // Заполните нужными доступами по необходимости
//       });

//       const oAuth = new VKID.OAuthList();

//       oAuth.render({
//         container: document.currentScript.parentElement,
//         oauthList: [
//           'vkid'
//         ]
//       })
//       .on(VKID.WidgetEvents.ERROR, vkidOnError)
//       .on(VKID.OAuthListInternalEvents.LOGIN_SUCCESS, function (payload) {
//         const code = payload.code;
//         const deviceId = payload.device_id;

//         VKID.Auth.exchangeCode(code, deviceId)
//           .then(vkidOnSuccess)
//           .catch(vkidOnError);
//       });

//       function vkidOnSuccess(data) {
//         // Обработка полученного результата
//       }

//       function vkidOnError(error) {
//         // Обработка ошибки
//       }
//     }
//   </script>
// </div>
