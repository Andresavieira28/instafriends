import './form.css';  // Importa o arquivo de estilos CSS para o componente.
import { useState } from 'react';  // Importa o hook useState do React para gerenciar o estado.
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';  // Importa funções do Firebase para autenticação.
import { app } from '../../firebase';  // Importa a instância do app Firebase configurado.
import { useNavigate } from 'react-router-dom';  // Importa o hook useNavigate do react-router-dom para navegação.
import { FaGoogle } from 'react-icons/fa';  // Importa o ícone do Google da biblioteca react-icons.

export default function Form() {
  const auth = getAuth(app);  // Obtém a instância de autenticação do Firebase.
  const navigate = useNavigate();  // Inicializa o hook de navegação para redirecionar o usuário.

  // Declaração de estados do componente.
  const [email, setEmail] = useState('');  // Estado para armazenar o email do usuário.
  const [password, setPassword] = useState('');  // Estado para armazenar a senha do usuário.
  const [error, setError] = useState(null);  // Estado para armazenar mensagens de erro.
  const [loading, setLoading] = useState(false);  // Estado que indica se a requisição está carregando.
  const [isRegistering, setIsRegistering] = useState(false);  // Estado que determina se o usuário está criando uma conta ou fazendo login.

  // Função para lidar com o login de email e senha.
  const handleEmailLogin = async (e) => {
    e.preventDefault();  // Impede o comportamento padrão do formulário (recarregar a página).
    setError(null);  // Limpa qualquer erro anterior.
    setLoading(true);  // Inicia o carregamento.
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);  // Tenta autenticar o usuário com o email e senha fornecidos.
      console.log('Usuário logado:', userCredential.user);  // Exibe o usuário autenticado no console.
      navigate('/dashboard');  // Redireciona para o dashboard após o login.
    } catch (err) {
      console.error(err);  // Exibe o erro no console.
      setError('Falha no login. Verifique o email e a senha.');  // Exibe uma mensagem de erro para o usuário.
    } finally {
      setLoading(false);  // Finaliza o carregamento.
    }
  };

  // Função para lidar com o registro de novo usuário.
  const handleRegister = async (e) => {
    e.preventDefault();  // Impede o comportamento padrão do formulário.
    setError(null);  // Limpa qualquer erro anterior.
    setLoading(true);  // Inicia o carregamento.
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);  // Tenta criar um novo usuário.
      console.log('Usuário registrado:', userCredential.user);  // Exibe o usuário registrado no console.
      navigate('/dashboard');  // Redireciona para o dashboard após o registro.
    } catch (err) {
      console.error(err);  // Exibe o erro no console.
      setError('Erro ao criar conta. Verifique os dados.');  // Exibe uma mensagem de erro para o usuário.
    } finally {
      setLoading(false);  // Finaliza o carregamento.
    }
  };

  // Função para lidar com o login via Google.
  const handleGoogleLogin = async () => {
    setError(null);  // Limpa qualquer erro anterior.
    setLoading(true);  // Inicia o carregamento.
    const provider = new GoogleAuthProvider();  // Cria uma instância do provedor Google.
    try {
      const result = await signInWithPopup(auth, provider);  // Tenta autenticar o usuário com o login do Google.
      console.log('Usuário logado com Google:', result.user);  // Exibe o usuário autenticado no console.
      navigate('/dashboard');  // Redireciona para o dashboard após o login com Google.
    } catch (err) {
      console.error(err);  // Exibe o erro no console.
      setError('Falha no login com Google.');  // Exibe uma mensagem de erro para o usuário.
    } finally {
      setLoading(false);  // Finaliza o carregamento.
    }
  };

  // JSX que renderiza o formulário de login ou registro.
  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-xl shadow-md">  {/* Contêiner do formulário com estilo. */}
      <h2 className="text-2xl font-bold mb-4">
        {isRegistering ? 'Criar Conta' : 'Login'}  {/* Exibe o título conforme o estado: criar conta ou login. */}
      </h2>
      <form onSubmit={isRegistering ? handleRegister : handleEmailLogin} className="space-y-4">  {/* Formulário que chama a função de login ou registro. */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}  // Atualiza o estado do email conforme o usuário digita.
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}  // Atualiza o estado da senha conforme o usuário digita.
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}  // Desabilita o botão enquanto está carregando.
        >
          {loading ? (isRegistering ? 'Criando...' : 'Entrando...') : (isRegistering ? 'Criar Conta' : 'Entrar com Email')}  {/* Exibe o texto do botão conforme o estado (carregando ou não). */}
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
            onClick={() => setIsRegistering(!isRegistering)}  // Alterna o estado para registro ou login.
          >
            {isRegistering ? 'Fazer Login' : 'Criar Conta'}  {/* Texto do botão que alterna entre login e registro. */}
          </button>
        </p>
      </div>

      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}  {/* Exibe a mensagem de erro, se houver. */}
    </div>
  );
}
