import { supabase } from "@/DB/supabase";

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
    // 1. Получаем nickname из таблицы аккаунтов
    const { data: account, error: accountError } = await supabase
      .from('game_accounts')
      .select('nickname')
      .eq('game_id', gameId)
      .single();

    if (accountError || !account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // 2. Форматируем время в ISO 8601 для интервала
    const gameField = `game${gameNumber}_time`;
    const timeInterval = secondsToISOInterval(timeInSeconds);

    // 3. Проверяем существующую запись
    const { data: existingResult, error: fetchError } = await supabase
      .from('game_results')
      .select('*')
      .eq('game_id', gameId)
      .single();

    // 4. Обновляем или создаем запись
    if (existingResult) {
      // Обновляем существующую запись
      const { data, error } = await supabase
        .from('game_results')
        .update({ 
          [gameField]: timeInterval,
          nickname: account.nickname
        })
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
          nickname: account.nickname,
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