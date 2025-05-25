import React, { useState, useEffect } from "react";
import "./menu.css";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const auth = getAuth();

const Menu = () => {
  // Estado para controlar a visibilidade do menu
  const [isOpen, setIsOpen] = useState(false);
  // Estado para armazenar o usuário autenticado
  const [user, setUser] = useState(null);
  // Função para alternar a visibilidade do menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Verifica se o usuário está autenticado 
  useEffect(() => {
     
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();
  // Função para redirecionar para a página de perfil
  const handleProfile = () => {
      setIsOpen(false);
      navigate("/Profile");
  };
  // Função logout
  const handleLogout = () => {
    setIsOpen(false);
    signOut(auth)
      .then(() => {
        console.log("Usuário deslogado com sucesso!");
        navigate("/"); // 👈 redireciona para a rota de Form
      })
      .catch((error) => {
        console.error("Erro ao deslogar:", error);
      });
  };

  return (
    <div className="menu-container">
      <div className="menu-userlogado">
        {user ? (
          <div className="user-info">
            <img
              src={user.photoURL || "https://i.pravatar.cc/40"}
              alt={user.displayName || "Usuário"}
              className="user-avatar"
              style={{ borderRadius: "50%", width: 40, height: 40 }}
            />
            <span className="user-name" style={{ marginLeft: 10 }}>
              {user.displayName || "Usuário Anônimo"}
            </span>
          </div>
        ) : (
          <span>Carregando usuário...</span>
        )}
      </div>
      <div className="menu-title">
        I N S T A F R I E N D S
      </div>
      <div className="menu-hamburguer">
        <button onClick={toggleMenu} className="menu-button" aria-label="Menu">
          &#9776;
        </button>

        {isOpen && (
          <div className="menu-dropdown">
            <button onClick={handleProfile} className="menu-item">
              Minha Conta
            </button>

            <button onClick={() => navigate("/Timeline")} className="menu-item">
              Feed
            </button>

            <button onClick={() => navigate("/About")} className="menu-item">
              Sobre nós
            </button>

            <button onClick={handleLogout} className="menu-item">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
