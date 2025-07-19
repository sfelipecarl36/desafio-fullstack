import { useState, useEffect, useCallback } from 'react';
import type { Tarefa, TarefaStatus } from './model/tarefa';
import { tarefaService } from './services/tarefaService';
import { ColunaKanban } from './componentes/ColunaKanban';
import { FormularioCriarTarefa } from './componentes/FormularioCriarTarefa';
import { FormularioEditarTarefa } from './componentes/FormularioEditarTarefa';
import './index.css';
import './App.css';

function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormularioCriacao, setShowFormularioCriacao] = useState(false);
  const [tarefaEditandoId, setTarefaEditandoId] = useState<string | null>(null); // <-- Novo: Estado para ID da tarefa em edição

  const fetchTarefas = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedTarefas = await tarefaService.getAllTarefas();
      setTarefas(fetchedTarefas);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      setError("Falha ao carregar tarefas. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTarefas();
  }, [fetchTarefas]);

  const getTarefasByStatus = (status: TarefaStatus) => {
    return tarefas.filter(tarefa => tarefa.status === status);
  };

  const handleTarefaAtualizada = () => {
    // Esta função serve para criação, edição e exclusão
    fetchTarefas();
    setShowFormularioCriacao(false); // Fecha formulário de criação
    setTarefaEditandoId(null); // Fecha formulário de edição
  };

  const handleEditTarefa = (id: string) => {
    setTarefaEditandoId(id); // Abre o formulário de edição para esta tarefa
  };

  const handleDeleteTarefa = async (id: string) => {
    setError(null);
    try {
      await tarefaService.deleteTarefa(id);
      handleTarefaAtualizada(); // Atualiza a lista após exclusão
    } catch (err) {
      console.error("Erro ao deletar tarefa:", err);
      setError("Falha ao deletar tarefa. Tente novamente.");
    }
  };

  if (loading) return <div className="loading-message">Carregando tarefas...</div>;
  if (error) return <div className="error-message">Erro: {error}</div>;

  return (
    <div className="container-principal">
      <header className="header">
        <h1>Desafio FullStack - Kanban</h1>
        <button
          className="botao-adicionar-tarefa"
          onClick={() => setShowFormularioCriacao(true)}
        >
          + Adicionar Tarefa
        </button>
      </header>

      <main className="kanban-board">
        <ColunaKanban
          title="Pendente"
          status={'pending'}
          tarefas={getTarefasByStatus('pending')}
          onEdit={handleEditTarefa} // <-- Passa o handler para a coluna
          onDelete={handleDeleteTarefa} // <-- Passa o handler para a coluna
        />
        <ColunaKanban
          title="Em Progresso"
          status={'in_progress'}
          tarefas={getTarefasByStatus('in_progress')}
          onEdit={handleEditTarefa}
          onDelete={handleDeleteTarefa}
        />
        <ColunaKanban
          title="Em Teste"
          status={'testing'}
          tarefas={getTarefasByStatus('testing')}
          onEdit={handleEditTarefa}
          onDelete={handleDeleteTarefa}
        />
        <ColunaKanban
          title="Concluído"
          status={'done'}
          tarefas={getTarefasByStatus('done')}
          onEdit={handleEditTarefa}
          onDelete={handleDeleteTarefa}
        />
      </main>

      {showFormularioCriacao && (
        <FormularioCriarTarefa
          onTarefaCriada={handleTarefaAtualizada}
          onCancel={() => setShowFormularioCriacao(false)}
        />
      )}

      {/* Renderiza o formulário de edição se um ID estiver definido */}
      {tarefaEditandoId && (
        <FormularioEditarTarefa
          tarefaId={tarefaEditandoId}
          onTarefaAtualizada={handleTarefaAtualizada}
          onCancel={() => setTarefaEditandoId(null)}
        />
      )}
    </div>
  );
}

export default App;