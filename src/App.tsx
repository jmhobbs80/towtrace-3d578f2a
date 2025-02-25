
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { routes } from './routes/routes';

function AppRoutes() {
  return useRoutes(routes);
}

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
