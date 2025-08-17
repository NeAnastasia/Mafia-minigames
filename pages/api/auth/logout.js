export default function handler(req, res) {
  res.setHeader(
    'Set-Cookie',
    `game_session=; Path=/; HttpOnly;  SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT; ${
      process.env.NODE_ENV === 'production' ? 'Secure' : ''
    }`
  );
  res.status(200).json({ message: 'Logged out successfully' });
}