import './form.css';  // Importa o arquivo de estilos CSS para o componente.
import { useState } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import Rodape from '../rodape/rodape';

export default function Form() {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuário logado:', userCredential.user);
      navigate('/timeline');
    } catch (err) {
      console.error(err);
      setError('Falha no login. Verifique o email e a senha.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuário registrado:', userCredential.user);
      navigate('/timeline');
    } catch (err) {
      console.error(err);
      setError('Erro ao criar conta. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Usuário logado com Google:', result.user);
      navigate('/timeline');
    } catch (err) {
      console.error(err);
      setError('Falha no login com Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pagina-container">
      <div className="form-container max-w-sm mx-auto p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          {isRegistering ? 'Criar Conta' : 'Login Instafriends'}
        </h2>
        <form onSubmit={isRegistering ? handleRegister : handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (isRegistering ? 'Criando...' : 'Entrando...') : (isRegistering ? 'Criar Conta' : 'Entrar com Email')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="ou-centralizado">ou</p>
          <button
            onClick={handleGoogleLogin}
            className="w-full mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading}
          >
            <FaGoogle
              style={{
                color: '#fff',
                width: '20px',
                height: '20px',
              }}
            />
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm">
            {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Fazer Login' : 'Criar Conta'}
            </button>
          </p>
        </div>

        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      </div>
      <Rodape />
    </div>
  );
}
