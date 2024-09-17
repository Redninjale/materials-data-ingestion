import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import ContentForm from './_components/InputBar';
import SideBar from './_components/SideBar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  
  return (
    <div className="App">
      <header className="App-header flex-row">
        < SideBar />
        < ContentForm />
      </header>
    </div>
  );
}

export default App;
