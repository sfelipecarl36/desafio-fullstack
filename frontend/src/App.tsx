
import { useState, useEffect, useCallback } from 'react';
import type { Tarefa, TarefaStatus } from './model/tarefa'; 
import { tarefaService } from './services/tarefaService';
import { ColunaKanban } from './componentes/ColunaKanban';
import { FormularioCriarTarefa } from './componentes/FormularioCriarTarefa';
import { FormularioEditarTarefa } from './componentes/FormularioEditarTarefa';
import { ModalDetalhesTarefa } from './componentes/ModalDetalhesTarefa'; 
import './index.css';
import './App.css';

const ordem_status: TarefaStatus[] = ['pending', 'in_progress', 'testing', 'done'];

function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormularioCriacao, setShowFormularioCriacao] = useState(false);
  const [tarefaEditandoId, setTarefaEditandoId] = useState<string | null>(null);

  const [modalDetalhesAberta, setModalDetalhesAberta] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(null);

  const fetchTarefas = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedTarefas = await tarefaService.getAllTarefas();
      setTarefas(fetchedTarefas);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      setError("Falha ao carregar tarefas, verificar backend");
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

    if (modalDetalhesAberta) {
      setModalDetalhesAberta(false);
      setTarefaSelecionada(null);
    }
  };

  const handleEditTarefa = (id: string) => {
    setTarefaEditandoId(id);
  
    if (tarefaSelecionada && tarefaSelecionada.id === id) {
      setModalDetalhesAberta(false);
      setTarefaSelecionada(null);
    }
  };

  const handleDeleteTarefa = async (id: string) => {
    setError(null);
    if (window.confirm('Tem certeza que deseja deletar esta tarefa?')) {
      try {
        await tarefaService.deleteTarefa(id);
        handleTarefaAtualizada();
      } catch (err) {
        console.error("Erro ao deletar tarefa:", err);
        setError("Falha ao deletar tarefa. Tente novamente.");
      }
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
            comentario: tarefaAtual.comentarios,
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

  const handleAbrirDetalhesTarefa = (tarefa: Tarefa) => {
    setTarefaSelecionada(tarefa);
    setModalDetalhesAberta(true);
  };

  const handleFecharDetalhesTarefa = () => {
    setModalDetalhesAberta(false);
    setTarefaSelecionada(null); 
    fetchTarefas();
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
          onCardClick={handleAbrirDetalhesTarefa} 
        />
        <ColunaKanban
          title="Em Progresso"
          status={'in_progress'}
          tarefas={getTarefasByStatus('in_progress')}
          onEdit={handleEditTarefa}
          onDelete={handleDeleteTarefa}
          onAvancar={handleAvancarTarefa}
          UltimaColuna={false}
          onCardClick={handleAbrirDetalhesTarefa} 
        />
        <ColunaKanban
          title="Em Teste"
          status={'testing'}
          tarefas={getTarefasByStatus('testing')}
          onEdit={handleEditTarefa}
          onDelete={handleDeleteTarefa}
          onAvancar={handleAvancarTarefa}
          UltimaColuna={false}
          onCardClick={handleAbrirDetalhesTarefa} 
        />
        <ColunaKanban
          title="Concluído"
          status={'done'}
          tarefas={getTarefasByStatus('done')}
          onEdit={handleEditTarefa}
          onDelete={handleDeleteTarefa}
          onAvancar={handleAvancarTarefa}
          UltimaColuna={true}
          onCardClick={handleAbrirDetalhesTarefa} 
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

      {modalDetalhesAberta && tarefaSelecionada && (
        <ModalDetalhesTarefa
          tarefa={tarefaSelecionada}
          onClose={handleFecharDetalhesTarefa}

        />
      )}
    </div>
  );
}

export default App;