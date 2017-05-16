// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

type SquareProp = {
    value : String,
    onClick() : void
}

function Square(props : SquareProp) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calculateWinner(squares : Array<string>): string {
    // Lines contains all possible winning combinations
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
        //  Pattern match abc to an array within lines
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return '';
}

class Board extends React.Component {
    renderSquare(index : number) : Square {
        return (
            <Square
                value={this.props.squares[index]}
                onClick={() => this.props.onClick(index)}
            />);
    }

    renderRow(start : number) : Array<Square> {
        let row = []
        const end = start + 3

        while(start < end) {
            row.push(this.renderSquare(start));
            start++
        }
        return row;
    }

    render() : React$Element<any> {
        return (
            <div>
                <div className="board-row">
                    {this.renderRow(0)}
                </div>
                <div className="board-row">
                    {this.renderRow(3)}
                </div>
                <div className="board-row">
                    {this.renderRow(6)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[this.state.stepNumber];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat(
            [{
                squares: squares
            }]
        ),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
        const desc = move ?
            'Move #' + move :
            'Game start';
        return (
                    <li key={move}>
                        <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                    </li>
                );
            });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}


ReactDOM.render(<Game/>, document.getElementById('root'));
