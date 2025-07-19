import axios from 'axios';
import type { Tarefa, CreateTarefaDto, UpdateTarefaDto, TarefaStatus } from '../model/tarefa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tarefaService = {

  getAllTarefas: async (): Promise<Tarefa[]> => {
    const response = await apiClient.get<Tarefa[]>('/tarefas');
    return response.data;
  },

  createTarefa: async (tarefa: CreateTarefaDto): Promise<Tarefa> => {
    const response = await apiClient.post<Tarefa>('/tarefas', tarefa);
    return response.data;
  },

  getTarefaById: async (id: string): Promise<Tarefa> => {
    const response = await apiClient.get<Tarefa>(`/tarefas/${id}`);
    return response.data;
  },

  updateTarefa: async (id: string, tarefa: UpdateTarefaDto): Promise<Tarefa> => {
    const response = await apiClient.patch<Tarefa>(`/tarefas/${id}`, tarefa);
    return response.data;
  },

  updateTarefaStatus: async (id: string, status: TarefaStatus): Promise<Tarefa> => {
    const response = await apiClient.patch<Tarefa>(`/tarefas/${id}/status`, { status });
    return response.data;
  },

  deleteTarefa: async (id: string): Promise<void> => {
    await apiClient.delete(`/tarefas/${id}`);
  },

  async sugerirDescricao(titulo: string): Promise<string> {
    try {
      const response = await axios.post<{ description: string }>(`${API_URL}/ai/suggest-description`, { titulo });
      return response.data.description;
    } catch (error) {
      console.error('Erro pra chamar o backend:', error);
      return 'não foi possível gerar uma sugestão';
    }
  },
};