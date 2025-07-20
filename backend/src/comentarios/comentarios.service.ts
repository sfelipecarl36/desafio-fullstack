import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario, SentimentoComentario } from './comentario.entity';
import { CriarComentarioDto } from './dto/criar-comentario.dto';
import { IaService } from '../IA/iaService'; 
import { Tarefa } from '../tarefas/tarefas.entity';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectRepository(Comentario)
    private readonly comentarioRepository: Repository<Comentario>,
    @InjectRepository(Tarefa)
    private readonly tarefaRepository: Repository<Tarefa>,
    private readonly iaService: IaService,
  ) {}

  async create(criarComentarioDto: CriarComentarioDto): Promise<Comentario> {
    const { conteudo, tarefaId } = criarComentarioDto;

    const tarefa = await this.tarefaRepository.findOne({ where: { id: tarefaId } });
    if (!tarefa) {
      throw new NotFoundException(`Tarefa com ID "${tarefaId}" não achada.`);
    }
    const comentario = this.comentarioRepository.create({ conteudo, tarefaId, tarefa });
    const savedComentario = await this.comentarioRepository.save(comentario);

    this.analyzeSentiment(savedComentario.id, conteudo).catch(err => {
      console.error(`Falha pra analisar sentimento do comentário ${savedComentario.id}:`, err);
    });

    return savedComentario;
  }

  async findByTarefaId(tarefaId: string): Promise<Comentario[]> {
    return this.comentarioRepository.find({
      where: { tarefaId },
      order: { dataCriacao: 'ASC' },
    });
  }

  async remove(id: string): Promise<void> {
    await this.comentarioRepository.delete(id);
  }

  private async analyzeSentiment(comentarioId: string, conteudo: string): Promise<void> {
    try {
      const prompt = `Analise o sentimento do seguinte comentário e responda APENAS com "positivo", "neutro" ou "negativo". Se o sentimento for ambíguo ou não for claro, responda "neutro".\n\nComentário: "${conteudo}"`;
      const sentimentText = await this.iaService.analisarSentimento(prompt);

      let sentimento: SentimentoComentario = SentimentoComentario.NAO_ANALISADO;
      if (sentimentText.toLowerCase().includes('positivo')) {
        sentimento = SentimentoComentario.POSITIVO;
      } else if (sentimentText.toLowerCase().includes('negativo')) {
        sentimento = SentimentoComentario.NEGATIVO;
      } else {
        sentimento = SentimentoComentario.NEUTRO;
      }

      await this.comentarioRepository.update(comentarioId, { sentimento });
      console.log(`Sentimento do comentário ${comentarioId} atualizado pra: ${sentimento}`);

    } catch (error) {
      console.error(`Erro para analisar sentimento de comentário ${comentarioId}:`, error);
      await this.comentarioRepository.update(comentarioId, { sentimento: SentimentoComentario.NAO_ANALISADO });
    }
  }
}