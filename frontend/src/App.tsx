import { useState, useEffect, useCallback } from 'react';
import type { Tarefa, TarefaStatus } from './model/tarefa';
import { tarefaService } from './services/tarefaService';
import { ColunaKanban } from './componentes/ColunaKanban';
import { FormularioCriarTarefa } from './componentes/FormularioCriarTarefa';
import { FormularioEditarTarefa } from './componentes/FormularioEditarTarefa';
import './index.css';
import './App.css';

const ordem_status: TarefaStatus[] = ['pending', 'in_progress', 'testing', 'done'];

function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormularioCriacao, setShowFormularioCriacao] = useState(false);
  const [tarefaEditandoId, setTarefaEditandoId] = useState<string | null>(null);

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
    fetchTarefas();
    setShowFormularioCriacao(false); 
    setTarefaEditandoId(null); 
  };

  const handleEditTarefa = (id: string) => {
    setTarefaEditandoId(id); 
  };

  const handleDeleteTarefa = async (id: string) => {
    setError(null);
    try {
      await tarefaService.deleteTarefa(id);
      handleTarefaAtualizada(); 
    } catch (err) {
      console.error("Erro ao deletar tarefa:", err);
      setError("Falha ao deletar tarefa. Tente novamente.");
    }
  };

  const handleAvancarTarefa = async (id: string, currentStatus: TarefaStatus) => {
    setError(null);
    const currentIndex = ordem_status.indexOf(currentStatus);
    const nextIndex = currentIndex + 1;

    if (nextIndex < ordem_status.length) { 
      const newStatus = ordem_status[nextIndex];
      try {
       
        const tarefaAtual = tarefas.find(t => t.id === id);
        if (tarefaAtual) {
          const dadosParaAtualizar = {
            titulo: tarefaAtual.titulo, 
            descricao: tarefaAtual.descricao,
            comentario: tarefaAtual.comentario,
            status: newStatus, 
          };
          await tarefaService.updateTarefa(id, dadosParaAtualizar);
          handleTarefaAtualizada();
        }
      } catch (err) {
        console.error("Erro ao avançar tarefa:", err);
        setError("Erro ao avançar tarefa");
      }
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
          onEdit={handleEditTarefa}  
          onDelete={handleDeleteTarefa} 
          onAvancar={handleAvancarTarefa}
          UltimaColuna={false} 
        />
        <ColunaKanban
          title="Em Progresso"
          status={'in_progress'}
          tarefas={getTarefasByStatus('in_progress')}
          onEdit={handleEditTarefa}
          onDelete={handleDeleteTarefa}
          onAvancar={handleAvancarTarefa}
          UltimaColuna={false} 
        />
        <ColunaKanban
          title="Em Teste"
          status={'testing'}
          tarefas={getTarefasByStatus('testing')}
          onEdit={handleEditTarefa}
          onDelete={handleDeleteTarefa}
          onAvancar={handleAvancarTarefa}
          UltimaColuna={false} 
        />
        <ColunaKanban
          title="Concluído"
          status={'done'}
          tarefas={getTarefasByStatus('done')}
          onEdit={handleEditTarefa}
          onDelete={handleDeleteTarefa}
          onAvancar={handleAvancarTarefa}
          UltimaColuna={true} 
        />
      </main>

      {showFormularioCriacao && (
        <FormularioCriarTarefa
          onTarefaCriada={handleTarefaAtualizada}
          onCancel={() => setShowFormularioCriacao(false)}
        />
      )}

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