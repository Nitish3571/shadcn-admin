import API from "@/config/api/api"
import useDeleteData from "@/hooks/useDeleteData"
import useFetchData from "@/hooks/useFetchData"
import usePostData from "@/hooks/usePostData"
const LIST_URL = API.users.list
export const useGetClients = () => {
    return useFetchData({ url: LIST_URL })
}

export const useCreateClient = () => {
    return usePostData({ url: API.users.create, refetchQueries: [LIST_URL] })
}

export const useUpdateClient = () => {
    return usePostData({ url: API.users.update, refetchQueries: [LIST_URL] })
}


export const useDeleteClient = () => {
    return useDeleteData({ url: API.users.delete, refetchQueries: [LIST_URL] })
}