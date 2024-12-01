import Signin from './pages/Signin';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';

function App() {

  return (
      <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/home" element={<Home />} />
      </Routes>
  );
}

export default App;
