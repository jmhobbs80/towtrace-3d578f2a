
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { router } from './routes/routes';

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
