import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import './timeline.css';

const Timeline = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

  const handlePost = () => {
    if (!newPost.trim() || !user) return;

    const randomAvatarId = Math.floor(Math.random() * 70) + 1;

    const newEntry = {
      id: Date.now(),
      author: user.displayName || 'Usuário Anônimo',
      avatar: user.photoURL || `https://i.pravatar.cc/50?img=${randomAvatarId}`,
      date: new Date().toLocaleDateString('pt-BR'),
      content: newPost,
      likes: 0,
    };

    setPosts([newEntry, ...posts]);
    setNewPost('');
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleEdit = (id, content) => {
    setEditingPostId(id);
    setEditedContent(content);
  };

  const saveEdit = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, content: editedContent } : post
      )
    );
    setEditingPostId(null);
    setEditedContent('');
  };

  return (
    <div style={{margin: '0 auto' }}>
      {/* Container para o input e o botão */}
      <div className="input-container">
        <input
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Escreva..."
        />
        <button onClick={handlePost}>Publicar</button>
      </div>

      {/* Lista de posts */}
      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <img
              src={post.avatar}
              alt={post.author}
              style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '0.5rem' }}
            />
            <div>
              <strong>{post.author}</strong>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>{post.date}</div>
            </div>
          </div>

          {editingPostId === post.id ? (
            <>
              <input
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{ width: '100%', height: '80px', resize: 'none', marginBottom: '0.5rem' }}
              />
              <button onClick={() => saveEdit(post.id)}>Salvar</button>
            </>
          ) : (
            <div style={{ marginBottom: '0.5rem' }}>{post.content}</div>
          )}

          <div>
            <button onClick={() => handleEdit(post.id, post.content)}>Editar</button>
            <button onClick={() => handleDelete(post.id)} style={{ marginLeft: '0.5rem' }}>Excluir</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;