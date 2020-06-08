import { gridSize } from './CrosswordConstants';
import Word from './Word';

export default class CrosswordPuzzle {
  private emptyCell: string = '_';
  public grid: string[][] = [];

  constructor() {
    this.grid = Array.from(Array(gridSize), () => new Array(gridSize));

    for (let row = 0; row < gridSize; row++) {
      for (let column = 0; column < gridSize; column++) {
        this.grid[row][column] = this.emptyCell;
      }
    }
  }

  public update(word: Word) {
    let updated = false;

    if (this.canBePlaced(word)) {
      this.addWord(word);
      updated = true;
    }

    return updated;
  }

  public isLetter(row: number, column: number) {
    return this.grid[row][column] !== this.emptyCell;
  }

  public getIntersections() {
    let numberOfIntersections = 0;

    for (let row = 0; row < gridSize; row++) {
      for (let column = 0; column < gridSize; column++) {
        if (this.isLetter(row, column)) {
          if (
            this.isValidPosition(row - 1, column) &&
            this.isValidPosition(row + 1, column) &&
            this.isValidPosition(row, column - 1) &&
            this.isValidPosition(row, column + 1) &&
            this.isLetter(row - 1, column) &&
            this.isLetter(row + 1, column) &&
            this.isLetter(row, column - 1) &&
            this.isLetter(row, column + 1)
          ) {
            numberOfIntersections++;
          }
        }
      }
    }

    return numberOfIntersections;
  }

  private canBePlaced(word: Word) {
    let canPlaceWord = true;

    if (this.isValidPosition(word.row, word.column) && this.fitsOnGrid(word)) {
      for (let index = 0; index < word.text.length; index++) {
        const currentRow = word.isVertical ? word.row + index : word.row;
        const currentColumn = !word.isVertical ? word.column + index : word.column;
        const currentLetter = word.text.charAt(index)
        
        const hasCurrentLetter = this.hasLetterOnPosition(currentLetter, currentRow, currentColumn);
        const isCurrentEmpty = this.isEmptyCell(currentRow, currentColumn);
        const isPlacementLegal = this.isPlacementLegal(word, currentRow, currentColumn);
        if ((hasCurrentLetter || isCurrentEmpty) && isPlacementLegal) {
          // Word can be placed
        } else {
          canPlaceWord = false;
        }
      }
    } else {
      canPlaceWord = false;
    }

    return canPlaceWord;
  }

  private isPlacementLegal(word: Word, row: number, column: number) {
    let illegal = false;

    if (word.isVertical) {
      illegal = 
        this.isInterference(row, column + 1, row + 1, column) ||
        this.isInterference(row, column - 1, row + 1, column) ||
        this.isOverwritingVerticalWord(row, column) ||
        this.isInvadingTerritory(word, row, column);
    } else {
      illegal = 
        this.isInterference(row + 1, column, row, column + 1) ||
        this.isInterference(row - 1, column, row, column + 1) ||
        this.isOverwritingHorizontalWord(row, column) ||
        this.isInvadingTerritory(word, row, column);
    }

    return !illegal;
  }

  private isInterference(row: number, column: number, nextRow: number, nextColumn: number) {
    return (
      this.isValidPosition(row, column) &&
      this.isValidPosition(nextRow, nextColumn) &&
      this.isLetter(row, column) &&
      this.isLetter(nextRow, nextColumn)
    );
  }

  private isOverwritingHorizontalWord(row: number, column: number) {
    let leftColumn = column - 1;
    return (
      this.isValidPosition(row, leftColumn) &&
      this.isLetter(row, column) &&
      this.isLetter(row, leftColumn)
    );
  }

  private isOverwritingVerticalWord(row: number, column: number) {
    let rowAbove = row - 1;
    return (
      this.isValidPosition(rowAbove, column) &&
      this.isLetter(row, column) &&
      this.isLetter(rowAbove, column)
    );
  }

  private isInvadingTerritory(word: Word, row: number, column: number) {
    const isEmpty = this.isEmptyCell(row, column);
    
    let invading = false;
    if (word.isVertical) {
      let hasNeighbors =
        this.doesCharacterExist(row, column - 1) ||
        this.doesCharacterExist(row, column + 1) ||
        (this.endOfWord(word, row, column) && this.doesCharacterExist(row + 1, column));
      
      invading = isEmpty && hasNeighbors;
    } else {
      let hasNeighbors =
        this.doesCharacterExist(row - 1, column) ||
        this.doesCharacterExist(row + 1, column) ||
        (this.endOfWord(word, row, column) && this.doesCharacterExist(row, column + 1));
      
      invading = isEmpty && hasNeighbors;
    }

    return invading;
  }

  private isEmptyCell(row: number, column: number) {
    return !this.isLetter(row, column);
  }

  private hasLetterOnPosition(letter: string, row: number, column: number) {
    return letter === this.grid[row][column];
  }

  private doesCharacterExist(row: number, column: number) {
    return this.isValidPosition(row, column) && this.isLetter(row, column);
  }

  private endOfWord(word: Word, row: number, column: number) {
    if (word.isVertical) {
      return word.row + word.text.length - 1 === row;
    } else {
      return word.column + word.text.length - 1 === column;
    }
  }

  private addWord(word: Word) {
    for (let index = 0; index < word.text.length; index++) {
      let { row, column } = word;
      if (word.isVertical) {
        row += index;
      } else {
        column += index;
      }

      this.grid[row][column] = word.text.substring(index, index + 1);
    }
  }

  private fitsOnGrid(word: Word) {
    if (word.isVertical) {
      return word.row + word.text.length <= gridSize;
    } else {
      return word.column + word.text.length <= gridSize;
    }
  }

  private isValidPosition(row: number, column: number) {
    return row >= 0 && row < gridSize && column >= 0 && column < gridSize;
  }
}
