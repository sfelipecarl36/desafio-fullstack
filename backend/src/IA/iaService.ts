import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY || API_KEY.trim() === '') {
  console.error('Erro: variável GEMINI_API_KEY não definida ou vazia. Verifique seu arquivo .env.');
}

const genAI = API_KEY && API_KEY.trim() !== '' ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

@Injectable()
export class IaService {

  async suggestDescription(titulo: string): Promise<string> { 
    if (!model) {
      console.error("tentativa de chamar IA Service sem API Key.");
      return "serviço de IA não configurado";
    }

    const prompt = `sugira uma descrição detalhada e concisa para uma tarefa de um quadro Kanban com o título: "${titulo}". A descrição deve ser focada em ação e objetivo. Use até 50 palavras.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text.trim();
    } catch (error) {
      console.error("erro ao chamar a API Gemini para sugestão:", error);
      return "não foi possível gerar uma descrição no momento. Tente novamente.";
    }
  }
}