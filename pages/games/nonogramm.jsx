"use client";
import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../../styles/NonogramGame.module.css";
import Link from "next/link";
import Cookies from "js-cookie";
import { getBaseUrl } from "@/utils/api";

const NonogramGame = () => {
  const GAME_NUMBER = 1;
  // (1 - закрашенная клетка, 0 - пустая)
  const puzzles = [
    // Сердечко
    [
      [0, 1, 1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
    ],
    // Круг
    [
      [0, 0, 1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 0, 0],
    ],
    // Домик
    [
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
  ];

  const [puzzle, setPuzzle] = useState([]);
  const [grid, setGrid] = useState([]);
  const [rowHints, setRowHints] = useState([]);
  const [colHints, setColHints] = useState([]);
  const [isSolved, setIsSolved] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameUserId, setGameUserId] = useState(null);
  const timerRef = useRef(null);

  // Получение game_id через API
  useEffect(() => {
    const fetchGameUserId = async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/api/userInfo/get-game-id`, {
          credentials: 'include' // Важно для отправки кук
        });

        if (!response.ok) throw new Error('Failed to fetch game ID');
        
        const { gameId } = await response.json();
        setGameUserId(gameId);
      } catch (error) {
        console.error("Error fetching game user ID:", error);
      }
    };

    fetchGameUserId();
  }, []);

  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Сохранение результата игры
  const saveGameResult = async () => {
    if (!gameUserId) {
      console.error("Game user ID not available");
      return;
    }

    try {
      const response = await fetch(`${getBaseUrl()}/api/games/save-result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: gameUserId,
          gameNumber: GAME_NUMBER,
          timeInSeconds: time,
        }),
      });

      if (!response.ok) throw new Error("Save failed");
      console.log("Game result saved successfully!");
    } catch (error) {
      console.error("Error saving game result:", error);
    }
  };

  // Инициализация игры со случайной нонограммой
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * puzzles.length);
    setPuzzle(puzzles[randomIndex]);
    startTimer();

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (puzzle.length > 0) {
      initializeGame();
    }
  }, [puzzle]);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTime(0);
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
  };

  // При завершении игры сохраняем результат
  useEffect(() => {
    if (isSolved && gameUserId) {
      saveGameResult();
    }
  }, [isSolved, gameUserId]);

  const initializeGame = () => {
    const newGrid = Array(puzzle.length)
      .fill()
      .map(() => Array(puzzle[0].length).fill(0));

    setRowHints(puzzle.map((row) => generateHints(row)));
    setColHints(
      Array(puzzle[0].length)
        .fill()
        .map((_, colIndex) => generateHints(puzzle.map((row) => row[colIndex])))
    );
    setGrid(newGrid);
    setIsSolved(false);
    startTimer();
  };

  // Генерация подсказок
  const generateHints = (line) => {
    const hints = [];
    let count = 0;

    for (const cell of line) {
      if (cell === 1) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }

    if (count > 0) hints.push(count);
    return hints.length ? hints : [0];
  };

  // Клик по клетке
  const handleCellClick = (row, col) => {
    if (isSolved) return;

    const newGrid = [...grid];
    newGrid[row][col] = (newGrid[row][col] + 1) % 3;
    setGrid(newGrid);
    checkSolution(newGrid);
  };

  // Проверка решения
  const checkSolution = (currentGrid) => {
    const solved = currentGrid.every((row, rowIndex) =>
      row.every(
        (cell, colIndex) =>
          (cell === 1 && puzzle[rowIndex][colIndex] === 1) ||
          (cell !== 1 && puzzle[rowIndex][colIndex] === 0)
      )
    );

    if (solved) {
      stopTimer();
      setIsSolved(true);
    }
  };

  return (
    <div className="container mt-5">
      <div className="container">
        <Link href="/" className="btn btn-outline-secondary mb-0">
          ← На главную
        </Link>
      </div>
      <h1 className="text-center mb-4">Нонограммы</h1>

      <div className="d-flex justify-content-center gap-4 mb-4">
        <div className="fs-5">Время: {formatTime(time)}</div>
        {isSolved && <div className="fs-5 text-success">Решено!</div>}
      </div>

      {isSolved && (
        <div className="alert alert-success text-center">
          Поздравляем! Вы решили нонограмму за {formatTime(time)}!
          {!gameUserId && (
            <p className="text-warning mt-2">
              Результат не сохранён: не найден игровой профиль
            </p>
          )}
        </div>
      )}

      <div className="d-flex justify-content-center">
        <div className={styles.nonogramContainer}>
          <div className={styles.colHints}>
            {colHints.map((hints, colIndex) => (
              <div key={`col-${colIndex}`} className={styles.hintCell}>
                {hints.join("\n")}
              </div>
            ))}
          </div>

          <div className="d-flex">
            <div className={styles.rowHints}>
              {rowHints.map((hints, rowIndex) => (
                <div key={`row-${rowIndex}`} className={styles.hintCell}>
                  {hints.join(" ")}
                </div>
              ))}
            </div>

            <div className={styles.grid}>
              {grid.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className={styles.gridRow}>
                  {row.map((cell, colIndex) => (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      className={`${styles.gridCell} ${
                        cell === 1
                          ? styles.filled
                          : cell === 2
                          ? styles.crossed
                          : ""
                      }`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonogramGame;
