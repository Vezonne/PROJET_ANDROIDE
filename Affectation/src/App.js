import { React } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom'; // Importez Routes depuis react-router-dom
import Accueil from './Accueil';
import ClassementProjets from './ClassementProjets';
import InfoSupp from './InfoSupp';


function App() {

  return (
    <Router>
      <div>
        <Routes default = "/" >
          <Route path="/" element={<Accueil />} />
          <Route path="/classementProjets" element={<ClassementProjets/>}/>
          <Route path="/infoSupp" element={<InfoSupp />} />
          <Route path='*' element={<Navigate replace to='/' />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
