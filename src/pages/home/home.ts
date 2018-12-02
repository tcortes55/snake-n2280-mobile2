import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { COLORS, CONTROLS, BOARD_WIDTH, BOARD_HEIGHT } from './constants';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  // styleUrls: ['home.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvents($event)'
  }
})
// export class HomePage {

//   constructor(public navCtrl: NavController) {

//   }

// }
// import { Component } from '@angular/core';
// import { COLORS, CONTROLS, BOARD_WIDTH, BOARD_HEIGHT } from './app.constants';

// @Component({
//   selector: 'snake-n2280',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
//   host: {
//     '(document:keydown)': 'handleKeyboardEvents($event)'
//   }
// })
export class HomePage {
  title = 'snake-n2280';

  private interval: number;
  private tempDirection: number;

  public gameStarted: boolean = false;
  public gameOver: boolean = false;

  public board = [];
  public score = 0;

  private snake = {
    direction: CONTROLS.LEFT,
    parts: [
      {
        // Initially it is not displayed
        x: -1,
        y: -1
      }
    ]
  };

  private fruit = {
    // Initially it is not displayed
    x: -1,
    y: -1
  };


  constructor() {
    this.setBoard();
  }

  setDirection(newDir: any): void {
    if (newDir === CONTROLS.LEFT && this.snake.direction != CONTROLS.RIGHT) {
      this.tempDirection = CONTROLS.LEFT;
    } else if (newDir === CONTROLS.UP && this.snake.direction != CONTROLS.DOWN) {
      this.tempDirection = CONTROLS.UP;
    } else if (newDir === CONTROLS.RIGHT && this.snake.direction != CONTROLS.LEFT) {
      this.tempDirection = CONTROLS.RIGHT;
    } else if (newDir === CONTROLS.DOWN && this.snake.direction != CONTROLS.UP) {
      this.tempDirection = CONTROLS.DOWN;
    } 
  }

  handleKeyboardEvents(e: KeyboardEvent) {
    this.setDirection(e.keyCode);
  }

  setColors(col: number, row: number): string {
    if (this.fruit.x === row && this.fruit.y === col) {
      return COLORS.FRUIT;
    } else if (this.snake.parts[0].x === row && this.snake.parts[0].y === col) {
      return COLORS.SNAKE_HEAD;
    } else if (this.board[col][row] === true) {
      return COLORS.SNAKE_BODY;
    }

    return COLORS.BOARD;
  };


  // VERSÃO CLARA
  // isHead(col: number, row: number): boolean {
  //   if (this.snake.parts[0].x === row && this.snake.parts[0].y === col) {
  //     return true;
  //   }

  //   return false;
  // };
  
  // isFood(col: number, row: number): boolean {
  //   if (this.fruit.x === row && this.fruit.y === col) {
  //     return true;
  //   }

  //   return false;
  // };

  fruitCollision(part: any): boolean {
    return (part.x === this.fruit.x && part.y === this.fruit.y);
  }

  selfCollision(part: any): boolean {
    return (this.board[part.y][part.x] === true);
  }

  eatFruit(): void {
    this.score++;

    let newTail = Object.assign({}, this.snake.parts[this.snake.parts.length - 1]);

    this.snake.parts.push(newTail);
    this.resetFruit();
  }

  updatePositions(): void {
    let newHead = this.repositionHead();
    let me = this;

    this.headTransition(newHead);
    if (this.selfCollision(newHead))
    {
      this.gameOver = true;

      setTimeout(() => {
        this.gameOver = false;
        this.gameStarted = false;
      }, 3000);

      return;
    };

    if (this.fruitCollision(newHead))
    {
      this.eatFruit();
    }

    let lastPart = this.snake.parts.pop();
    this.board[lastPart.y][lastPart.x] = false;

    this.snake.parts.unshift(newHead);
    this.board[newHead.y][newHead.x] = true;

    this.snake.direction = this.tempDirection;

    setTimeout(() => {
      me.updatePositions();
    }, this.interval);
  }

  repositionHead(): any {
    let newHead = Object.assign({}, this.snake.parts[0]);

    if (this.tempDirection === CONTROLS.LEFT) {
      newHead.x -= 1;
    } else if (this.tempDirection === CONTROLS.RIGHT) {
      newHead.x += 1;
    } else if (this.tempDirection === CONTROLS.UP) {
      newHead.y -= 1;
    } else if (this.tempDirection === CONTROLS.DOWN) {
      newHead.y += 1;
    }

    return newHead;
  }

  headTransition(part: any): void {
    if (part.x === BOARD_WIDTH) {
      part.x = 0;
    } else if (part.x === -1) {
      part.x = BOARD_WIDTH - 1;
    }

    if (part.y === BOARD_HEIGHT) {
      part.y = 0;
    } else if (part.y === -1) {
      part.y = BOARD_HEIGHT - 1;
    }
  }

  resetFruit(): void {
    let x = this.randomWidth();
    let y = this.randomHeight();

    if (this.board[y][x] === true || (x === this.fruit.x && y === this.fruit.y))
    {
      return this.resetFruit();
    }

    this.fruit = {
      x: x,
      y: y
    }
  }

  // Aux
  randomHeight(): any {
    return Math.floor(Math.random() * BOARD_HEIGHT);
  }
  
  randomWidth(): any {
    return Math.floor(Math.random() * BOARD_WIDTH);
  }

  
  // Preparing the game
  setBoard(): void {
    this.board = [];

    for (let i = 0; i < BOARD_HEIGHT; i++) {
      this.board[i] = [];
      for (let j = 0; j <  BOARD_WIDTH; j++)
      {
        this.board[i][j] = false; // indicates that the snake is not currently in this location
      }
    }

  }

  //
  newGame(): void {
    this.setBoard();
    this.gameStarted = true;
    this.score = 0;
    this.interval = 150;
    this.tempDirection = CONTROLS.LEFT;
    this.snake = {
      direction: CONTROLS.LEFT,
      parts: []
    }

    for (let i = 0; i < 3; i++)
    {
      this.snake.parts.push({ x: BOARD_WIDTH/2 + i, y: Math.floor(BOARD_HEIGHT/2)})
    }

    this.resetFruit();
    this.updatePositions();
    
    
  }
}