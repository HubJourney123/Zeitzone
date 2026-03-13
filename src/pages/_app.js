import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import CartDrawer from '../components/CartDrawer';
import { useRouter } from 'next/router';

function Layout({ children }) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen">
      {!isAdmin && <Navbar />}
      <main className={!isAdmin ? 'pt-14 pb-20' : ''}>
        {children}
      </main>
      {!isAdmin && <BottomNav />}
      {!isAdmin && <CartDrawer />}
    </div>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster position="top-center" />
      </CartProvider>
    </ThemeProvider>
  );
}
