import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

// Por orientação do próprio Gemini este código do service foi possível

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY || API_KEY.trim() === '') {
  console.error('Erro: variável GEMINI_API_KEY não definida ou vazia. Verifique seu arquivo .env.');
}

const genAI = API_KEY && API_KEY.trim() !== '' ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.5-flash" }) : null;

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

   async analisarSentimento(textoParaAnalise: string): Promise<string> {
    if (!model) {
      console.error("tentativa de chamar IA Service para análise de sentimento sem API Key.");
      return "serviço de IA não configurado para análise de sentimento";
    }

    const prompt = `Analise o sentimento do seguinte comentário e responda APENAS com "positivo", "neutro" ou "negativo". Se o sentimento for ambíguo ou não for claro, responda "neutro".\n\nComentário: "${textoParaAnalise}"`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const sentimentResult = response.text();
      return sentimentResult.trim().toLowerCase();
    } catch (error) {
      console.error("Erro ao chamar a API Gemini para análise de sentimento:", error);
      return "neutro"; 
    }
  }
}