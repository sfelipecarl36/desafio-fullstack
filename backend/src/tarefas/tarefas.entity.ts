import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comentario } from '../comentarios/comentario.entity';

export enum TarefaStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  TESTING = 'testing',
  DONE = 'done',
}

@Entity('tarefas')
export class Tarefa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  descricao: string;

  @Column({
    type: 'enum',
    enum: TarefaStatus,
    default: TarefaStatus.PENDING,
  })
  status: TarefaStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_criacao: Date;

  @OneToMany(() => Comentario, comentario => comentario.tarefa)
  comentarios: Comentario[];

}