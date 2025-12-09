import * as Dialog from '@radix-ui/react-dialog';
import { Plus, X, Gear } from 'phosphor-react'; // <--- Importe o Gear
import { useState } from 'react';
import { Link } from 'react-router-dom'; // <--- Importe o Link
import { NewHabitForm } from '../NewHabitForm';
import styles from './Header.module.css';

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.header}>
      {/* LOGO E TÍTULO */}
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Ritual<span style={{ color: '#8B5CF6' }}>Tracker</span>
      </div>
      
      {/* Botões de Ação */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        
        {/* LINK PARA CONFIGURAÇÕES (AGORA FUNCIONAL) */}
        <Link 
            to="/config" // Aponta para a rota definida no App.jsx
            style={{ color: 'var(--text-secondary)' }} 
            title="Gerenciar Hábitos / Configurações"
        >
            <Gear size={24} weight="bold" />
        </Link>
        
        {/* MODAL EXISTENTE (NOVO HÁBITO) */}
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
            
            <Dialog.Trigger asChild>
                <button type="button" className={styles.newHabitButton}>
                    <Plus size={20} className={styles.icon} />
                    Novo Hábito
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />

                <Dialog.Content className={styles.content} aria-describedby={undefined}>
                    <Dialog.Close className={styles.closeButton}>
                        <X size={24} aria-label="Fechar" />
                    </Dialog.Close>

                    <Dialog.Title className={styles.title}>
                        Criar Hábito
                    </Dialog.Title>

                    <Dialog.Description style={{ display: 'none' }}>
                        Utilize o formulário abaixo para registrar um novo hábito, definir sua recorrência, categoria e meta.
                    </Dialog.Description>

                    <NewHabitForm onClose={() => setIsModalOpen(false)} />
                    
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
      </div> {/* Fecha div Botões de Ação */}
    </div>
  )
}