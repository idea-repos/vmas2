import './App.css';
import LoginForm from './components/LoginForm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import UserManagement from './pages/UserManagement';
import CreateUser from './components/CreateUser';
import PasswordChange from './pages/PasswordChange';
import RoleManagement from './pages/RoleManagement';
import TargetManagement from './pages/TargetManagement';
import TargetCreateEdit from './components/TargetCreateEdit';

function App() {
  return (
      <div className="App container">
        <BrowserRouter>
          <Routes>
              <Route path='/login' element={<LoginForm />} />
              <Route path='/home' element={<Home />} />
              <Route path='/target' element={<TargetManagement />} />
              <Route path='/target/add' element={<TargetCreateEdit />} />
              <Route path='/target/:id/edit' element={<TargetCreateEdit />} />
              <Route path='/roles' element={<RoleManagement />} />
              <Route path='/users' element={<UserManagement />} />
              <Route path='/users/create' element={<CreateUser />} />
              <Route path='/users/:id/edit' element={<CreateUser />} />
              <Route path='/users/:id/password/change' element={<PasswordChange />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
