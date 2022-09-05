import './App.css';
import LoginForm from './components/LoginForm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import UserManagement from './pages/UserManagement';
import CreateUser from './components/CreateUser';
import PasswordChange from './pages/PasswordChange';
import RoleManagement from './pages/RoleManagement';

function App() {
  return (
      <div className="App container">
        <BrowserRouter>
          <Routes>
              <Route path='/login' element={<LoginForm />} />
              <Route path='/home' element={<Home />} />
              <Route path='/users' element={<UserManagement />} />
              <Route path='/roles' element={<RoleManagement />} />
              <Route path='/users/create' element={<CreateUser />} />
              <Route path='/users/:id/edit' element={<CreateUser />} />
              <Route path='/users/:id/password/change' element={<PasswordChange />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
