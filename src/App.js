import './App.css';
import { Authenticator } from "@aws-amplify/ui-react";
import React from "react";
import '@aws-amplify/ui-react/styles.css'
import CompanyView from "./CompanyView";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
          <QueryClientProvider client={queryClient}>
            <div className="App">
              <h1>Interview Tracking for {user.username}</h1>
              <CompanyView />
              <button onClick={signOut}>Sign Out</button>
            </div>
          </QueryClientProvider>)
      }
    </Authenticator>
  );
}

export default App;
