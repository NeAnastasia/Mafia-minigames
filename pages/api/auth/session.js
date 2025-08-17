import { supabase } from "@/DB/supabase";

export default async function handler(req, res) {
  const sessionId = req.cookies.game_session;
  
  if (!sessionId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const { data: account, error } = await supabase
      .from('game_accounts')
      .select('id, game_id, nickname, is_admin')
      .eq('id', sessionId)
      .single();

    if (error || !account) {
      // Удаляем невалидную сессию
      res.setHeader(
        'Set-Cookie',
        `game_session=; Path=/; HttpOnly;  SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`
      );
      return res.status(401).json({ error: 'Session invalid' });
    }

    res.status(200).json(account);
  } catch (error) {
    console.error('Session check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}