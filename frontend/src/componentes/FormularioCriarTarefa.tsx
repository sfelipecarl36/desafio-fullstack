import React, { useState } from 'react';
import type { CreateTarefaDto } from '../model/tarefa';
import { tarefaService } from '../services/tarefaService';

import '../styles/FormularioTarefa.css';

interface FormularioTarefaProps {
  onTarefaCriada: () => void;
  onCancel: () => void;
}

export const FormularioCriarTarefa: React.FC<FormularioTarefaProps> = ({ onTarefaCriada, onCancel }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titulo.trim() || !descricao.trim()) {
      setError('Título e descrição são obrigatórios.');
      return;
    }

    const novaTarefa: CreateTarefaDto = {
      titulo,
      descricao,
    };

    setIsLoading(true);
    try {
      await tarefaService.createTarefa(novaTarefa);
      onTarefaCriada(); 
      setTitulo('');
      setDescricao('');
      onCancel(); 
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
      setError('Erro ao criar tarefa. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestDescription = async () => {
    setError(null);
    if (!titulo.trim()) {
      setError('Por favor, insira um título para gerar uma sugestão de descrição.');
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const sugestao = await tarefaService.sugerirDescricao(titulo);
      setDescricao(sugestao);
    } catch (err) {
      console.error("erro ao sugerir descrição:", err);
      setError('não foi possível gerar uma sugestão');
    } finally {
      setIsGeneratingDescription(false);
    }
  };


  return (
    <div className="formulario-tarefa-overlay"> 
      <div className="formulario-tarefa-container">
        <h2>Adicionar Nova Tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grupo">
            <label htmlFor="titulo">Título:</label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              disabled={isLoading || isGeneratingDescription}
            />
          </div>
          <div className="form-grupo">
            <label htmlFor="descricao">Descrição:</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              disabled={isLoading}
            ></textarea>
            <button
              type="button"
              onClick={handleSuggestDescription}
              disabled={isLoading || isGeneratingDescription || !titulo.trim()}
              className="botao-sugerir-desc"
              title="Gerar descrição com IA"
            >
              {isGeneratingDescription ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Gerando...
                </>
              ) : (
                <>
                  <i className="fas fa-magic"></i> Sugerir Descrição
                </>
              )}
            </button>
          </div>
          {error && <p className="form-erro">{error}</p>}
          <div className="form-botoes">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Tarefa'}
            </button>
            <button type="button" onClick={onCancel} disabled={isLoading} className="botao-cancelar">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};