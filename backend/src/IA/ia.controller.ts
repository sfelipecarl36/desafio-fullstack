import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { IaService } from './iaService';
import { SugerirDescricaoDto } from './dto/sugerirDescricao.dto';

@Controller('ai')
export class IaController {
  constructor(private readonly iaService: IaService) {}

  @Post('suggest-description')
  async suggestDescription(@Body() body: SugerirDescricaoDto): Promise<{ description: string }> {
    const { titulo } = body;

    const suggestedDescription = await this.iaService.suggestDescription(titulo);
    return { description: suggestedDescription };
  }
}