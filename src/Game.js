import React from "react";
import Board from "./Board.js";

export default class Game extends React.Component {
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
      reversed: false,
      coords: [],
      slicedCoords: []
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const moveCoords = [
      "(1, 1)",
      "(2, 1)",
      "(3, 1)",
      "(1, 2)",
      "(2, 2)",
      "(3, 2)",
      "(1, 3)",
      "(2, 3)",
      "(3, 3)"
    ];
    const coords = this.state.slicedCoords;
    coords.push(moveCoords[i]);

    if (calculateWinner(squares).winner || squares[i]) return;
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          winningSquares: calculateWinner(squares).winningSquares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      coords: coords
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 ? false : true,
      slicedCoords: this.state.coords.slice(0, step)
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;
    const coord = this.state.coords;

    const moves = history.map((step, move) => {
      const desc = move ? `Move # ${move} | ${coord[move - 1]}` : "Game start";
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
    status = winner
      ? `Winner: ${winner}`
      : `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningSquares={current.winningSquares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            id="toggle"
            onClick={() =>
              this.setState({ reversed: this.state.reversed ? false : true })
            }
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
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return { winner: null, winningSquares: [null, null, null] };
}
