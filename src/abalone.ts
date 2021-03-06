///<reference path="../typings/lodash/lodash.d.ts" />
///<reference path="hex.ts" />
module Abalone {
export module Engine {

    export interface GameRules {
        boardRadius           : number;
        maxPiecesPerMove      : number;
        movesUntilTie         : number;
    }

    export interface GameState {
        rules      : GameRules;
        blackPieces: Hex.AxialCoordinate[];
        whitePieces: Hex.AxialCoordinate[];
        nextPlayer : Player
        turnCounter: number;
    }

    export interface Move {
        direction: Direction;
        pieces   : Hex.AxialCoordinate[];
    }

    export enum Direction {
        NORTHEAST,
        EAST,
        SOUTHEAST,
        SOUTHWEST,
        WEST,
        NORTHWEST,
    }

    export enum Player {
        WHITE,
        BLACK,
    }

    export enum Outcome {
        ONGOING,
        WHITE  ,
        BLACK  ,
        TIE    ,
    }

    interface PieceMap {[stringifiedAxialCoordinate: string]: Player;} // useful representation: map from coordinate to which player controls that space


    function getPieceMap(gs: GameState): PieceMap {
        var pm: PieceMap = {};
        gs.blackPieces.forEach((c: Hex.AxialCoordinate) => pm[c.toString()] = Player.BLACK);
        gs.whitePieces.forEach((c: Hex.AxialCoordinate) => pm[c.toString()] = Player.WHITE);
        return pm;
    }

    export function outcome(gs: GameState): Outcome {
        if (gs.turnCounter > gs.rules.movesUntilTie) return Outcome.TIE;
        if (gs.blackPieces.length === 0)             return Outcome.WHITE;
        if (gs.whitePieces.length === 0)             return Outcome.BLACK;
        return Outcome.ONGOING;
    }

    function getAdjacentCoord(c: Hex.AxialCoordinate, d: Direction): Hex.AxialCoordinate {
        return null;
        // pass
    }

    function isWithinBoardBoundaries(c: Hex.AxialCoordinate, r: GameRules) {
        return Hex.distanceToOrigin(c) <= r.boardRadius;
    }

    export function isValid(move: Move, gs: GameState): boolean {
        if (move.pieces.length === 0) return true; // can always pass
        if (move.pieces.length > gs.rules.maxPiecesPerMove) return false;
        var pieceMap = getPieceMap(gs);
        // verify each piece exists and is owned by the right player
        if (move.pieces.some((c: Hex.AxialCoordinate) => pieceMap[c.toString()] !== gs.nextPlayer)) return false; 
        

        function adjacentSpaceIsAvailable(c: Hex.AxialCoordinate): boolean {
            var nextSpace = getAdjacentCoord(c, move.direction);
            return isWithinBoardBoundaries(nextSpace, gs.rules) && pieceMap[nextSpace.toString()] === undefined;
        }

        if (!Hex.isLine(move.pieces)) return false; 

        // var piecesAlignment = getAlignment(move.pieces);
        // if (piecesAlignment == null) return false; // pieces were not in a line :(
        // var isAStraightMove = piecesAlignment === decomposeDirection(move.direction).alignment;
        // if (isAStraightMove) {
        //     // do the stragith move stuff
        // } else {
        //     return move.pieces.every(adjacentSpaceIsAvailable);
        // }
        return false;

    }
}
}