import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/Header.module.css";
import { getBaseUrl } from "@/utils/api";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Проверка статуса авторизации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/api/auth/session`);
        const data = await response.json();
        if (data && !data.error) {
          setIsLoggedIn(true);
          setUserData(data);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch(`${getBaseUrl()}/api/auth/logout`);
    window.location.href = "/login";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-light navbar-dark">
      <nav className="navbar navbar-expand-lg container">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <div className={`${styles.logotip} rounded-circle p-1 me-2`}></div>
          <span className="fw-bold">Part 0.01: Mini-games</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse ps-3 navbar-collapse ${
            isMenuOpen ? "show" : ""
          }`}
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link ${
                  router.pathname === "/" ? "active" : ""
                }`}
              >
                Главная
              </Link>
            </li>
            {isLoggedIn && userData?.is_admin && (
              <>
                <li className="nav-item">
                  <Link
                    href="/leaderboard"
                    className={`nav-link ${
                      router.pathname === "/leaderboard" ? "active" : ""
                    }`}
                  >
                    Рейтинг
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center">
            {isLoggedIn ? (
              <>
                <span className="d-none d-sm-inline me-3">
                  {userData?.nickname || userData?.game_id || "Аккаунт"}
                </span>
                <button onClick={handleLogout} className="btn btn-dark">
                  Выйти
                </button>
              </>
            ) : (
              <Link href="/login" className="btn btn-dark">
                <span className="d-none d-sm-inline">Войти</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
