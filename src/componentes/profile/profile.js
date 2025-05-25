import React from "react";
import "./profile.css";
import { auth } from "../../firebase";
import Menu from "../menu/menu"; // Ajuste o caminho se necessário
import Rodape from "../rodape/rodape"; // Ajuste o caminho se necessário

const Profile = () => {
  const user = auth.currentUser;

  // Função auxiliar para formatar datas, se existirem
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "Não disponível";
    // Firebase timestamps are usually strings or numbers (milliseconds)
    const date = new Date(timestamp);
    // Check if the date is valid before formatting
    if (isNaN(date.getTime())) {
      return "Não disponível"; // Handle invalid date
    }
    return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR");
  };

  return (
    <div className="app-layout">
      <Menu />
      <main className="timeline-content-wrapper profile-page-wrapper">
        <h1 className="profile-title">Meu Perfil</h1>
        <div className="profile-card">
          <div className="profile-header">
            <img
              src={user?.photoURL || "https://i.pravatar.cc/150?u=a042581f4e24393699b"} // Usando um avatar de exemplo melhor
              alt="Avatar do Usuário"
              className="profile-avatar"
            />
            <div className="profile-main-info">
              <h2 className="profile-name">
                {user?.displayName || "Nome não disponível"}
              </h2>
              <p className="profile-email">
                {user?.email || "Email não disponível"}
              </p>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="detail-item">
              <strong>Telefone:</strong>{" "}
              <span>{user?.phoneNumber || "Não disponível"}</span>
            </div>
            <div className="detail-item">
              <strong>Email verificado:</strong>{" "}
              <span>{user?.emailVerified ? "Sim" : "Não"}</span>
            </div>
            {/* O Firebase authentication não fornece diretamente phoneNumberVerified,
                mas se você tiver um campo customizado ou precisar exibir isso,
                mantenha a lógica. Caso contrário, pode remover. */}
            <div className="detail-item">
              <strong>Telefone verificado:</strong>{" "}
              <span>{user?.phoneNumber ? "Sim" : "Não"}</span>{" "}
              {/* Ajuste conforme sua lógica de verificação de telefone */}
            </div>
            <div className="detail-item">
              <strong>Endereço:</strong>{" "}
              <span>{user?.address || "Não disponível"}</span>{" "}
              {/* 'address' não é um campo padrão do Firebase Auth user object.
                  Se você o está obtendo de outro lugar (ex: Firestore), mantenha.
                  Caso contrário, remova ou indique que é customizado. */}
            </div>
            <div className="detail-item">
              <strong>Conta criada em:</strong>{" "}
              <span>{formatDateTime(user?.metadata.creationTime)}</span>
            </div>
            <div className="detail-item">
              <strong>Último login:</strong>{" "}
              <span>{formatDateTime(user?.metadata.lastSignInTime)}</span>
            </div>
            <div className="detail-item">
              <strong>UID:</strong> <span>{user?.uid || "Não disponível"}</span>
            </div>
            <div className="detail-item">
              <strong>Provedor:</strong>{" "}
              <span>
                {user?.providerData[0]?.providerId || "Não disponível"}
              </span>
            </div>
            <div className="detail-item">
              <strong>ID do Provedor:</strong>{" "}
              <span>{user?.providerData[0]?.uid || "Não disponível"}</span>
            </div>
          </div>
          {/* Você pode adicionar botões de ação aqui, como Editar Perfil, Sair, etc. */}
          {/* <div className="profile-actions">
            <button className="edit-profile-button">Editar Perfil</button>
            <button className="logout-button">Sair</button>
          </div> */}
        </div>
      </main>
      <Rodape />
    </div>
  );
};

export default Profile;