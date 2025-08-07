import { supabase } from "@/DB/supabase";
import { useEffect, useState } from "react";
import {
  intervalToMilliseconds,
  formatGameTime,
} from "../../utils/timeUtils.js";

export default function Leaderboard({ currentGameId }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPlayers, setTotalPlayers] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        
        // Получаем топ-10 игроков
        const { data: leaderboardData, error: leaderboardError } = await supabase
          .from('game_results')
          .select(`
            game_id,
            nickname,
            game1_time,
            game2_time,
            game3_time,
            game4_time,
            game5_time,
            total_time
          `)
          .order('total_time', { ascending: true })

        if (leaderboardError) throw leaderboardError;
        
        // Получаем общее количество игроков
        const { count, error: countError } = await supabase
          .from('game_results')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw countError;
        setTotalPlayers(count || 0);
        
        // Преобразуем данные для отображения
        const processedData = (leaderboardData || []).map(result => ({
          ...result,
          completedGames: [
            result.game1_time,
            result.game2_time,
            result.game3_time,
            result.game4_time,
            result.game5_time,
          ].filter(time => time !== null).length
        }));
        
        setResults(processedData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    
    return () => clearInterval(intervalId);
  }, [currentGameId]);

  // Форматирование времени для отображения
  const renderTime = (timeStr) => {
    if (!timeStr) return '-';
    const ms = intervalToMilliseconds(timeStr);
    return formatGameTime(ms);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="card-title mb-0">Leaderboard</h3>
          </div>
          <div className="badge bg-primary">
            Total players: {totalPlayers}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card-body text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Player</th>
                <th scope="col">Completed</th>
                <th scope="col">Game 1</th>
                <th scope="col">Game 2</th>
                <th scope="col">Game 3</th>
                <th scope="col">Game 4</th>
                <th scope="col">Game 5</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr
                  key={result.game_id}
                  className={
                    result.game_id === currentGameId ? "table-primary" : ""
                  }
                >
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        index === 0 ? "bg-warning text-dark" : 
                        index === 1 ? "bg-secondary" : 
                        index === 2 ? "bg-danger" : "bg-light text-dark"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div>
                        <div className="fw-medium">
                          {result.nickname || result.game_id}
                        </div>
                        <small className="text-muted">{result.game_id}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        result.completedGames === 5
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {result.completedGames}/5
                    </span>
                  </td>
                  <td className="font-monospace">
                    {renderTime(result.game1_time)}
                  </td>
                  <td className="font-monospace">
                    {renderTime(result.game2_time)}
                  </td>
                  <td className="font-monospace">
                    {renderTime(result.game3_time)}
                  </td>
                  <td className="font-monospace">
                    {renderTime(result.game4_time)}
                  </td>
                  <td className="font-monospace">
                    {renderTime(result.game5_time)}
                  </td>
                  <td className="font-monospace text-primary fw-bold">
                    {renderTime(result.total_time)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {!loading && results.length > 0 && (
        <div className="card-footer bg-light text-end small">
          <span className="text-muted">
            Updated at: {new Date().toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
}