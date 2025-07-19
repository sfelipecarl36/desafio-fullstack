import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { TarefaStatus } from '../tarefas.entity';

export class CriarTarefaDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsOptional()
  @IsEnum(TarefaStatus)
  status?: TarefaStatus;
  
  @IsOptional()
  @IsString()
  comentario?: string;
}