import './App.css';
import { Authenticator } from "@aws-amplify/ui-react";
import React from "react";
import '@aws-amplify/ui-react/styles.css'

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
          <div className="App">
            <h1>Hello, {user.username}</h1>
            <p>You are now authenticated.</p>
            <button onClick={signOut}>Sign Out</button>
          </div>)
      }
    </Authenticator>
  );
}

export default App;
