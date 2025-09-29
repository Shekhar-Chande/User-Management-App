import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserList from '../src/components/userLists';
import { Navigate } from 'react-router-dom';
import './App.css'

function App() {
  return (
       <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/1" replace />} /> 
        <Route path="/dashboard/:userId" element={<UserList />} />
      </Routes>
    </Router>

  );
}

 export default App;