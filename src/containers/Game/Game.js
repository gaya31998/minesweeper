import React, {Component} from 'react';
import {confirmAlert} from 'react-confirm-alert';
import './Game.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import bomb from './../../assets/bomb.svg';
import flag from './../../assets/flag2.png';

class Game extends Component {
	constructor(props) {
		super(props);
		let obj = null;
		let box =0,i=0,j=0,mines=0;
		if(props.level===0) {
			box = 8;
			mines = 8;
		}else if(props.level===1) {
			box = 10;
			mines = 10;
		}else if(props.level===2) {
			box = 12;
			mines = 12;
		}
		let arr=[];
		for(i=0;i<box;i++){
          arr[i] = [];
		}
		for(i=0;i<box;i++) {
			for(j=0;j<box;j++) {
				obj = {
					data: 0,
					showData: ''
				}
				arr[i][j]=obj;
			}
		}
		this.counter=null;
		this.state= {
			level: props.level,
			boxes: box,
			mines: mines,
			started: false,
			identifiedMines: 0,
			identifiedNumbers: 0,
			timer: {
				minutes: 0,
				seconds: 0,
			},
			boxState : arr
		};
		
	}

	incrementTimer=()=> {
	  let min = this.state.timer.minutes;
	  let sec = this.state.timer.seconds;
	  ++sec;
	  if(sec===60) {
	  	sec = 0;
	  	min = ++min;
	  }
	  this.setState({
	  	timer: {
	  		minutes: min,
	  		seconds: sec
	  	}
	  });
	}

	restart=()=> {
		let obj = null;
		let box =this.state.boxes;
		let i=0,j=0;
		let arr=[];
		for(i=0;i<box;i++){
          arr[i] = [];
		}
		for(i=0;i<box;i++) {
			for(j=0;j<box;j++) {
				obj = {
					data: 0,
					showData: ''
				}
				arr[i][j]=obj;
			}
		}
		this.setState({
			started: false,
			identifiedMines: 0,
			identifiedNumbers: 0,
			timer: {
				minutes: 0,
				seconds: 0,
			},
			boxState : arr
		});
	}

	componentDidUpdate=(prevProps,prevState)=> {
	}

	setBoxState=(xpos,ypos)=> {
		this.counter = setInterval(()=>this.incrementTimer(),1000);
		let i=0,x,y;
		let sarr=[...this.state.boxState];
		while(i<this.state.mines) {
             x = Math.floor(Math.random() * this.state.boxes);
             y = Math.floor(Math.random() * this.state.boxes);
             if(!((x===xpos)&&(y===ypos))) {
                if(sarr[x][y].data===0) {
                 sarr[x][y].data='X';
                 this.setNumber(sarr,x,y);
                 ++i;
               } 
             }
		}
		this.setState({
			started: true,
			boxState: sarr
		});
	    this.clickHandler(xpos,ypos);
	}

	setNumber=(arr,x,y) =>{
		let num;
		let i=0,j=0;
		let xarr = [x], yarr=[y];
		if(x-1>=0) {
			xarr.push(x-1);
		}
		if(x+1<this.state.boxes) {
			xarr.push(x+1);
		}
		if(y-1>=0) {
			yarr.push(y-1);
		}
		if(y+1<this.state.boxes) {
			yarr.push(y+1);
		}
		let xlimit = xarr.length, ylimit = yarr.length;
		for(i=0;i<xlimit;i++) {
			for(j=0;j<ylimit;j++) {
				if(!((xarr[i]===x)&&(yarr[j]===y))) {
					num = arr[xarr[i]][yarr[j]].data;
					if(num!=='X'){
                       arr[xarr[i]][yarr[j]].data = ++num;
					}
				}
			}
		}
	}

	clickHandler=(x,y)=> {
	  let arr = [...this.state.boxState];
	  let element = arr[x][y].data;
	  let numbers = this.state.identifiedNumbers;
	  let i=0, j=0;
	  if((element!=='X')&&(element!==0)) {
          arr[x][y].showData=element;
          ++numbers;
	  } else if(element==='X') {
	  	 clearInterval(this.counter);
         for(i=0;i<this.state.boxes;i++) {
         	for(j=0;j<this.state.boxes;j++) {
         		if(arr[i][j].data==='X'){
         			arr[i][j].showData=<img src={bomb} alt='X' height='100%' width='100%' />;
         		}
         	}
         }
         confirmAlert({
            title: 'Oops! Game Over!',
            message: 'Try again?',
            buttons: [
            {
               label: 'Yes',
               onClick: () => this.restart()
            },{
            	label: 'Cancel',
            	onClick: null
            }
           ]
        });
	  }
	  else{
        this.openEmptyCells(arr,x,y);
	  }
	  this.setState({
	  	identifiedNumbers: numbers,
	  	boxState: arr
	  });
	}

	openEmptyCells=(arr,x,y)=> {
		if((arr[x][y].data!=='X')&&(arr[x][y].data!==0)) {
			arr[x][y].showData = arr[x][y].data;
			return true;
		} else if((arr[x][y].data===0)&&(arr[x][y].showData!==' ')){
			arr[x][y].showData = ' ';
            let i=0,j=0;
		    let xarr = [x], yarr=[y];
		    if(x-1>=0) {
		  	   xarr.push(x-1);
		    }
		    if(x+1<this.state.boxes) {
			  xarr.push(x+1);
		    }
		    if(y-1>=0) {
			  yarr.push(y-1);
		    }
		    if(y+1<this.state.boxes) {
			  yarr.push(y+1);
		    }
		    let xlimit = xarr.length, ylimit = yarr.length;
		    for(i=0;i<xlimit;i++) {
			  for(j=0;j<ylimit;j++) {
				if((xarr[i]===x)&&(yarr[j]===y)) {
                    continue;
                 }
                 else{
					this.openEmptyCells(arr,xarr[i],yarr[j]);
				}
			  }
		    }
	    }
	}

	flagHandler=(event,x,y)=> {
	   event.preventDefault();
       let minesFound = this.state.identifiedMines;
       let arr = [...this.state.boxState];
         if(arr[x][y].showData==='') {
          arr[x][y].showData  = 'F';
         if(arr[x][y].data==='X') {
       	  ++minesFound;
         }
       } else if(arr[x][y].showData==='F') {
       	 arr[x][y].showData='';
       }
       this.setState({
       	 identifiedMines : minesFound,
       	 boxState: arr
        });
    }

    showInitialButtons=(x,y)=> {
    	return <button className='ButtonCells' onClick={()=>this.setBoxState(x,y)}></button>;
    }

	showButtons=(x,y,data)=> {
		return <button className='ButtonCells' onClick={()=>this.clickHandler(x,y)} onContextMenu={(event)=>this.flagHandler(event,x,y)}>{data}</button>;
	}


	render() {
	let boxes = this.state.boxes*this.state.boxes;
	let mines = this.state.mines;
	let minesFound = this.state.identifiedMines;
	let numbersFound = this.state.identifiedNumbers;
	let timer = null;
	let cellstyle=null;
	   let min = this.state.timer.minutes;
	   let sec = this.state.timer.seconds;
	   if(sec<10) {
	   	sec = '0'+sec;
	   }
	   if(min<10) {
          min = '0'+min;
	   }
	 timer = <span className='Timer'>{min} : {sec}</span>;
	if((numbersFound===boxes-mines)||(minesFound===mines)){
		clearInterval(this.counter);
		confirmAlert({
            title: 'Congratulations! You have won!',
            message: 'Time taken: '+ min+':'+sec+' \nStart a New Game?',
            buttons: [
            {
               label: 'Yes',
               onClick: () => this.props.restart()
            },{
            	label: 'Cancel',
            	onClick: null
            }
           ]
        });
	}
	   let tablerows = [], tablecells = [];
	   let cell = null;
	   let i=0,j=0;
	   let showFlag = <img src={flag} alt='F' width='100%' height='100%' />;
	   for(i=0;i<this.state.boxes;i++) {
	   	tablecells = [];
	   	for(j=0;j<this.state.boxes;j++) {
	   		if(this.state.started===false) {
	   			cell = this.showInitialButtons(i,j);
	   		}
	   		else if(this.state.boxState[i][j].showData===''){
	   			cell = this.showButtons(i,j,this.state.boxState[i][j].showData);
	   		} 
            else if(this.state.boxState[i][j].showData==='F') {
            	cell = this.showButtons(i,j,showFlag);
            }
	   		else {
	   			cell = this.state.boxState[i][j].showData;
	   		}
           tablecells.push(<td className='cells' style={cellstyle}>{cell}</td>);
	   	}
	   	tablerows.push(
	   	<tr>
	   	{tablecells}
	   	</tr>
	   	);
	   }

	   
	  return (
       <div className="Game">
       <div className="Header">
       <img src={bomb} alt='X' width='30px' height='30px'/>
       {this.state.mines}
       {timer}
       </div>
       <table className='GameTable'>
       <tbody>
       {tablerows}
       </tbody>
       </table>
       </div>
      );
	}
  
}

export default Game;
