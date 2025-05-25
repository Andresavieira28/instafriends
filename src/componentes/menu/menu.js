import React, { useState, useEffect } from "react";
import "./menu.css";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const auth = getAuth();

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleProfile = () => {
    alert("Ir para Meu Perfil");
    setIsOpen(false);
  };
  
  const navigate = useNavigate();
  const handleLogout = () => {
    setIsOpen(false);
    signOut(auth).then(() => {
      console.log("Usuário deslogado com sucesso!");
      navigate("/"); // 👈 redireciona para a rota de Form
    }).catch((error) => {
      console.error("Erro ao deslogar:", error);
    });
  };

  return (
    <div className="menu-container">
      <div className="menu-userlogado">
        {user ? (
          <div className="user-info">
            <img
              src={user.photoURL || 'https://i.pravatar.cc/40'}
              alt={user.displayName || 'Usuário'}
              className="user-avatar"
              style={{ borderRadius: '50%', width: 40, height: 40 }}
            />
            <span className="user-name" style={{ marginLeft: 10 }}>
              {user.displayName || 'Usuário Anônimo'}
            </span>
          </div>
        ) : (
          <span>Carregando usuário...</span>
        )}
      </div>

      <div className="menu-hamburguer">
        <button onClick={toggleMenu} className="menu-button" aria-label="Menu">
          &#9776;
        </button>

        {isOpen && (
          <div className="menu-dropdown">
            <button onClick={handleProfile} className="menu-item">
              Meu Perfil
            </button>
            <button onClick={handleLogout} className="menu-item">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );

}

export default Menu;
