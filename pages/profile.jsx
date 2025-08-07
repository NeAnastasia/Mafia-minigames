import { useState, useEffect } from 'react'
import { supabase } from '@/DB/supabase'

export default function Profile() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    // Получаем vk_id из URL
    const params = new URLSearchParams(window.location.search)
    const vkId = params.get('vk_id')
    
    if (vkId) {
      fetchUserData(vkId)
    }
  }, [])

  const fetchUserData = async (vkId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('vk_id', vkId)
      .single()
    
    if (data) {
      setUser(data)
    }
  }

  if (!user) return <div className="text-center py-10">Загрузка...</div>

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Ваш профиль</h1>
      <div className="flex items-center mb-4">
        {user.avatar_url && (
          <img 
            src={user.avatar_url} 
            alt="Avatar" 
            className="w-16 h-16 rounded-full mr-4"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold">{user.full_name}</h2>
          <p className="text-gray-600">ID: {user.vk_id}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          На главную
        </button>
      </div>
    </div>
  )
}