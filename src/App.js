
// import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import AdminInterface from './Components/AdminInterface';
import 'bootstrap/dist/css/bootstrap.min.css';
const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>

        <AdminInterface />
      </div>
    </QueryClientProvider>
  );
}

export default App;
