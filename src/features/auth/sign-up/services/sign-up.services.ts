import usePostData from "@/hooks/usePostData"

export const useLogin = () => {
    return usePostData({ url: '/auth/sign-in', refetchQueries: ['getUser'] })
}