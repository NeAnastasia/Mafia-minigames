import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../styles/SudokuGame.module.css";
import Link from "next/link";

const SudokuGame = () => {
  //(0 - пустая клетка)
  const initialBoards = [
    [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ],
    [
      [0, 2, 0, 6, 0, 8, 0, 0, 0],
      [5, 8, 0, 0, 0, 9, 7, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0, 0],
      [3, 7, 0, 0, 0, 0, 5, 0, 0],
      [6, 0, 0, 0, 0, 0, 0, 0, 4],
      [0, 0, 8, 0, 0, 0, 0, 1, 3],
      [0, 0, 0, 0, 2, 0, 0, 0, 0],
      [0, 0, 9, 8, 0, 0, 0, 3, 6],
      [0, 0, 0, 3, 0, 6, 0, 9, 0],
    ],
  ];

  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Инициализация игры
  useEffect(() => {
    startNewGame();
    return () => clearInterval(timerRef.current);
  }, []);

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

  const startNewGame = () => {
    const randomIndex = Math.floor(Math.random() * initialBoards.length);
    const newBoard = initialBoards[randomIndex].map((row) => [...row]);
    setBoard(newBoard);
    setInitialBoard(newBoard.map((row) => [...row]));
    setSelectedCell(null);
    setIsSolved(false);
    startTimer();
  };

  // Выбор клетки
  const handleCellClick = (row, col) => {
    if (initialBoard[row][col] !== 0) return; // Нельзя изменять начальные цифры
    setSelectedCell({ row, col });
  };

  // Ввод цифры
  const handleNumberInput = (num) => {
    if (!selectedCell || isSolved) return;

    const { row, col } = selectedCell;
    const newBoard = [...board];
    newBoard[row][col] = num;
    setBoard(newBoard);

    checkSolution(newBoard);
  };

  // Проверка валидности размещения цифры
  const isValidPlacement = (board, row, col, num) => {
    // Проверка строки
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num && x !== col) return false;
    }

    // Проверка столбца
    for (let y = 0; y < 9; y++) {
      if (board[y][col] === num && y !== row) return false;
    }

    // Проверка квадрата 3x3
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let y = boxRow; y < boxRow + 3; y++) {
      for (let x = boxCol; x < boxCol + 3; x++) {
        if (board[y][x] === num && y !== row && x !== col) return false;
      }
    }

    return true;
  };

  const checkSolution = (currentBoard) => {
    const solved =
      currentBoard.every((row) => row.every((cell) => cell !== 0)) &&
      currentBoard.every((row, rowIndex) =>
        row.every((cell, colIndex) =>
          isValidPlacement(currentBoard, rowIndex, colIndex, cell)
        )
      );

    if (solved) {
      stopTimer();
    }
    setIsSolved(solved);
    return solved;
  };

  // Очистка клетки
  const handleClearCell = () => {
    if (!selectedCell || isSolved) return;

    const { row, col } = selectedCell;
    const newBoard = [...board];
    newBoard[row][col] = 0;
    setBoard(newBoard);
  };

  const handleClearAll = () => {
    if (isSolved) return;

    const newBoard = board.map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        initialBoard[rowIndex][colIndex] !== 0 ? cell : 0
      )
    );

    setBoard(newBoard);
    setSelectedCell(null);
  };

  return (
    <div className="container mt-5">
      <div className="container">
        <Link href="/" className="btn btn-outline-secondary mb-0">
          ← На главную
        </Link>
      </div>
      <h1 className="text-center mb-4">Судоку</h1>

      <div className="d-flex justify-content-center gap-4 mb-3">
        <div className="fs-5">Время: {formatTime(time)}</div>
      </div>

      {isSolved && (
        <div className="alert alert-success text-center">
          <h4>Поздравляем! Вы решили судоку за {formatTime(time)}!</h4>
          <button onClick={startNewGame} className="btn btn-primary mt-2">
            Новая игра
          </button>
        </div>
      )}

      <div className={styles.sudokuContainer}>
        <div className={styles.board}>
          {board.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className={styles.row}>
              {row.map((cell, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`${styles.cell} ${
                    initialBoard[rowIndex][colIndex] !== 0 ? styles.fixed : ""
                  } ${
                    selectedCell?.row === rowIndex &&
                    selectedCell?.col === colIndex
                      ? styles.selected
                      : ""
                  } ${
                    (Math.floor(rowIndex / 3) + Math.floor(colIndex / 3)) %
                      2 ===
                    0
                      ? styles.lightBox
                      : styles.darkBox
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== 0 ? cell : ""}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.controls}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={`num-${num}`}
              className={`${styles.numberBtn} btn btn-outline-secondary`}
              onClick={() => handleNumberInput(num)}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="d-flex gap-2">
          <button
            className={`${styles.clearBtn} btn btn-outline-danger`}
            onClick={handleClearCell}
          >
            Очистить
          </button>
          <button
            className={`${styles.clearBtn} btn btn-outline-danger`}
            onClick={handleClearAll}
          >
            Очистить всё
          </button>
        </div>
      </div>
    </div>
  );
};

export default SudokuGame;
