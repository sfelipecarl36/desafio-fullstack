import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe, 
} 
from '@nestjs/common';

import { TarefasService } from './tarefas.service';
import { CriarTarefaDto } from './dto/criar-tarefa.dto';
import { Tarefa, TarefaStatus } from './tarefas.entity';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';

@Controller('tarefas') 
export class TarefasController {
  constructor(private tarefasService: TarefasService) {}

  @Get()
  async findTarefas(): Promise<Tarefa[]> {
    return this.tarefasService.findTarefas();
  }

  @Get(':id')
  async findTarefa(@Param('id') id: string): Promise<Tarefa> {
    return this.tarefasService.findTarefa(id);
  }

  @Post() //criar a tarefa
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createTarefaDto: CriarTarefaDto, 
  ): Promise<Tarefa> {
    return this.tarefasService.create(createTarefaDto);
  }

  @Patch(':id') 
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTarefaDto: UpdateTarefaDto,
  ): Promise<Tarefa> {
    return this.tarefasService.update(id, updateTarefaDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status', new ValidationPipe({ transform: true }))
    status: TarefaStatus,
  ): Promise<Tarefa> {
    if (!Object.values(TarefaStatus).includes(status)) {
        throw new Error(`status não válido: "${status}"`);
    }
    return this.tarefasService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.tarefasService.remove(id);
  }
}