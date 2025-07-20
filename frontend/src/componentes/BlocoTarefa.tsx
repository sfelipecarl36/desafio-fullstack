import React from 'react';
import type { Tarefa } from '../model/tarefa'; 

interface BlocoTarefaProps {
  tarefa: Tarefa;
  onEdit: (tarefaId: string) => void;
  onDelete: (tarefaId: string) => void;
  onAvancar: (tarefaId: string, currentStatus: Tarefa['status']) => void;
  UltimaColuna: boolean;
  onClick: (tarefa: Tarefa) => void; 
}

export const BlocoTarefa: React.FC<BlocoTarefaProps> = ({
  tarefa,
  onEdit,
  onDelete,
  onAvancar,
  UltimaColuna,
  onClick 
}) => {
  const formatarData = (dataString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir a tarefa "${tarefa.titulo}"?`)) {
      onDelete(tarefa.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onEdit(tarefa.id);
  };

  const handleAvancarClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onAvancar(tarefa.id, tarefa.status);
  };

  return (
    
    <div className="kanban-bloco" onClick={() => onClick(tarefa)}>
      <div className="bloco-header">
        <h3 className="">{tarefa.titulo}</h3>
      </div>

      <div className="bloco-body">
        <p className="">{tarefa.descricao}</p>
      </div>

      <div className="bloco-footer">
        <span className="bloco-data-criacao">Criado em: {formatarData(tarefa.data_criacao || '')}</span> {/* Adicione || '' para garantir string */}
        <div className="bloco-acoes">
          {!UltimaColuna && (
            <button onClick={handleAvancarClick} className="botao-acao avancar" title="Avançar Tarefa">
              <i className="fas fa-arrow-right"></i>
            </button>
          )}
          <button onClick={handleEditClick} className="botao-acao editar" title="Editar Tarefa">
            <i className="fas fa-edit"></i>
          </button>
          <button onClick={handleDeleteClick} className="botao-acao deletar" title="Excluir Tarefa">
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};