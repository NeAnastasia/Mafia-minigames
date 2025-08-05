"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "../../styles/FlowFreeGame.module.css";

const FlowFreeGame = () => {
  const size = 9;
  const dots = [
    { color: "red", x: 8, y: 1 },
    { color: "red", x: 8, y: 8 },
    { color: "blue", x: 4, y: 0 },
    { color: "blue", x: 3, y: 1 },
    { color: "green", x: 1, y: 1 },
    { color: "green", x: 1, y: 6 },
    { color: "yellow", x: 6, y: 1 },
    { color: "yellow", x: 2, y: 6 },
    { color: "purple", x: 7, y: 1 },
    { color: "purple", x: 1, y: 7 },
    { color: "orange", x: 8, y: 2 },
    { color: "orange", x: 7, y: 4 },
    { color: "darkblue", x: 4, y: 5 },
    { color: "darkblue", x: 8, y: 6 },
    { color: "pink", x: 4, y: 6 },
    { color: "pink", x: 7, y: 6 },
    { color: "lime", x: 4, y: 7 },
    { color: "lime", x: 8, y: 7 },
  ];

  const [board, setBoard] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [completedColors, setCompletedColors] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };
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

  useEffect(() => {
    startGame();
    return () => clearInterval(timerRef.current);
  }, []);

  const startGame = () => {
    const newBoard = Array(size)
      .fill()
      .map(() => Array(size).fill(null));

    dots.forEach((dot) => {
      newBoard[dot.y][dot.x] = {
        ...dot,
        isDot: true,
        isCompleted: false,
      };
    });

    setBoard(newBoard);
    setCurrentPath([]);
    setSelectedColor(null);
    setCompletedColors([]);
    setIsComplete(false);
    startTimer();
  };
  // Обработка клика
  const handleCellClick = (row, col) => {
    if (isComplete) return;

    const cell = board[row][col];

    if (cell?.isDot) {
      if (cell.isCompleted) {
        clearColorPath(cell.color);
        return;
      }
      if (selectedColor === cell.color) {
        const isStartOfCurrentPath =
          currentPath.length > 0 &&
          currentPath[0].x === col &&
          currentPath[0].y === row;

        if (isStartOfCurrentPath) {
          clearColorPath(cell.color);
          return;
        }

        if (canCompletePath(row, col)) {
          completePath();
          return;
        } else {
          clearColorPath(cell.color);
          setSelectedColor(cell.color);
          setCurrentPath([{ x: col, y: row }]);
          return;
        }
      }

      clearColorPath(cell.color);
      setSelectedColor(cell.color);
      setCurrentPath([{ x: col, y: row }]);
      return;
    }

    if (!selectedColor) return;

    if (isValidMove(row, col)) {
      addToPath(row, col);
    }
  };

  // Проверка возможности завершить путь
  const canCompletePath = (row, col) => {
    if (currentPath.length < 1) return false;

    const lastPoint = currentPath[currentPath.length - 1];
    const dx = Math.abs(col - lastPoint.x);
    const dy = Math.abs(row - lastPoint.y);

    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  };

  // Добавление точки в путь с удалением пересечённых путей
  const addToPath = (row, col) => {
    let newBoard = [...board];
    const newPath = [...currentPath, { x: col, y: row }];
    const cell = board[row][col];

    if (cell && cell.color !== selectedColor) {
      newBoard = clearColorPathOnBoard(cell.color, newBoard);
    }

    newBoard[row][col] = {
      color: selectedColor,
      isDot: false,
      isCompleted: false,
    };

    setBoard(newBoard);
    setCurrentPath(newPath);
  };

  const completePath = () => {
    const newBoard = [...board];
    const color = selectedColor;

    dots
      .filter((dot) => dot.color === color)
      .forEach((dot) => {
        if (newBoard[dot.y][dot.x]) {
          newBoard[dot.y][dot.x].isCompleted = true;
        }
      });

    setBoard(newBoard);
    setCompletedColors([...completedColors, color]);
    setSelectedColor(null);
    setCurrentPath([]);

    // Проверяем завершение игры
    if (completedColors.length + 1 === new Set(dots.map((d) => d.color)).size) {
      setIsComplete(true);
      stopTimer();
    }
  };

  // Очистка пути для указанного цвета
  const clearColorPath = (color) => {
    const newBoard = clearColorPathOnBoard(color, board);
    setBoard(newBoard);
    setCompletedColors(completedColors.filter((c) => c !== color));
    if (selectedColor === color) {
      setSelectedColor(null);
      setCurrentPath([]);
    }
  };

  // Очистка пути на конкретной доске (без обновления состояния)
  const clearColorPathOnBoard = (color, boardToUpdate) => {
    const newBoard = boardToUpdate.map((row) =>
      row.map((cell) => {
        if (cell?.color === color && !cell.isDot) {
          return null;
        }
        if (cell?.isDot && cell.color === color && cell.isCompleted) {
          return { ...cell, isCompleted: false };
        }
        return cell;
      })
    );

    return newBoard;
  };

  // Проверка валидности хода (только в соседние клетки)
  const isValidMove = (row, col) => {
    if (currentPath.length === 0) return false;

    const lastPoint = currentPath[currentPath.length - 1];
    const dx = Math.abs(col - lastPoint.x);
    const dy = Math.abs(row - lastPoint.y);

    const isNeighbor = (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    if (!isNeighbor) return false;

    const cell = board[row][col];
    return (
      cell === null || (cell && !cell.isDot && cell.color !== selectedColor)
    );
  };

  return (
    <div className="container mt-5">
      <div className="mb-3">
        <Link href="/" className="btn btn-outline-secondary me-2">
          ← На главную
        </Link>
      </div>

      <h1 className="text-center mb-1">Flow Free</h1>

      <div className="d-flex justify-content-center gap-4 mb-3">
        <div className="fs-5">Время: {formatTime(time)}</div>
      </div>

      {isComplete && (
        <div className="alert alert-success text-center">
          <h4>Поздравляем! Вы решили головоломку за {formatTime(time)}!</h4>
          <button onClick={startGame} className="btn btn-primary mt-2">
            Играть снова
          </button>
        </div>
      )}

      <div className={styles.gameContainer}>
        <div
          className={styles.board}
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`${styles.cell} ${cell ? styles[cell.color] : ""} ${
                  cell?.isDot ? styles.dot : ""
                } ${cell?.isCompleted ? styles.completed : ""}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell?.isDot && (
                  <>
                    <div
                      className={styles.dotInner}
                      style={{ backgroundColor: cell.color }}
                    />
                    {cell.isCompleted && (
                      <div className={styles.checkmark}>✓</div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowFreeGame;
