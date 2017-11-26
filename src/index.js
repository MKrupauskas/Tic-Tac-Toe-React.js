import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className={props.y}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, x) {
    return (
      <Square
        y={x.filter(
          (j) => { return j === i }).length ?
          "square square--win" :
          "square"}
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let i = -1, si = -1;
    const rows = Array(3).fill(null).map(() => {
      i++;
      return <div key={i} className="board-row">
        {Array(3).fill(null).map(() => {
          si++;
          return this.renderSquare(si, this.props.x);
        })}
      </div>

    });
    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          winningSquares: Array(3).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      reversed: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          winningSquares: calculateWinner(squares).winningSquares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 ? false : true
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;

    const moves = history.map((step, move) => {
      const desc = move ? `Move # ${move}` : "Game start";
      const link = `#${move}`;
      return (
        <li key={move}>
          <a href={link} onClick={() => this.jumpTo(move)}>
            {this.state.stepNumber === move ? <b>{desc}</b> : desc}
          </a>
        </li>
      );
    });

    let status;
    status = winner ? `Winner: ${winner}` : `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            x={current.winningSquares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            onClick={() =>
              this.setState({ reversed: this.state.reversed ? false : true })}
          >
            Toggle Order
          </button>
          <ol>{this.state.reversed ? moves.reverse() : moves}</ol>
          <button onClick={() => this.jumpTo(0)}>Restart Game</button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { "winner": squares[a], "winningSquares": [a, b, c] };
    }
  }
  return { "winner": null, "winningSquares": [null, null, null] };
}

ReactDOM.render(<Game />, document.getElementById("root"));
