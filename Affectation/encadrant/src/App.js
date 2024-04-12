import { React } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import Accueil from './Accueil';
import AjoutProjet from './AjoutProjet';

function App() {

  return (
    <Router>
      <div>
        <Routes default = "/" >
          <Route path="/" element={<Accueil />} />
          <Route path="/ajoutProjet" element={<AjoutProjet/>}/>
          <Route path='*' element={<Navigate replace to='/' />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
