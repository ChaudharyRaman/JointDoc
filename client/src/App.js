import Editor from './components/Editor';
import {Routes,Route, useNavigate, Navigate} from 'react-router-dom'
import {v4 as uuidV4} from 'uuid'

function App() {
  const navigate = useNavigate();
  return (
    <Routes >
     <Route path="/" element={ <Navigate to={`/documents/${uuidV4()}`}/> } />
      <Route  path="/documents/:id" element={<Editor />} />
    </Routes>
  );
}

export default App;
