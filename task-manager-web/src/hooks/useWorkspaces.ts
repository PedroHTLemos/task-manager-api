import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data } = await api.get('/workspaces')
      return data
    },
  })
}
