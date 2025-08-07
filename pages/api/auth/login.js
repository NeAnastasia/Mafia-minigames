import { supabase } from "@/DB/supabase";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { game_id, password } = req.body;

  if (!game_id || !password) {
    return res.status(400).json({ error: 'Game ID and password are required' });
  }

  try {
    // Ищем аккаунт по game_id
    const { data: account, error } = await supabase
      .from('game_accounts')
      .select('id, game_id, password, nickname, is_admin')
      .eq('game_id', game_id)
      .single();

    if (error || !account) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Проверяем пароль
    if (account.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Создаём сессию (в реальном проекте используйте JWT)
    res.setHeader(
      'Set-Cookie',
      `game_session=${account.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000; ${
        process.env.NODE_ENV === 'production' ? 'Secure' : ''
      }`
    );

    // Возвращаем данные пользователя (без пароля)
    const { password: _, ...userData } = account;
    res.status(200).json(userData);
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}