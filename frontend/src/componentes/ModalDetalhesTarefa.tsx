import React, { useState, useEffect } from 'react';
import type { Tarefa } from '../model/tarefa';
import type { Comentario, SentimentoComentario } from '../model/comentario'; 
import { comentarioService } from '../services/comentarioService'; 
import '../styles/ModalDetalhesTarefa.css'; 

interface ModalDetalhesTarefaProps {
  tarefa: Tarefa;
  onClose: () => void; 
  onUpdateTarefa?: (updatedTarefa: Tarefa) => void;
}

export const ModalDetalhesTarefa: React.FC<ModalDetalhesTarefaProps> = ({ tarefa, onClose, onUpdateTarefa }) => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [novoComentarioConteudo, setNovoComentarioConteudo] = useState('');
  const [isLoadingComentarios, setIsLoadingComentarios] = useState(true);
  const [isAddingComentario, setIsAddingComentario] = useState(false);

  useEffect(() => {
    const fetchComentarios = async () => {
      setIsLoadingComentarios(true);
      try {
        const fetchedComentarios = await comentarioService.getComentariosByTarefaId(tarefa.id);
        setComentarios(fetchedComentarios);
      } catch (error) {
        console.error('Falha ao buscar comentários:', error);
      } finally {
        setIsLoadingComentarios(false);
      }
    };

    fetchComentarios();
  }, [tarefa.id]);

  const handleAddComentario = async () => {
    if (novoComentarioConteudo.trim() === '') {
      alert('O comentário não pode estar vazio.');
      return;
    }
    setIsAddingComentario(true);
    try {
      const novoComentario = await comentarioService.addComentario(tarefa.id, novoComentarioConteudo);
      setComentarios(prev => [...prev, novoComentario]);
      setNovoComentarioConteudo(''); 

      setTimeout(async () => {
          const updatedComentarios = await comentarioService.getComentariosByTarefaId(tarefa.id);
          setComentarios(updatedComentarios);
      }, 3000); // 3 segundos de atraso pro Gemini processar

    } catch (error) {
      console.error('Falha ao adicionar comentário:', error);
      alert('Erro ao adicionar comentário.');
    } finally {
      setIsAddingComentario(false);
    }
  };

  const handleDeleteComentario = async (comentarioId: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este comentário?')) {
      return;
    }
    try {
      await comentarioService.deleteComentario(comentarioId);
      setComentarios(prev => prev.filter(c => c.id !== comentarioId));
    } catch (error) {
      console.error('Falha ao deletar comentário:', error);
      alert('Erro ao deletar comentário.');
    }
  };

  // Aqui determino a cor do sentimento
  const getSentimentoColor = (sentimento: SentimentoComentario) => {
    switch (sentimento) {
      case 'positivo': return 'green';
      case 'negativo': return 'red';
      case 'neutro': return 'gray';
      case 'não analisado': return 'orange';
      default: return 'black';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>Detalhes da Tarefa: {tarefa.titulo}</h2>
        <p><strong>Descrição:</strong> {tarefa.descricao}</p>
        <p><strong>Status:</strong> {tarefa.status}</p>
        <p><strong>Criada em:</strong> {tarefa.data_criacao ? new Date(tarefa.data_criacao).toLocaleString() : 'N/A'}</p>

          <div className="add-comentario-form">
            <textarea
              placeholder="Adicione um novo comentário..."
              value={novoComentarioConteudo}
              onChange={(e) => setNovoComentarioConteudo(e.target.value)}
              rows={3}
            />
            <button onClick={handleAddComentario} disabled={isAddingComentario}>
              {isAddingComentario ? 'Adicionando...' : 'Adicionar Comentário'}
            </button>
          </div>
          {/* Seção de Comentários */}
        <div className="comentarios-section">
          <h3>Comentários</h3>
          <div className="comentarios-list">
            {isLoadingComentarios ? (
              <p>Carregando comentários...</p>
            ) : comentarios.length === 0 ? (
              <p>Nenhum comentário ainda.</p>
            ) : (
              comentarios.map((comentario) => (
                <div key={comentario.id} className="comentario-item">
                  <p>{comentario.conteudo}</p>
                  <small>
                    {new Date(comentario.dataCriacao).toLocaleString()} -
                    <span style={{ color: getSentimentoColor(comentario.sentimento), marginLeft: '5px' }}>
                      Sentimento: {comentario.sentimento || 'não analisado'}
                    </span>
                  </small>
                  <button className="delete-comentario-btn" onClick={() => handleDeleteComentario(comentario.id)}>Deletar</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesTarefa;