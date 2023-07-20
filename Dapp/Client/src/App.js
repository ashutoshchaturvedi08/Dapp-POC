import logo from './logop.png';
import './App.css';

import Metamask from './Componantes/Metamask.js';
import USDTApproval from './Componantes/Approve';


function App() {
  return (
<div className='main'>
    <div className='header'>
      <h1>Join The Presale 
      </h1>
      <h1>XYZ Token (XYZ)</h1>
      <img src={logo} className="App-logo" alt="logo" />

      <Metamask/>
  
    </div>

    <div className='App'>
     
      <USDTApproval/>

    </div>

   </div>
  );
}

export default App;
