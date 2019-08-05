import React,{useState} from 'react';
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './App.css';
import Game from './containers/Game/Game';


const App=()=>{
  const [level,setLevel] = useState(null); 
  let content;
  if(level===null) {
  	confirmAlert({
            title: '',
            message: 'Select a level',
            buttons: [
            {
               label: 'Easy',
               onClick: () => setLevel(0)
            },
            {
               label: 'Medium',
               onClick: () => setLevel(1)
            },{

               label: 'Hard',
               onClick: () => setLevel(2)
            }
           ]
        });
  } else {
  	content = <Game level={level} restart={()=>setLevel(null)}/>
  }
  return (
    <div className="App">
    <div className='Title'>
    <h2 className='TitleHeader'>MINESWEEPER</h2>
    </div>
    {content}
    </div>
  );
}

export default App;
