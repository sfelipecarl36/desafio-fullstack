import axios from 'axios';
import type { Comentario } from '../model/comentario'; 

const API_BASE_URL = 'http://localhost:3000';

export const comentarioService = {
  
  async getComentariosByTarefaId(tarefaId: string): Promise<Comentario[]> {
    try {
      const response = await axios.get<Comentario[]>(`${API_BASE_URL}/comentarios/${tarefaId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar comentários a tarefa ${tarefaId}:`, error);
      throw error;
    }
  },

  async addComentario(tarefaId: string, conteudo: string): Promise<Comentario> {
    try {
      const response = await axios.post<Comentario>(`${API_BASE_URL}/comentarios`, { tarefaId, conteudo });
      return response.data;
    } catch (error) {
      console.error(`Erro para adicionar comentário a tarefa ${tarefaId}:`, error);
      throw error;
    }
  },

  async deleteComentario(comentarioId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/comentarios/${comentarioId}`);
    } catch (error) {
      console.error(`Erro em deletar o comentário ${comentarioId}:`, error);
      throw error;
    }
  },
};