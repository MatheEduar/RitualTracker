// src/pages/PaginaConfiguracoes/index.jsx

import * as Dialog from '@radix-ui/react-dialog';
import { CaretLeft, Trash, Pencil, X } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { habitService } from '../../services/habitService';
import { EditHabitForm } from '../../components/EditHabitForm'; // <--- Importa o novo componente

export function PaginaConfiguracoes() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [habitToEdit, setHabitToEdit] = useState(null); // Armazena o hábito a ser editado

    const navigate = useNavigate();

    // Função para carregar todos os hábitos
    const fetchHabits = async () => {
        try {
            setLoading(true);
            const data = await habitService.findAllHabits();
            setHabits(data);
        } catch (error) {
            toast.error("Erro ao carregar a lista de hábitos.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    // Função para deletar um hábito (D do CRUD)
    const handleDelete = async (id, title) => {
        if (!window.confirm(`Tem certeza que deseja DELETAR o hábito "${title}" permanentemente? Todos os seus dados de progresso serão apagados.`)) {
            return;
        }

        try {
            await habitService.deleteHabit(id);
            toast.success(`Hábito "${title}" removido com sucesso.`);
            
            // Remove o hábito da lista sem recarregar a página
            setHabits(habits.filter(h => h.id !== id));
            
        } catch (error) {
            toast.error("Falha ao deletar. Tente novamente.");
            console.error(error);
        }
    };

    // Função para iniciar a edição (U do CRUD)
    const handleEditClick = (habit) => {
        setHabitToEdit(habit); // Carrega o objeto
        setIsEditModalOpen(true); // Abre o modal
    };

    // Callback para reabrir a lista após o sucesso da edição
    const handleEditSuccess = () => {
        // Recarrega a lista para que as mudanças apareçam imediatamente na tela
        fetchHabits();
    };


    return (
        <div style={{ padding: '2rem 1rem', width: '100%', maxWidth: '40rem', margin: '0 auto' }}>
            
            {/* Botão de Voltar */}
            <button 
                onClick={() => navigate('/')} 
                style={{ 
                    color: 'var(--text-secondary)', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '2rem'
                }}
            >
                <CaretLeft size={20} />
                Voltar para o Resumo
            </button>

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Gerenciar Hábitos
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                {habits.length} hábitos permanentes cadastrados.
            </p>

            {loading && <p style={{ color: 'var(--text-secondary)' }}>Carregando...</p>}

            {/* Lista de Hábitos e Ações */}
            {!loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {habits.map(habit => (
                        <div 
                            key={habit.id}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                padding: '1rem',
                                backgroundColor: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px'
                            }}
                        >
                            {/* Detalhes do Hábito */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: habit.color || 'var(--primary)' }}></div>
                                
                                <div>
                                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                                        {habit.title} 
                                        {habit.goal > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}> ({habit.goal} {habit.unit})</span>}
                                    </span>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        Categoria: {habit.category}
                                    </p>
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {/* Botão Editar */}
                                <button 
                                    onClick={() => handleEditClick(habit)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                                    title="Editar Hábito"
                                >
                                    <Pencil size={20} />
                                </button>

                                {/* Botão Deletar */}
                                <button 
                                    onClick={() => handleDelete(habit.id, habit.title)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                                    title="Deletar permanentemente"
                                >
                                    <Trash size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {/* MODAL DE EDIÇÃO (Dialog) */}
            <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay style={{ width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.75)', position: 'fixed', inset: 0, zIndex: 999 }} />

                    {/* Certifique-se que o estilo do Modal de edição está no seu CSS global/Header.module.css para ter z-index alto */}
                    <Dialog.Content 
                        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '28rem', background: 'var(--surface)', borderRadius: '12px', padding: '2.5rem 3rem', zIndex: 1000 }} 
                        aria-describedby={undefined}
                    >
                        <Dialog.Close asChild>
                            <button style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={24} aria-label="Fechar" />
                            </button>
                        </Dialog.Close>

                        <Dialog.Title style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>
                            Editar: {habitToEdit?.title}
                        </Dialog.Title>

                        {/* Renderiza o formulário de edição se houver um hábito selecionado */}
                        {habitToEdit && (
                            <EditHabitForm 
                                habit={habitToEdit} 
                                onClose={() => setIsEditModalOpen(false)}
                                onSuccess={handleEditSuccess}
                            />
                        )}
                        
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}