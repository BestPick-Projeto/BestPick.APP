import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { Home } from './pages/Home/Home';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Historico } from './pages/Historico/Historico';
import { Favorito } from './pages/Favorito/Favorito';
import { RotaPrivada } from './components/RotaPrivada/RotaPrivada';
import { Cadastro } from "./pages/Cadastro/Cadastro";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/chat' element={<RotaPrivada><Home /></RotaPrivada>} />
        <Route path='/dashboard' element={<RotaPrivada><Dashboard /></RotaPrivada>} />
        <Route path='/historico' element={<RotaPrivada><Historico /></RotaPrivada>} />
        <Route path='/favoritos' element={<RotaPrivada><Favorito /></RotaPrivada>} />
        <Route path='/cadastro' element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
