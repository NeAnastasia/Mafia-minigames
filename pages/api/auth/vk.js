import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const { code, verifier } = req.query;
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] Start VK auth processing`);

  if (!code) {
    return res.status(400).json({ error: "Authorization code is missing" });
  }

  try {
    // 1. Обмен кода на access token
    const tokenParams = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_VK_APP_ID,
      client_secret: process.env.VK_SECRET_KEY,
      redirect_uri: process.env.NEXT_PUBLIC_VK_REDIRECT_URI,
      code: code,
      code_verifier: verifier,
      v: "5.199"
    });

    const tokenResponse = await fetch("https://oauth.vk.com/access_token?debug=1", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("VK token exchange error:", tokenData);
      // Отправляем обратно code, который пришел, для отладки
      return res.redirect(`/?error=${encodeURIComponent(tokenData.error_description || "Token exchange failed")}&code=${code}`);
    }

    const accessToken = tokenData.access_token;
    const userId = tokenData.user_id;
    const email = tokenData.email || "";

    // 2. Получение данных пользователя (используем accessToken)
    const userResponse = await fetch("https://api.vk.com/method/users.get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_ids: userId,
        access_token: accessToken,
        fields: "photo_200",
        v: "5.199",
      }),
    });

    const userData = await userResponse.json();

    if (userData.error) {
      console.error("VK user data error:", userData);
      throw new Error(userData.error.error_msg);
    }

    const vkUser = userData.response[0];

    // 3. Подготовка данных для Supabase
    const user = {
      id: userId,
      email: email || `${userId}@vk.com`,
      name: `${vkUser.first_name} ${vkUser.last_name}`,
      avatar: vkUser.photo_200,
    };

    // 4. Сохранение в Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase.from("users").upsert(
      {
        id: user.id,
        email: user.email,
        full_name: user.name,
        avatar_url: user.avatar,
        last_login: new Date(),
      },
      { onConflict: "id" }
    );

    if (error) throw error;

    // 5. Создание сессии/редирект
    res.setHeader(
      "Set-Cookie",
      `user_id=${user.id}; Path=/; HttpOnly; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure" : ""
      }`
    );
    res.redirect("/");
  } catch (error) {
    console.error("VK auth error:", error);
    res.redirect(`/?error=${encodeURIComponent(error.message)}&verifier=${verifier}`);
  }
  console.log(
    `[${new Date().toISOString()}] Completed in ${Date.now() - startTime}ms`
  );
}
