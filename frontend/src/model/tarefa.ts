import type { Comentario } from "./comentario";

export type TarefaStatus = 'pending' | 'in_progress' | 'testing' | 'done';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  status: TarefaStatus;
  data_criacao: string;
  comentarios?: Comentario[]; 
}

export interface CreateTarefaDto {
  titulo: string;
  descricao: string;
  status?: TarefaStatus;
}

export interface UpdateTarefaDto {
  titulo?: string;
  descricao?: string;
  status?: TarefaStatus;
  comentarios?: Comentario[];
}