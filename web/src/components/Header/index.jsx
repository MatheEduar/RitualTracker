// src/components/Header/index.jsx

import { useState } from 'react'; 
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, X } from 'phosphor-react';
import { NewHabitForm } from '../NewHabitForm';
import styles from './Header.module.css';

// Se você não tiver logo, pode usar texto como fizemos antes
// import logoImage from '../../assets/logo.svg'; 

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.header}>
      {/* LOGO (Texto estilizado) */}
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Ritual<span style={{ color: '#8B5CF6' }}>Tracker</span>
      </div>
      
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        
        <Dialog.Trigger asChild>
          <button type="button" className={styles.newHabitButton}>
            <Plus size={20} className={styles.icon} />
            Novo Hábito
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />

          <Dialog.Content className={styles.content}>
            <Dialog.Close className={styles.closeButton}>
              <X size={24} aria-label="Fechar" />
            </Dialog.Close>

            <Dialog.Title className={styles.title}>Criar Hábito</Dialog.Title>

            <NewHabitForm onClose={() => setIsModalOpen(false)} />
            
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}