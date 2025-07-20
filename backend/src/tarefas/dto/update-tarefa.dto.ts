import { PartialType } from '@nestjs/mapped-types';
import { CriarTarefaDto } from './criar-tarefa.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { TarefaStatus } from '../tarefas.entity';

export class UpdateTarefaDto extends PartialType(CriarTarefaDto) {

  @IsOptional()
  @IsEnum(TarefaStatus)
  status?: TarefaStatus;
  
}