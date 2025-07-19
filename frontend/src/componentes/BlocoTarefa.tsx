import React from 'react';
import type { Tarefa } from '../model/tarefa';

interface BlocoTarefaProps { 
  tarefa: Tarefa;
  onEdit: (tarefaId: string) => void;   
  onDelete: (tarefaId: string) => void; 
}

export const BlocoTarefa: React.FC<BlocoTarefaProps> = ({ tarefa, onEdit, onDelete }) => {
  
  const formatarData = (dataString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Tem certeza que deseja excluir a tarefa "${tarefa.titulo}"?`)) {
      onDelete(tarefa.id);
    }
  };

  return (
    <div className="kanban-bloco">
      <div className="bloco-header">
        <h3 className="">{tarefa.titulo}</h3>
      </div>

      <div className="bloco-body">
        <p className="">{tarefa.descricao}</p>
        {/* <span>ID: {tarefa.id}</span>
        <span>Status: {tarefa.status}</span> */}
      </div>

      <div className="bloco-footer"> 
        <span className="bloco-data-criacao">Criado em: {formatarData(tarefa.data_criacao)}</span>
        <div className="bloco-acoes">
          
          <button onClick={() => onEdit(tarefa.id)} className="botao-acao editar" title="Editar Tarefa">
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