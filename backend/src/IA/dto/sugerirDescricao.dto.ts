import { IsString, IsNotEmpty } from 'class-validator';

export class SugerirDescricaoDto {
  @IsNotEmpty({ message: 'O título não pode ser vazio.' })
  @IsString({ message: 'O título deve ser uma string.' })
  titulo: string;
}