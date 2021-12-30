import './App.css';
import { Authenticator } from "@aws-amplify/ui-react";
import React from "react";
import '@aws-amplify/ui-react/styles.css'
import CompanyView from "./CompanyView";

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
          <div className="App">
            <h1>Interview Tracking for {user.username}</h1>
            <CompanyView />
            <button onClick={signOut}>Sign Out</button>
          </div>)
      }
    </Authenticator>
  );
}

export default App;
