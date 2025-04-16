
import React, { useState } from 'react'; // Importa o React e o hook useState para gerenciamento de estado
import { getAuth } from 'firebase/auth';// Importa a função getAuth do Firebase para autenticação do usuário
import { db } from '../../firebase'; // ajuste o caminho para seu arquivo firebase.js
import { collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect } from 'react';


// Importa o CSS personalizado da timeline
import './timeline.css';

// Componente funcional principal chamado Timeline
const Timeline = () => {
  // Estado que armazena os posts
  const [posts, setPosts] = useState([]);

  // Estado para armazenar o conteúdo de um novo post
  const [newPost, setNewPost] = useState('');

  // Estado para controlar qual post está sendo editado (pelo ID)
  const [editingPostId, setEditingPostId] = useState(null);

  // Estado para armazenar o novo conteúdo durante a edição de um post
  const [editedContent, setEditedContent] = useState('');

  // Obtém o usuário autenticado do Firebase
  const auth = getAuth();
  const user = auth.currentUser;

  // Função para printar todoso os posts que já estão no firestore
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });
  
    return () => unsubscribe(); // limpar o listener quando desmontar
  }, []);

  // Função para criar e adicionar um novo post
  const handlePost = async () => {
    if (!newPost.trim() || !user) return;
  
    const randomAvatarId = Math.floor(Math.random() * 70) + 1;
  
    const newEntry = {
      author: user.displayName || 'Usuário Anônimo',
      avatar: user.photoURL || `https://i.pravatar.cc/50?img=${randomAvatarId}`,
      date: new Date().toLocaleDateString('pt-BR'),
      content: newPost,
      likes: 0,
      uid: user.uid, // útil se quiser filtrar por usuário depois
      createdAt: new Date(),
    };
  
    try {
      const docRef = await addDoc(collection(db, 'posts'), newEntry);
      setPosts([{ id: docRef.id, ...newEntry }, ...posts]); // adiciona ao estado
      setNewPost('');
    } catch (error) {
      console.error('Erro ao salvar post:', error);
    }
  };
  

  // Função para deletar um post
  const handleDelete = (id) => {
    // Remove o post cujo ID corresponde ao passado
    setPosts(posts.filter((post) => post.id !== id));
  };

  // Função para iniciar a edição de um post
  const handleEdit = (id, content) => {
    setEditingPostId(id); // Define qual post está sendo editado
    setEditedContent(content); // Preenche o conteúdo atual no campo de edição
  };

  // Função para salvar as alterações de um post editado
  const saveEdit = (id) => {
    // Atualiza o conteúdo do post editado
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, content: editedContent } : post
      )
    );

    // Reseta os estados de edição
    setEditingPostId(null);
    setEditedContent('');
  };

  return (
    <div style={{ margin: '0 auto' }}>
      {/* Campo de input e botão para criar um novo post */}
      <div className="input-container">
        <input
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)} // Atualiza o estado com o texto digitado
          placeholder="Escreva..."
        />
        <button onClick={handlePost}>Publicar</button> {/* Chama a função para publicar */}
      </div>

      {/* Lista de posts renderizados dinamicamente */}
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        >
          {/* Cabeçalho com avatar, autor e data */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}
          >
            <img
              src={post.avatar}
              alt={post.author}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '0.5rem',
              }}
            />
            <div>
              <strong>{post.author}</strong>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                {post.date}
              </div>
            </div>
          </div>

          {/* Área de conteúdo do post ou campo de edição, se estiver editando */}
          {editingPostId === post.id ? (
            <>
              <input
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)} // Atualiza o conteúdo editado
                style={{
                  width: '100%',
                  height: '80px',
                  resize: 'none',
                  marginBottom: '0.5rem',
                }}
              />
              <button onClick={() => saveEdit(post.id)}>Salvar</button> {/* Salva a edição */}
            </>
          ) : (
            <div style={{ marginBottom: '0.5rem' }}>{post.content}</div>
          )}

          {/* Botões de editar e excluir */}
          <div>
            <button onClick={() => handleEdit(post.id, post.content)}>
              Editar
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              style={{ marginLeft: '0.5rem' }}
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Exporta o componente Timeline para uso em outros arquivos
export default Timeline;
