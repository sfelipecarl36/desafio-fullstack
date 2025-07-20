import { Controller, Post, Get, Delete, Body, Param, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { Comentario } from './comentario.entity';
import { CriarComentarioDto } from './dto/criar-comentario.dto';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createComentario(
    @Body(ValidationPipe) criarComentarioDto: CriarComentarioDto,
  ): Promise<Comentario> {
    return this.comentariosService.create(criarComentarioDto);
  }

  @Get(':tarefaId')
  async getComentariosByTarefaId(@Param('tarefaId') tarefaId: string): Promise<Comentario[]> {
    return this.comentariosService.findByTarefaId(tarefaId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComentario(@Param('id') id: string): Promise<void> {
    await this.comentariosService.remove(id);
  }
}