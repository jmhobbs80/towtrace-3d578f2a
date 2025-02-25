
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { router } from './routes/routes';
import { RouterProvider } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
