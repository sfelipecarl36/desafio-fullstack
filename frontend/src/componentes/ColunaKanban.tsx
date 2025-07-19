
import React from 'react';
import type { Tarefa, TarefaStatus } from '../model/tarefa';
import { BlocoTarefa } from './BlocoTarefa'

interface KanbanColumnProps {
  title: string;
  status: TarefaStatus;
  tarefas: Tarefa[];
  onEdit: (tarefaId: string) => void;  
  onDelete: (tarefaId: string) => void;
  onAvancar: (tarefaId: string, currentStatus: Tarefa['status']) => void;
  UltimaColuna: boolean;
}

export const ColunaKanban: React.FC<KanbanColumnProps> = ({ title, status, tarefas, onEdit, onDelete, onAvancar, UltimaColuna  }) => {
  return (
    <div className="kanban-column">
      <div className="column-header">
      <h2 className="">{title}</h2>
      <h3>{tarefas.length}</h3>
      </div>
      <div className="">
        {tarefas.length > 0 ? (
          tarefas.map((tarefa) => (
            <BlocoTarefa 
             key={tarefa.id}
             tarefa={tarefa}
             onEdit={onEdit}  
             onDelete={onDelete}
             onAvancar={onAvancar} 
             UltimaColuna={UltimaColuna}
              />
          ))
        ) : (
          <p className="">Nenhuma tarefa neste status.</p>
        )}
      </div>
    </div>
  );
};