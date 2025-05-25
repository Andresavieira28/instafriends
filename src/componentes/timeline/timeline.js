import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
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
import { FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import './timeline.css'; // Mantenha a importação do CSS
import Menu from '../menu/menu';
import Rodape from '../rodape/rodape';

const Timeline = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

  // Efeito para carregar posts
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

  // Handler para criar um novo post
  const handlePost = async () => {
    if (!newPost.trim() || !user) return;

    const randomAvatarId = Math.floor(Math.random() * 70) + 1;

    const newEntry = {
      author: user.displayName || 'Usuário Anônimo',
      avatar: user.photoURL || `https://i.pravatar.cc/50?img=${randomAvatarId}`,
      date: new Date().toLocaleDateString('pt-BR'),
      content: newPost,
      likes: 0,
      likedBy: [],
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

  // Handler para curtir/descurtir um post
  const toggleLike = async (postId) => {
    const post = posts.find(p => p.id === postId);
    const postRef = doc(db, 'posts', postId);
    const alreadyLiked = post.likedBy?.includes(user?.uid);

    const updatedLikes = alreadyLiked ? post.likes - 1 : post.likes + 1;
    const updatedLikedBy = alreadyLiked
      ? post.likedBy.filter(uid => uid !== user?.uid)
      : [...(post.likedBy || []), user?.uid];

    await updateDoc(postRef, {
      likes: updatedLikes,
      likedBy: updatedLikedBy,
    });
  };

  // Handler para deletar um post
  const handleDelete = async (id) => {
    const post = posts.find(p => p.id === id);
    if (post.uid !== user?.uid) return;

    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

  // Handler para iniciar a edição de um post
  const handleEdit = (id, content) => {
    setEditingPostId(id);
    setEditedContent(content);
  };

  // Handler para salvar a edição de um post
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
    // Reintroduzindo um container principal para gerenciar o layout de toda a página
    <div className="app-layout">
      {/* Menu no topo, ocupando 100% da largura */}
      <Menu />

      {/* Conteúdo principal da timeline, com largura controlada */}
      <div className="timeline-content-wrapper">
        <div className="post-input-container">
          <input
            className="post-input"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Escreva..."
          />
          <button className="post-button" onClick={handlePost}>Publicar</button>
        </div>

        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <img
                className="post-avatar"
                src={post.avatar}
                alt={post.author}
              />
              <div className="post-author-info">
                <strong className="post-author-name">{post.author}</strong>
                <div className="post-date">{post.date}</div>
              </div>
            </div>

            {editingPostId === post.id ? (
              <>
                <input
                  className="post-edit-input"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <button className="save-edit-button" onClick={() => saveEdit(post.id)}>
                  <FaSave /> Salvar
                </button>
              </>
            ) : (
              <div className="post-content">{post.content}</div>
            )}

            <div className="post-actions-row">
              <div className="like-group">
                <button onClick={() => toggleLike(post.id)} className="like-button">
                  {post.likedBy?.includes(user?.uid) ? (
                    <AiFillHeart color="red" size={20} />
                  ) : (
                    <AiOutlineHeart color="red" size={20} />
                  )}
                </button>
                <span className="like-count">
                  {post.likes} {post.likes !== 1 ? '' : ''}
                </span>
              </div>

              {post.uid === user?.uid && (
                <div className="post-actions">
                  <button className="edit-button" onClick={() => handleEdit(post.id, post.content)}>
                    <FaEdit />
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(post.id)}>
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Rodapé na parte inferior, ocupando 100% da largura */}
      <Rodape />
    </div>
  );
};

export default Timeline;