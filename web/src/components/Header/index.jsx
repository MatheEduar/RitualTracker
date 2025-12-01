import styles from './Header.module.css';
import { Plus } from 'phosphor-react';

export function Header() {
  return (
    <header className={styles.header}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Ritual<span style={{ color: '#8B5CF6' }}>Tracker</span>
      </div>

      <button type="button" className={styles.newHabitButton}>
        <Plus size={20} className={styles.icon} />
        Novo Hábito
      </button>
    </header>
  )
}