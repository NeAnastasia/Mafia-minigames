"use client";
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../../styles/HueGame.module.css";
import Link from 'next/link'


export default function HueGame() {
  const [tiles, setTiles] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [selectedTile, setSelectedTile] = useState(null);
  const [solution, setSolution] = useState([]);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    startNewGame();
    return () => clearInterval(timerRef.current);
  }, []);

  function startNewGame() {
    clearInterval(timerRef.current);
    setTime(0);
    setIsRunning(true);

    const baseColor = getRandomColor();
    const colorMatrix = generateColorMatrix(baseColor);

    const newTilesMatrix = colorMatrix.map((row, rowIndex) => {
      return row.map((color, colIndex) => {
        return {
          id: rowIndex * 4 + colIndex,
          color: color,
          isAnchor: (rowIndex + colIndex) % 3 === 0,
          row: rowIndex,
          col: colIndex,
          originalRow: rowIndex,
          originalCol: colIndex,
        };
      });
    });

    setSolution(newTilesMatrix);
    let flatTiles = newTilesMatrix.flat();

    const movableTiles = flatTiles.filter((t) => !t.isAnchor);
    const shuffledTiles = [...movableTiles].sort(() => Math.random() - 0.5);

    let shuffleIndex = 0;
    const finalTiles = newTilesMatrix.map((row) => {
      return row.map((tile) => {
        return tile.isAnchor
          ? tile
          : Object.assign({}, shuffledTiles[shuffleIndex++], {
              row: tile.row,
              col: tile.col,
            });
      });
    });

    setTiles(finalTiles);
    setIsComplete(false);
    setMoves(0);
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  }

  function handleTileClick(clickedTile) {
    if (clickedTile.isAnchor || isComplete) return;

    if (!selectedTile) {
      setSelectedTile(clickedTile);
      return;
    }

    if (selectedTile.id === clickedTile.id) {
      setSelectedTile(null);
      return;
    }

    setTiles((prevTiles) => {
      const newTiles = prevTiles.map((row) => [...row]);
      const { row: row1, col: col1 } = selectedTile;
      const { row: row2, col: col2 } = clickedTile;

      newTiles[row1][col1] = { ...clickedTile, row: row1, col: col1 };
      newTiles[row2][col2] = { ...selectedTile, row: row2, col: col2 };

      checkCompletion(newTiles);
      return newTiles;
    });

    setMoves((prev) => prev + 1);
    setSelectedTile(null);
  }

  function checkCompletion(currentTiles) {
    if (!solution.length) return false;

    const isComplete = currentTiles.every((row, rowIndex) =>
      row.every((tile, colIndex) => {
        if (tile.isAnchor) return true;
        const correctTile = solution[rowIndex][colIndex];
        return tile.id === correctTile.id;
      })
    );

    if (isComplete) {
      setIsRunning(false);
      clearInterval(timerRef.current);
    }
    setIsComplete(isComplete);
    return isComplete;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className={`container ${styles.gameContainer}`}>
      <div className="container">
        <Link href="/" className="btn btn-outline-secondary mb-0">
          ← На главную
        </Link>
      </div>
      <h1 className="text-center my-4">I Love Hue</h1>

      <div className="d-flex justify-content-center gap-4 mb-4">
        <div className="fs-5">Moves: {moves}</div>
        <div className="fs-5">Time: {formatTime(time)}</div>
      </div>

      {isComplete ? (
        <div className={`alert alert-success ${styles.completionAlert}`}>
          <h4>
            Perfect Harmony! Completed in {moves} moves and {formatTime(time)}!
          </h4>
        </div>
      ) : (
        <div className={styles.gameBoard}>
          {tiles.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {row.map((tile, colIndex) => (
                <div
                  key={tile.id}
                  className={[
                    styles.tile,
                    tile.isAnchor ? styles.anchor : "",
                    selectedTile?.id === tile.id ? styles.selected : "",
                  ].join(" ")}
                  style={{ backgroundColor: tile.color }}
                  onClick={() => handleTileClick(tile)}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

function generateColorMatrix(baseColor) {
  const hslMatch = baseColor.match(/\d+/g);
  if (!hslMatch || hslMatch.length < 3) {
    throw new Error("Invalid base color format. Expected hsl(H, S%, L%)");
  }

  const baseHue = parseInt(hslMatch[0]);
  const baseSat = parseInt(hslMatch[1]);
  const baseLight = parseInt(hslMatch[2]);

  const matrix = Array(4);
  for (let i = 0; i < 4; i++) {
    matrix[i] = Array(4);
  }

  const hueStep = 19; // Больший шаг оттенка
  const satStep = 9; // Изменения насыщенности
  const lightStepRow = 7; // Шаг светлоты по вертикали
  const lightStepCol = 10; // Шаг светлоты по горизонтали

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const newHue = (baseHue + hueStep * (row + col)) % 360;
      const newSat = clamp(baseSat + satStep * (row - col), 50, 90);
      const newLight = clamp(
        baseLight + lightStepRow * row + lightStepCol * col,
        30,
        85
      );

      matrix[row][col] = `hsl(${newHue}, ${newSat}%, ${newLight}%)`;
    }
  }

  return matrix;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getRandomColor() {
  return "hsl(" + Math.floor(Math.random() * 360) + ", 80%, 60%)";
}
