import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import {
  db
} from '../../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

import './timeline.css';

const Timeline = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim() || !user) return;

    const randomAvatarId = Math.floor(Math.random() * 70) + 1;

    const newEntry = {
      author: user.displayName || 'Usuário Anônimo',
      avatar: user.photoURL || `https://i.pravatar.cc/50?img=${randomAvatarId}`,
      date: new Date().toLocaleDateString('pt-BR'),
      content: newPost,
      likes: 0,
      uid: user.uid,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, 'posts'), newEntry);
      setNewPost('');
    } catch (error) {
      console.error('Erro ao salvar post:', error);
    }
  };

  const handleDelete = async (id) => {
    const post = posts.find(p => p.id === id);
    if (post.uid !== user?.uid) return;

    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

  const handleEdit = (id, content) => {
    setEditingPostId(id);
    setEditedContent(content);
  };

  const saveEdit = async (id) => {
    const post = posts.find(p => p.id === id);
    if (post.uid !== user?.uid) return;

    try {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, { content: editedContent });
      setEditingPostId(null);
      setEditedContent('');
    } catch (error) {
      console.error('Erro ao editar post:', error);
    }
  };

  return (
    <div style={{ margin: '0 auto' }}>
      <div className="input-container">
        <input
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Escreva..."
        />
        <button onClick={handlePost}>Publicar</button>
      </div>

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

          {editingPostId === post.id ? (
            <>
              <input
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{
                  width: '100%',
                  height: '80px',
                  resize: 'none',
                  marginBottom: '0.5rem',
                }}
              />
              <button onClick={() => saveEdit(post.id)}>Salvar</button>
            </>
          ) : (
            <div style={{ marginBottom: '0.5rem' }}>{post.content}</div>
          )}

          {/* Só mostra os botões se for o dono do post */}
          {post.uid === user?.uid && (
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
          )}
        </div>
      ))}
    </div>
  );
};

export default Timeline;
