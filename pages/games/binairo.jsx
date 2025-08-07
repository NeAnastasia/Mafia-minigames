"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "../../styles/BinairoGame.module.css";

const BinairoGame = () => {
  const size = 6;
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [errors, setErrors] = useState([]);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const [hint, setHint] = useState("");
  const [hoveredValue, setHoveredValue] = useState(null);

  // Форматирование времени в MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Запуск/остановка таймера
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

  // Инициализация игры
  useEffect(() => {
    startGame();
    return () => clearInterval(timerRef.current);
  }, []);

  // Примеры уровней
  const levels = [
    {
      board: [
        [null, 1, 0, null, null, null],
        [null, null, 1, 0, null, null],
        [1, null, null, null, null, 0],
        [0, null, null, null, null, 1],
        [null, null, 0, 1, null, null],
        [null, null, 1, 0, null, null],
      ],
      hint: "Начните с заполнения строк, где почти все ячейки заполнены",
    },
    {
      board: [
        [0, null, 1, null, null, 0],
        [null, 1, null, null, 0, null],
        [null, null, 0, 1, null, null],
        [null, null, 1, 0, null, null],
        [null, 0, null, null, 1, null],
        [1, null, null, null, null, 1],
      ],
      hint: "Обратите внимание на столбцы с несколькими одинаковыми значениями",
    },
    {
      board: [
        [1, null, null, 0, null, null],
        [null, 0, null, null, 1, null],
        [null, null, 1, null, null, 0],
        [0, null, null, 1, null, null],
        [null, 1, null, null, 0, null],
        [null, null, 0, null, null, 1],
      ],
      hint: "Ищите строки и столбцы, которые почти завершены",
    },
  ];

  const startGame = () => {
    const randomIndex = Math.floor(Math.random() * levels.length);
    const level = levels[randomIndex];

    const newBoard = level.board.map((row) =>
      row.map((cell) => ({
        value: cell,
        fixed: cell !== null,
        error: false,
      }))
    );

    setBoard(newBoard);
    setInitialBoard(JSON.parse(JSON.stringify(newBoard)));
    setSelectedCell(null);
    setIsSolved(false);
    setErrors([]);
    setHint(level.hint);
    startTimer();
  };

  // Обработка клика по клетке
  const handleCellClick = (row, col) => {
    if (isSolved || board[row][col].fixed) return;

    setSelectedCell({ row, col });
  };

  // Установка значения в клетку
  const setCellValue = (value) => {
    if (!selectedCell || isSolved) return;

    const { row, col } = selectedCell;
    const newBoard = [...board];
    newBoard[row][col] = { ...newBoard[row][col], value };
    setBoard(newBoard);

    // Проверяем решение после установки значения
    const solved = checkSolution(newBoard);
    if (solved) {
      stopTimer();
      setIsSolved(true);
    } else {
      // Проверяем ошибки
      const newErrors = findErrors(newBoard);
      setErrors(newErrors);
    }
  };

  // Проверка строки на соответствие правилам
  const checkRow = (row) => {
    const values = row.map((cell) => cell.value);
    const size = values.length;

    // Проверка на три одинаковых подряд
    for (let i = 0; i < size - 2; i++) {
      if (
        values[i] !== null &&
        values[i] === values[i + 1] &&
        values[i] === values[i + 2]
      ) {
        return false;
      }
    }

    // Проверка количества 0 и 1 (должно быть ровно по 3)
    const count0 = values.filter((v) => v === 0).length;
    const count1 = values.filter((v) => v === 1).length;

    // Если строка полностью заполнена
    if (count0 + count1 === size) {
      if (count0 !== 3 || count1 !== 3) return false;
    } else {
      // Если есть пустые ячейки
      if (count0 > 3 || count1 > 3) return false;
    }

    return true;
  };

  // Проверка столбца на соответствие правилам
  const checkColumn = (col, board) => {
    const values = [];
    for (let i = 0; i < size; i++) {
      values.push(board[i][col].value);
    }

    // Проверка на три одинаковых подряд
    for (let i = 0; i < size - 2; i++) {
      if (
        values[i] !== null &&
        values[i] === values[i + 1] &&
        values[i] === values[i + 2]
      ) {
        return false;
      }
    }

    // Проверка количества 0 и 1 (должно быть ровно по 3)
    const count0 = values.filter((v) => v === 0).length;
    const count1 = values.filter((v) => v === 1).length;

    // Если столбец полностью заполнен
    if (count0 + count1 === size) {
      if (count0 !== 3 || count1 !== 3) return false;
    } else {
      // Если есть пустые ячейки
      if (count0 > 3 || count1 > 3) return false;
    }

    return true;
  };

  // Проверка уникальности строк
  const checkUniqueRows = (board) => {
    const filledRows = board
      .filter((row) => row.every((cell) => cell.value !== null))
      .map((row) => row.map((cell) => cell.value).join(""));

    const uniqueRows = new Set(filledRows);
    return uniqueRows.size === filledRows.length;
  };

  // Проверка уникальности столбцов
  const checkUniqueColumns = (board) => {
    const columns = [];
    for (let col = 0; col < size; col++) {
      const column = [];
      for (let row = 0; row < size; row++) {
        column.push(board[row][col].value);
      }
      // Проверяем только заполненные столбцы
      if (column.every((v) => v !== null)) {
        columns.push(column.join(""));
      }
    }

    const uniqueColumns = new Set(columns);
    return uniqueColumns.size === columns.length;
  };

  // Поиск ошибок на доске
  const findErrors = (board) => {
    const errorCells = [];

    // Проверка строк
    for (let row = 0; row < size; row++) {
      if (!checkRow(board[row])) {
        for (let col = 0; col < size; col++) {
          errorCells.push({ row, col });
        }
      }
    }

    // Проверка столбцов
    for (let col = 0; col < size; col++) {
      if (!checkColumn(col, board)) {
        for (let row = 0; row < size; row++) {
          errorCells.push({ row, col });
        }
      }
    }

    return errorCells;
  };

  // Проверка решения
  const checkSolution = (board) => {
    // Проверяем, все ли клетки заполнены
    const allFilled = board.every((row) =>
      row.every((cell) => cell.value !== null)
    );

    if (!allFilled) return false;

    // Проверяем строки
    for (let row = 0; row < size; row++) {
      if (!checkRow(board[row])) {
        return false;
      }
    }

    // Проверяем столбцы
    for (let col = 0; col < size; col++) {
      if (!checkColumn(col, board)) {
        return false;
      }
    }

    // Проверяем уникальность строк
    if (!checkUniqueRows(board)) {
      return false;
    }

    // Проверяем уникальность столбцов
    if (!checkUniqueColumns(board)) {
      return false;
    }

    return true;
  };

  // Очистка клетки
  const handleClearCell = () => {
    if (!selectedCell || isSolved) return;

    const { row, col } = selectedCell;
    const newBoard = [...board];
    newBoard[row][col] = { ...newBoard[row][col], value: null };
    setBoard(newBoard);
    setErrors(errors.filter((e) => !(e.row === row && e.col === col)));
  };

  return (
    <div className="container mt-5">
      <div className="mb-3">
        <Link href="/" className="btn btn-outline-secondary me-2">
          ← На главную
        </Link>
      </div>

      <h1 className="text-center mb-1">Binairo</h1>

      <div className="d-flex justify-content-center gap-4 mb-3">
        <div className="fs-5">Время: {formatTime(time)}</div>
      </div>

      {isSolved && (
        <div className="alert alert-success text-center">
          <h4>Поздравляем! Вы решили головоломку за {formatTime(time)}!</h4>
          <button onClick={startGame} className="btn btn-primary mt-2">
            Играть снова
          </button>
        </div>
      )}

      <div className={styles.gameContainer}>
        <div className={styles.board}>
          {board.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className={styles.row}>
              {row.map((cell, colIndex) => {
                const isError = errors.some(
                  (e) => e.row === rowIndex && e.col === colIndex
                );
                const isSelected =
                  selectedCell?.row === rowIndex &&
                  selectedCell?.col === colIndex;

                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`${styles.cell} ${
                      cell.fixed ? styles.fixed : ""
                    } ${isSelected ? styles.selected : ""} ${
                      isError ? styles.error : ""
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell.value === 0 && (
                      <div className={styles.whiteCircle}></div>
                    )}
                    {cell.value === 1 && (
                      <div className={styles.blackCircle}></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className={styles.controls}>
          <button
            className={`btn btn-lg ${styles.controlBtn} ${styles.zeroBtn}`}
            onClick={() => setCellValue(0)}
            onMouseEnter={() => setHoveredValue(0)}
            onMouseLeave={() => setHoveredValue(null)}
          >
            <div className={styles.whiteCircle}></div>
          </button>
          <button
            className={`btn btn-lg ${styles.controlBtn} ${styles.oneBtn}`}
            onClick={() => setCellValue(1)}
            onMouseEnter={() => setHoveredValue(1)}
            onMouseLeave={() => setHoveredValue(null)}
          >
            <div className={styles.blackCircle}></div>
          </button>
          <button
            className={`btn btn-lg ${styles.controlBtn} ${styles.clearBtn}`}
            onClick={handleClearCell}
          >
            Очистить
          </button>
        </div>
      </div>
    </div>
  );
};

export default BinairoGame;
