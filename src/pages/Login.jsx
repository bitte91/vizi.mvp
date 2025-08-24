import { useState } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { toast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Cadastro iniciado. Confirme o e-mail enviado.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
      } else {
        toast('Bem-vindo(a)!');
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm space-y-4 p-6 rounded-2xl bg-slate-900/50 shadow-2xl">
        <h1 className="text-xl font-semibold">{isSignUp ? 'Criar Conta' : 'Acesso'}</h1>
        <form onSubmit={handleAuth} className="space-y-2">
          <input
            className="w-full p-3 rounded bg-slate-800"
            type="email"
            placeholder="Seu e-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 rounded bg-slate-800"
            type="password"
            placeholder="Senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500">
            {isSignUp ? 'Cadastrar' : 'Entrar'}
          </button>
          {isSignUp && <p className="text-xs opacity-80">Você receberá um e-mail para confirmar a conta.</p>}
        </form>
        <hr className="opacity-20" />
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-center text-sm text-slate-400 hover:text-slate-200"
        >
          {isSignUp ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Cadastre-se'}
        </button>
        {message && <p className="text-sm text-center h-5 text-emerald-400">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
