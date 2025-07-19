import { PartialType } from '@nestjs/mapped-types';
import { CriarTarefaDto } from './criar-tarefa.dto';
import { TarefaStatus } from '../tarefas.entity';
import { IsOptional, IsEnum } from 'class-validator';

export class UpdateTarefaDto extends PartialType(CriarTarefaDto) {
  @IsOptional()
  @IsEnum(TarefaStatus)
  status?: TarefaStatus;
}