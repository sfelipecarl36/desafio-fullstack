export type TarefaStatus = 'pending' | 'in_progress' | 'testing' | 'done';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  status: TarefaStatus;
  data_criacao: string;
  comentario: string;
}

export interface CreateTarefaDto {
  titulo: string;
  descricao: string;
  status?: TarefaStatus;
  comentario?: string;
}

export interface UpdateTarefaDto {
  titulo?: string;
  descricao?: string;
  status?: TarefaStatus;
  comentario?: string;
}