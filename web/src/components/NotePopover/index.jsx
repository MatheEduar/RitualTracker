import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import { NotePencil, X } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { habitService } from '../../services/habitService';
import styles from './NotePopover.module.css';

export function NotePopover({ habitId, date, currentNote, onNoteUpdated }) {
  const [note, setNote] = useState(currentNote || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setNote(currentNote || '');
  }, [currentNote]);

  const hasNote = note && note.trim().length > 0;

  async function handleSave(e) {
    e?.preventDefault();
    setIsOpen(false);

    try {
      await habitService.updateNote(habitId, date, note);
      if (onNoteUpdated) onNoteUpdated(habitId, note);
      toast.success('Nota salva!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar nota.');
    }
  }

  // FUNÇÃO MANUAL PARA FECHAR
  function handleClose(e) {
    e.stopPropagation(); // Impede que o clique passe para baixo
    e.preventDefault();
    setIsOpen(false); // FORÇA O FECHAMENTO
  }

  const TriggerButton = (
    <Popover.Trigger 
      className={clsx(styles.trigger, {
        [styles.triggerActive]: hasNote
      })}
    >
      <NotePencil size={20} weight={hasNote ? "fill" : "regular"} />
    </Popover.Trigger>
  );

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            {TriggerButton}
          </Tooltip.Trigger>
          
          {hasNote && !isOpen && (
            <Tooltip.Portal>
              <Tooltip.Content className={styles.tooltipContent} sideOffset={5}>
                {note}
                <Tooltip.Arrow className={styles.arrow} />
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </Tooltip.Root>
      </Tooltip.Provider>

      <Popover.Portal>
        <Popover.Content 
          className={styles.content} 
          side="right" 
          sideOffset={5}
        >
          {/* BOTÃO X MANUAL */}
          <button 
            type="button"
            className={styles.closeButton} 
            onClick={handleClose}
            title="Fechar sem salvar"
          >
            <X size={16} weight="bold" />
          </button>
          
          <label style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>
            Diário de Bordo
          </label>

          <textarea 
            className={styles.textarea}
            placeholder="Como foi a execução deste hábito hoje?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            autoFocus 
          />

          <button 
            type="button" 
            className={styles.saveButton} 
            onClick={handleSave}
          >
            Salvar Nota
          </button>

          <Popover.Arrow className={styles.arrow} width={11} height={5} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}