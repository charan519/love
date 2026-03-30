import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useCouple } from './hooks/useCouple';
import { AuthPage } from './components/Auth/AuthPage';
import { CouplePairing } from './components/Couple/CouplePairing';
import { Dashboard } from './components/Dashboard/Dashboard';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { couple, loading: coupleLoading } = useCouple();

  if (authLoading || coupleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (!couple || couple.status !== 'active') {
    return <CouplePairing />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
