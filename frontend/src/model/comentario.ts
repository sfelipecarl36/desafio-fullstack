export type SentimentoComentario = 'positivo' | 'neutro' | 'negativo' | 'não analisado';

export interface Comentario {
  id: string;
  conteudo: string;
  dataCriacao: string;
  sentimento: SentimentoComentario;
  tarefaId: string;
}