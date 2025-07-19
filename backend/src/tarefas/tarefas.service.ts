import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CriarTarefaDto } from './dto/criar-tarefa.dto';
import { Tarefa, TarefaStatus } from './tarefas.entity';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';

@Injectable()
export class TarefasService {
  constructor(
    @InjectRepository(Tarefa)
    private tarefasRepository: Repository<Tarefa>,
  ) {}

  async findTarefas(): Promise<Tarefa[]> {
    return this.tarefasRepository.find();
  }

  async findTarefa(id: string): Promise<Tarefa> {
    const found = await this.tarefasRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`Tarefa "${id}" não encontrada`); 
    }
    return found;
  }

  async create(createTarefaDto: CriarTarefaDto): Promise<Tarefa> {
    const tarefa = this.tarefasRepository.create(createTarefaDto);
    return this.tarefasRepository.save(tarefa);
  }

  async update(id: string, updateTarefaDto: UpdateTarefaDto): Promise<Tarefa> {
    const tarefa = await this.findTarefa(id);
    Object.assign(tarefa, updateTarefaDto);
    return this.tarefasRepository.save(tarefa);
  }

  async updateStatus(id: string, status: TarefaStatus): Promise<Tarefa> {
    const tarefa = await this.findTarefa(id); 
    tarefa.status = status; 
    return this.tarefasRepository.save(tarefa);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tarefasRepository.delete(id);
    if (!result) {
      throw new NotFoundException(`Tarefa "${id}" não foi deletada`);
    }
  }
}