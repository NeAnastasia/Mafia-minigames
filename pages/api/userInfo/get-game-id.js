import { supabase } from "@/DB/supabase";

export default async function handler(req, res) {
  const accountId = req.cookies.game_session;
  
  if (!accountId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const { data, error } = await supabase
      .from('game_accounts')
      .select('game_id')
      .eq('id', accountId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Account not found' });
    }

    return res.status(200).json({ gameId: data.game_id });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}