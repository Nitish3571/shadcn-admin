import API from '@/config/api/api'
import usePostData from '@/hooks/usePostData'
import { useAuthStore, User } from '@/stores/authStore'
import { useNavigate } from '@tanstack/react-router'

interface LoginData {
  user:User
  token:string
}

export const useLogin = () => {
  const navigate = useNavigate()
  const {setUserInfo,setToken}=useAuthStore()
  return usePostData({
    url: API.auth.login,
    mutationOptions: {
      onSuccess: (data:LoginData) => {
        console.log("login data: ", data);
        console.log("login token: ", data.token);
        
       setUserInfo(data?.user)
        setToken(data?.token)
        navigate({
          to: '/',
          replace: true,
        })
      },
    },
  })
}
