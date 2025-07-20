import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CriarComentarioDto {
  @IsNotEmpty({ message: 'O conteúdo do comentário não pode estar vazio.' })
  @IsString({ message: 'O conteúdo do comentário deve ser string.' })
  conteudo: string;

  @IsNotEmpty({ message: 'O ID da tarefa é obrigatório.' })
  // Aqui eu to supondo um UUID v4
  @IsUUID('4', { message: 'O ID da tarefa deve ser um UUID válido.' })
  tarefaId: string;
}