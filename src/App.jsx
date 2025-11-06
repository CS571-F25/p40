
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import About from './components/AboutMe';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
