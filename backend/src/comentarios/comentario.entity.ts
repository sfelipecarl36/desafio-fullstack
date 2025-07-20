import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Tarefa } from '../tarefas/tarefas.entity';

export enum SentimentoComentario {
    POSITIVO = 'positivo',
    NEUTRO = 'neutro',
    NEGATIVO = 'negativo',
    NAO_ANALISADO = 'não analisado',
}

@Entity('comentarios')

export class Comentario {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  conteudo: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  @Column({
    type: 'enum',
    enum: SentimentoComentario,
    default: SentimentoComentario.NAO_ANALISADO,
    nullable: true,
  })
  sentimento: SentimentoComentario;

  @ManyToOne(() => Tarefa, tarefa => tarefa.comentarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tarefaId' })
  tarefa: Tarefa;

  @Column()
  tarefaId: string;

}