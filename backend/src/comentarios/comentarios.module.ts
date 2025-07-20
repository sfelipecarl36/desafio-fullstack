import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { Comentario } from './comentario.entity';
import { Tarefa } from '../tarefas/tarefas.entity';
import { IaModule } from '../IA/ia.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comentario, Tarefa]),
    IaModule,
  ],
  providers: [ComentariosService],
  controllers: [ComentariosController],
  exports: [ComentariosService, TypeOrmModule.forFeature([Comentario])],
})
export class ComentariosModule {}