import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importez Routes depuis react-router-dom
import Accueil from './Accueil';
import ClassementProjets from './ClassementProjets';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path = "/classementProjets" element={<ClassementProjets/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
