import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


  function Square(props) {
    return (
      <button className={'square ' + (props.isWinning ? 'square--winning' : null)} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null)
        }],
        stepNumber: 0,
        xIsNext: true
      };
    }

    renderSquare(i) {
      return (
        <Square 
          isWinning={this.props.winningSquares.includes(i)}
          key={"square " + i}  
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)} 
        />
      );
    }

    // render squares then 1 row 3 column render rows
    // in render rows push render squares in this

    renderSquares(n) {
      let squares = [];
      for(let i = n; i < n + 3; i++) {
        squares.push(this.renderSquare(i));
      }

      return squares;
    }

    renderRows(i) {
      return (
        <div className="board-row">
            {this.renderSquares(i)}
        </div>
      );
    }

    render() {
      return (
        <div>
           {this.renderRows(0)}
           {this.renderRows(3)}
           {this.renderRows(6)}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null)
        }],
        stepNumber: 0,
        xIsNext: true
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }
    
    jumpTo(step) {
      this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0, 
      });
    }


    render() {   
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
          const desc = move ? 'Go to move #' + move: 'Go to game start';
          // 3. Bold the currently selected item in the move list.
          // let className;
          // if(move === this.state.stepNumber) {
          //   className = "currentMove";
          // }
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{move == this.state.stepNumber ? <b>{desc}</b> : desc}</button>
            </li>
          );
      });
      // 6. When no one wins, display a message about the result being a draw.
      // check stepNumber if stepNumber is max but no one win, will show message draw
      let status;
      if (winner) {
        status = 'Winner: ' + winner.player;
       
      } else if (this.state.stepNumber !== 9) {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      } else {
        status = 'Draw';
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              winningSquares={winner ? winner.line : []}
              squares={current.squares} 
              onClick={(i) => this.handleClick(i) }
            />
          </div>
          <div className="game-info">
            <div className="status">{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {player: squares[a], line: lines[i]};
      }
    }
    return null;
  }
  
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
