import './password.css';
import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Password = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Email de redefinição de senha enviado com sucesso.');
    } catch (error) {
      setMessage(`Erro ao enviar o email: ${error.message}`);
    }
  };

  return (
    // app-layout para a página inteira, seguindo o padrão
    <div className="layout-reset">
      {/* O container centralizado para o formulário de redefinição */}
      <div className="reset-password-card">
        <h2 className="reset-password-title">Redefinir Senha</h2>
        <form onSubmit={handleResetPassword} className="reset-password-form">
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="reset-password-input"
          />
          <button type="submit" className="reset-password-button"> {/* Nova classe para o botão */}
            Enviar Email de Redefinição
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        <button onClick={() => navigate("/")} className="reset-password-back-button"> {/* Nova classe para o botão SAIR */}
          VOLTAR
        </button>
      </div>
    </div>
  );
};

export default Password;