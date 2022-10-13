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
import SectionManagement from './pages/SectionManagement';
import SectionPermissionManagement from './pages/SectionPermissionManagement';
import RoleSection from './pages/RoleSection';
import SpeakerManagement from './pages/dictionaryManagement/SpeakerManagement';
import PrecedenceManagement from './pages/dictionaryManagement/PrecedenceManagement';
import ReceiverManagement from './pages/dictionaryManagement/ReceiverManagement';
import KeywordManagement from './pages/dictionaryManagement/KeywordManagement';

function App() {
  return (
      <div className="App container">
        <BrowserRouter>
          <Routes>
              <Route path='/login' element={<LoginForm />} />
              <Route path='/home' element={<Home />} />
              <Route path='/sections' element={<SectionManagement />} />
              <Route path='/section/:id/permissions' element={<SectionPermissionManagement />} />
              <Route path='/target' element={<TargetManagement />} />
              <Route path='/target/add' element={<TargetCreateEdit />} />
              <Route path='/target/:id/edit' element={<TargetCreateEdit />} />
              <Route path='/roles' element={<RoleManagement />} />
              <Route path='/role/:id/sections' element={<RoleSection />} />
              <Route path='/users' element={<UserManagement />} />
              <Route path='/users/create' element={<CreateUser />} />
              <Route path='/users/:id/edit' element={<CreateUser />} />
              <Route path='/users/:id/password/change' element={<PasswordChange />} />
              <Route path='/dir_mgmt/dict/listing/speaker' element={<SpeakerManagement />} />
              <Route path='/dir_mgmt/dict/listing/precedence' element={<PrecedenceManagement />} />
              <Route path='/dir_mgmt/dict/listing/receiver' element={<ReceiverManagement />} />
              <Route path='/dir_mgmt/dict/listing/keyword' element={<KeywordManagement />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
