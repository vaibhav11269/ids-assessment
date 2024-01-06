import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Routes from "./Routes"
import './App.css';
import UserState from './context/UserState';

function App() {
  return (
    <UserState>
      <Router>
        <Routes />
      </Router>
    </UserState>
  );
}

export default App;
