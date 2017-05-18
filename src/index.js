// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

type SquareProp = {
    value : String,
    onClick() : void
}

type History = {
    squares : Array<string>
}

function Square(props): React$Element<any> {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calculateWinner(squares : Array<string>): string {
    // Lines contains all possible winning combinations
    const lines: Array<number[]> = [
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
                key={index}
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

    state: {
        history: Array<History>,
        stepNumber: number,
        xIsNext: boolean
    } =
         {
            history: [
                {
                    squares: Array(9).fill('')
                }
            ],
            stepNumber: 0,
            xIsNext: true,
        }


    handleClick(i : number): void {
      const history : Array<History> = this.state.history.slice(0, this.state.stepNumber + 1);
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

    // This updates state to a previous version
    jumpTo(step : number): void {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        });
    }

    render() : React$Element<any> {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moveHistory = history.map((step : Object, move : number) => {
            const description = move ? 'Move #' + move : 'Game start';
            return (
                        <li key={move}>
                            <a href="#" onClick={() => this.jumpTo(move)}>{description}</a>
                        </li>
                    );
        });

        let status : string;
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
                    <ol>{moveHistory}</ol>
                </div>
            </div>
        );
    }
}


ReactDOM.render(<Game/>, document.getElementById('root'));
