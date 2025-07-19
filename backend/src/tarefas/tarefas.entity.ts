import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ nullable: true, default: '' })
  comentario: string;
}