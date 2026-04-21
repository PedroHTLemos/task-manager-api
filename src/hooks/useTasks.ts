import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'

export function useTasks(workspaceId: string) {
  return useQuery({
    queryKey: ['tasks', workspaceId],
    queryFn: async () => {
      const { data } = await api.get(`/workspaces/${workspaceId}/tasks`)
      return data
    },
    enabled: !!workspaceId,
  })
}

export function useCreateTask(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { title: string; description?: string }) => {
      const { data } = await api.post(`/workspaces/${workspaceId}/tasks`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] })
    },
  })
}

export function useUpdateTask(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ taskId, ...payload }: { taskId: string; status?: string; title?: string }) => {
      const { data } = await api.patch(`/workspaces/${workspaceId}/tasks/${taskId}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] })
    },
  })
}

export function useDeleteTask(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/workspaces/${workspaceId}/tasks/${taskId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] })
    },
  })
}
