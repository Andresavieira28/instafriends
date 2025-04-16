import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export default function Timeline() {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-xl text-center">
      <h1 className="text-3xl font-bold mb-4">Bem-vindo à Timeline!</h1>
      <p className="mb-6">Você está logado com sucesso.</p>
      <button
        onClick={handleLogout}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Sair
      </button>
    </div>
  );
}
