import './App.css';
import { Authenticator } from "@aws-amplify/ui-react";
import React from "react";
import '@aws-amplify/ui-react/styles.css'
import NotesView from "./NotesView";

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
          <div className="App">
            <h1>Hello, {user.username}</h1>
            <p>You are now authenticated.</p>
            <button onClick={signOut}>Sign Out</button>
            <NotesView />
          </div>)
      }
    </Authenticator>
  );
}

export default App;
