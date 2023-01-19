import React from 'react';
import './App.css';
import AppRoutes from './components/Routes/Routes';
import { useIsAuthenticated } from '@azure/msal-react';
import SpinLoader from './components/SpinLoader/SpinLoader';
import { QueryClientProvider, QueryClient } from 'react-query';

export const UserContext = React.createContext('');

function App() {
  const isAuthenticated = useIsAuthenticated();

  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 30000,
        enabled: isAuthenticated
      },
    },
  });

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     const {user} = useUsers();
  //   }

  // }, [isAuthenticated]);


  // if(user.isLoading) {
  //   return <SpinLoader />
  // }

  return (
    <div className="App">
      {/* <UserContext.Provider value={user.data}> */}
        <QueryClientProvider client={client}>
          <AppRoutes />
        </QueryClientProvider>
      {/* </UserContext.Provider> */}
    </div>
  );
}

export default App;
