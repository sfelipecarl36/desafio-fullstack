import React, { useState, useEffect } from 'react';
import type { Tarefa, UpdateTarefaDto, TarefaStatus } from '../model/tarefa';
import { tarefaService } from '../services/tarefaService';

import '../styles/FormularioTarefa.css'; 

interface FormularioEditarTarefaProps {
  tarefaId: string; 
  onTarefaAtualizada: () => void; 
  onCancel: () => void; 
}

export const FormularioEditarTarefa: React.FC<FormularioEditarTarefaProps> = ({ tarefaId, onTarefaAtualizada, onCancel }) => {
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState<TarefaStatus>('pending'); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTarefa = async () => {
      setIsLoading(true);
      try {
        const fetchedTarefa = await tarefaService.getTarefaById(tarefaId);
        setTarefa(fetchedTarefa);
        setTitulo(fetchedTarefa.titulo);
        setDescricao(fetchedTarefa.descricao);
        setStatus(fetchedTarefa.status);
      } catch (err) {
        console.error("Erro ao carregar tarefa para edição:", err);
        setError('Falha ao carregar os detalhes da tarefa.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTarefa();
  }, [tarefaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titulo.trim() || !descricao.trim()) {
      setError('Título e descrição são obrigatórios.');
      return;
    }

    const dadosAtualizados: UpdateTarefaDto = {
      titulo,
      descricao,
      status,
    };

    setIsLoading(true);
    try {
      await tarefaService.updateTarefa(tarefaId, dadosAtualizados);
      onTarefaAtualizada(); 
      onCancel(); 
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
      setError('Erro ao atualizar tarefa. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !tarefa) return <div className="loading-message-modal">Carregando detalhes da tarefa...</div>;
  if (error && !tarefa) return <div className="error-message-modal">Erro: {error}</div>;
  if (!tarefa) return null; 

  return (
    <div className="formulario-tarefa-overlay">
      <div className="formulario-tarefa-container">
        <h2>Editar Tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grupo">
            <label htmlFor="edit-titulo">Título:</label>
            <input
              type="text"
              id="edit-titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-grupo">
            <label htmlFor="edit-descricao">Descrição:</label>
            <textarea
              id="edit-descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              disabled={isLoading}
            ></textarea>
          </div>
          
          <div className="form-grupo"> 
            <label htmlFor="edit-status">Status:</label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TarefaStatus)}
              disabled={isLoading}
            >
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Progresso</option>
              <option value="testing">Em Teste</option>
              <option value="done">Concluído</option>
            </select>
          </div>
          {error && <p className="form-erro">{error}</p>}
          <div className="form-botoes">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
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