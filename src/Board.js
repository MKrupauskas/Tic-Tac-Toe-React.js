import React from "react";

function Square(props) {
  return (
    <button className={props.winningSquares} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default class Board extends React.Component {
  renderSquare(i, squares) {
    return (
      <Square
        winningSquares={
          squares.filter(j => j === i).length ? "square square--win" : "square"
        }
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let si = -1;

    return (
      <div>
        {Array(3)
          .fill(null)
          .map((a, i) => (
            <div key={i} className="board-row">
              {Array(3)
                .fill(null)
                .map(() => {
                  si++;
                  return this.renderSquare(si, this.props.winningSquares);
                })}
            </div>
          ))}
      </div>
    );
  }
}
