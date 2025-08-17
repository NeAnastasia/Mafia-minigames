import { supabase } from "@/DB/supabase";
import { secondsToPostgresInterval } from "@/utils/timeUtils";

const secondsToISOInterval = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  // Форматируем с точностью до миллисекунд
  return `PT${hours}H${minutes}M${secs.toFixed(3)}S`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { gameId, gameNumber, timeInSeconds } = req.body;
  
  if (!gameId || !gameNumber || timeInSeconds === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

   try {
    // Упрощаем: не получаем nickname каждый раз
    const gameField = `game${gameNumber}_time`;
    const timeInterval = secondsToPostgresInterval(timeInSeconds); // Используем новую функцию

    // Проверяем существующую запись
    const { data: existingResult } = await supabase
      .from('game_results')
      .select('id')
      .eq('game_id', gameId)
      .single();

    if (existingResult) {
      // Обновляем ТОЛЬКО время игры
      const { data, error } = await supabase
        .from('game_results')
        .update({ [gameField]: timeInterval })
        .eq('game_id', gameId)
        .select();

      if (error) throw error;
      return res.status(200).json(data[0]);
    } else {
      // Создаем новую запись
      const { data, error } = await supabase
        .from('game_results')
        .insert([{ 
          game_id: gameId,
          [gameField]: timeInterval
        }])
        .select();

      if (error) throw error;
      return res.status(201).json(data[0]);
    }
  } catch (error) {
    console.error('Save result error:', error);
    return res.status(500).json({ error: 'Internal server error' });
 }
}