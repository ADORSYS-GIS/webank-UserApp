import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './router';

const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />

      <Toaster
        position='top-center'
        richColors
        toastOptions={{
          duration: 2000,
          className:
            'px-4 py-3 rounded-lg text-sm shadow-sm w-full animation-slideDown',
        }}
      />
    </>
  );
};

export default App;
