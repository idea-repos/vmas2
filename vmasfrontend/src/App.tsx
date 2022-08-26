import './App.css';
import LoginForm from './components/LoginForm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
      <div className="App container">
        <BrowserRouter>
          <Routes>
            <Route path='/login'  element={<LoginForm />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
