import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { IaService } from './iaService';
import { SugerirDescricaoDto } from './dto/sugerirDescricao.dto';
import { Response } from 'express';

@Controller('ai')

export class IaController {

  constructor(
    private readonly iaService: IaService
  ) {} 

  @Post('suggest-description')
  async suggestDescription (
      @Body() { titulo }: SugerirDescricaoDto,
      @Res() res: Response
  ): Promise<void> {
    if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
        res.status(HttpStatus.BAD_REQUEST).json({ error: 'Título obrigatório.' });
        return;
    }

    try {
        const sugestao = await this.iaService.suggestDescription(titulo);
        res.status(HttpStatus.OK).json({ description: sugestao });
    } catch (error) {
        console.error("Erro no controller ao sugerir descrição:", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Erro ao tentar gerar sugestão de descrição.' });
    }
  }
}