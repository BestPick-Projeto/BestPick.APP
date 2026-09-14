import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { Home } from './pages/Home/Home';
import { RotaPrivada } from './components/RotaPrivada/RotaPrivada';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<RotaPrivada><Home /></RotaPrivada>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
