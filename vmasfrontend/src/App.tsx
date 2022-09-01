import './App.css';
import LoginForm from './components/LoginForm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import UserManagement from './pages/UserManagement';
import CreateUser from './components/CreateUser';

function App() {
  return (
      <div className="App container">
        <BrowserRouter>
          <Routes>
              <Route path='/login' element={<LoginForm />} />
              <Route path='/home' element={<Home />} />
              <Route path='/users' element={<UserManagement />} />
              <Route path='/users/create' element={<CreateUser />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
