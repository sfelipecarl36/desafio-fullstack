import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarefasController } from './tarefas.controller';
import { TarefasService } from './tarefas.service';
import { Tarefa } from './tarefas.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Tarefa])],
  controllers: [TarefasController],
  providers: [TarefasService]
})

export class TarefasModule {}
