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
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
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
      likedBy: [], // <- novo campo
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

  const toggleLike = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!user || !post) return;

    const hasLiked = post.likedBy?.includes(user.uid);
    const updatedLikedBy = hasLiked
      ? post.likedBy.filter(uid => uid !== user.uid)
      : [...(post.likedBy || []), user.uid];

    const updatedLikes = updatedLikedBy.length;

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likedBy: updatedLikedBy,
        likes: updatedLikes,
      });
    } catch (error) {
      console.error('Erro ao atualizar like:', error);
    }
  };

  return (
    <div className="timeline-container">
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

          <div className="post-footer">
            <div className="like-group">
              <button onClick={() => toggleLike(post.id)} className="like-button">
                {post.likedBy?.includes(user?.uid) ? (
                  <AiFillHeart color="red" size={20} />
                ) : (
                  <AiOutlineHeart color="red" size={20} />
                )}
              </button>

              <span>{post.likes} curtida{post.likes !== 1 ? 's' : ''}</span>
            </div>

            {post.uid === user?.uid && (
              <div className="action-group">
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
  );
};

export default Timeline;
