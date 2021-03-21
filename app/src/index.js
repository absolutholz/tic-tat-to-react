import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
  return (
    <button
      className={ `square${ props.highlight ? ' square--highlight' : ''}` }
      onClick={ props.onClick }
    >
      { props.value }
    </button>
  );
}

function HistoryButton (props) {
  const text = props.mark ? <div>{ props.mark } @ column: { props.position.column }, row: { props.position.row }</div> : '';
  return (
    <button
      onClick={ props.onClick }
      style={ props.isSelectedMove ? { fontWeight: 'bold' } : {} }
    >
      { props.desc }
      { text }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={ this.props.squares[i] }
        onClick={() => this.props.onClick(i)}
        key={ i }
        highlight={ this.props.highlights.includes(i) }
      />
    );
  }

  renderRow (iRow) {
    return [0,1,2].map((iCol) => this.renderSquare((iRow * 3) + iCol));
  }

  renderRows () {
    return [0,1,2].map((i) => <div className="board-row" key={ i }>{ this.renderRow(i) }</div>);
  }

  render() {
    return (
      <div>
        { this.renderRows() }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        mark: squares[i],
        position: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      historyDirection: 0,
    });
  }

  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleDirection () {
    this.state.historyDirection = this.state.historyDirection === 0 ? 1 : 0;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    // const historyClone = [...history];

    // if (this.state.historyDirection) {
    //   historyClone.reverse();
    // }

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${ move }` :
        'Go to game start';
      const position = {
        column: (step.position % 3) + 1,
        row: (Math.floor(step.position / 3)) + 1
      };
      return (
        <li key={ move }>
          <HistoryButton
            onClick={ () => this.jumpTo(move) }
            desc={ desc }
            mark={ step.mark }
            position={ position }
            isSelectedMove={ this.state.stepNumber === move }
          />
        </li>
      );
    });

    let status;
    let highlights = [];
    if (winner) {
      status = `Winner: ${ winner.mark }`;
      highlights = winner.positions;
    } else {
      if (history.length > 9) {
        status = "It's a draw!";
      } else {
        status = `Next player: ${ this.state.xIsNext ? 'X' : 'O' }`;
      }
    }

    return (
      <div>
        <div className="game">
          <div className="game-board">
            <Board
              squares={ current.squares }
              highlights={ highlights }
              onClick={(i) => this.handleClick(i) }
            />
          </div>
          <div className="game-info">
            <div>{ status }</div>
          </div>
        </div>
        <div>
          <h2>History
            <button onClick={ () => this.toggleDirection() }>
              <svg width="24" weight="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.78,7C9.08,7.04 10,7.53 10.57,8.46C11.13,9.4 11.41,10.56 11.39,11.95C11.4,13.5 11.09,14.73 10.5,15.62C9.88,16.5 8.95,16.97 7.71,17C6.45,16.96 5.54,16.5 4.96,15.56C4.38,14.63 4.09,13.45 4.09,12C4.09,10.55 4.39,9.36 5,8.44C5.59,7.5 6.5,7.04 7.78,7M7.75,8.63C7.31,8.63 6.96,8.9 6.7,9.46C6.44,10 6.32,10.87 6.32,12C6.31,13.15 6.44,14 6.69,14.54C6.95,15.1 7.31,15.37 7.77,15.37C8.69,15.37 9.16,14.24 9.17,12C9.17,9.77 8.7,8.65 7.75,8.63M13.33,17V15.22L13.76,15.24L14.3,15.22L15.34,15.03C15.68,14.92 16,14.78 16.26,14.58C16.59,14.35 16.86,14.08 17.07,13.76C17.29,13.45 17.44,13.12 17.53,12.78L17.5,12.77C17.05,13.19 16.38,13.4 15.47,13.41C14.62,13.4 13.91,13.15 13.34,12.65C12.77,12.15 12.5,11.43 12.46,10.5C12.47,9.5 12.81,8.69 13.47,8.03C14.14,7.37 15,7.03 16.12,7C17.37,7.04 18.29,7.45 18.88,8.24C19.47,9 19.76,10 19.76,11.19C19.75,12.15 19.61,13 19.32,13.76C19.03,14.5 18.64,15.13 18.12,15.64C17.66,16.06 17.11,16.38 16.47,16.61C15.83,16.83 15.12,16.96 14.34,17H13.33M16.06,8.63C15.65,8.64 15.32,8.8 15.06,9.11C14.81,9.42 14.68,9.84 14.68,10.36C14.68,10.8 14.8,11.16 15.03,11.46C15.27,11.77 15.63,11.92 16.11,11.93C16.43,11.93 16.7,11.86 16.92,11.74C17.14,11.61 17.3,11.46 17.41,11.28C17.5,11.17 17.53,10.97 17.53,10.71C17.54,10.16 17.43,9.69 17.2,9.28C16.97,8.87 16.59,8.65 16.06,8.63M9.25,5L12.5,1.75L15.75,5H9.25M15.75,19L12.5,22.25L9.25,19H15.75Z" />
              </svg>
            </button>
          </h2>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return {
        mark: squares[a],
        positions: lines[i],
      };
    }
  }
  return null;
}
