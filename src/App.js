
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from './components/navbar/Navbar';
import RoutesPage from './RoutesPage';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <RoutesPage />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
