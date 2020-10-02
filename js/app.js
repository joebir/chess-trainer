class Board {
    constructor() {
        this.board = [{
                a: " ",
                b: " ",
                c: " ",
                d: " ",
                e: " ",
                f: " ",
                g: " ",
                h: " "
            },
            {
                a: " ",
                b: " ",
                c: " ",
                d: " ",
                e: " ",
                f: " ",
                g: " ",
                h: " "
            },
            {
                a: "\u2659",
                b: "\u2659",
                c: "\u2659",
                d: "\u2659",
                e: "\u2659",
                f: "\u2659",
                g: "\u2659",
                h: "\u2659"
            },
            {
                a: "\u2656",
                b: "\u2658",
                c: "\u2657",
                d: "\u2655",
                e: "\u2654",
                f: "\u2657",
                g: "\u2658",
                h: "\u2656"
            }
        ];
        this.space = (divIndex, newValue = null) => {
            const rankIndex = Math.floor(divIndex / 8);
            const fileArrIndex = divIndex % 8;
            const fileArr = ["a", "b", "c", "d", "e", "f", "g", "h"];
            const fileIndex = fileArr[fileArrIndex]
            if (newValue)
                this.board[rankIndex][fileIndex] = newValue
            else
                return this.board[rankIndex][fileIndex];
        };
        this.move = (positions) => {
            const contents = this.space(positions[0]);
            this.space(positions[0], " ");
            this.space(positions[1], contents);
            this.displayBoard();
        };
        this.displayBoard = () => {
            $(".space").children().remove();
            for (let rankIndex = 0; rankIndex < 4; rankIndex++) {
                for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
                    const divIndex = (rankIndex * 8) + fileIndex;
                    const $contentsP = $("<p>").text(this.space(divIndex));
                    const $targetDiv = $($("#board-container").children().get(divIndex));
                    $targetDiv.append($contentsP);
                }
            }
        };
    }
}

let boardMemory = new Board;

const generateBoard = () => {
    let spaceIsWhite = true;
    for (let i = 1; i <= 32; i++) {
        const $spaceDiv = $("<div>").addClass("space");
        if (spaceIsWhite) {
            $spaceDiv.addClass("white-space");
            (i % 8 == 0) ? spaceIsWhite = true: spaceIsWhite = false;
        } else {
            $spaceDiv.addClass("black-space");
            (i % 8 == 0) ? spaceIsWhite = false: spaceIsWhite = true;
        }
        $("#board-container").append($spaceDiv);
    }
    boardMemory.displayBoard();
}

const highlightSpace = ($spaceDiv) => {
    const spaceClassArr = $spaceDiv.attr("class").split(" ");
    const spaceColorClass = spaceClassArr[1];
    $spaceDiv.removeClass(spaceColorClass);
    $spaceDiv.addClass("highlight-space");
    $spaceDiv.on("click", (event) => {
        const $currentTarget = $(event.currentTarget);
        $currentTarget.removeClass("highlight-space");
        $currentTarget.addClass(spaceColorClass);
    })
}


const highlightToSelect = (movesArr) => {
    const $startDiv = $($("#board-container").children().get(movesArr[0][0]));
    const $endDiv = $($("#board-container").children().get(movesArr[0][1]));
    highlightSpace($startDiv);
    $startDiv.on("click", () => {
        highlightToMove($endDiv, movesArr);
    });
}

const highlightToMove = ($endDiv, movesArr) => {
    highlightSpace($endDiv);
    $endDiv.on("click", () => {
        boardMemory.move(movesArr[0]);
        movesArr.shift();
        if (movesArr.length)
            highlightToSelect(movesArr);
    })
}

const arrangeOpening = (notationMovesArr) => {
    const movesArr = [];
    notationMovesArr.forEach(moveNotation => {
        const spaces = moveNotation.split(" ");
        const divIndices = [];
        spaces.forEach(spaceNotation => {
            const splitNotation = spaceNotation.split("");
            const rankIndex = Math.abs(parseInt(splitNotation[1]) - 4)
            const fileArr = ["a", "b", "c", "d", "e", "f", "g", "h"];
            const fileIndex = fileArr.indexOf(splitNotation[0]);
            divIndices.push(rankIndex * 8 + fileIndex);
        });
        movesArr.push(divIndices);
    });
    highlightToSelect(movesArr);
}

const resetBoard = () => {
    $("#board-container").empty();
    boardMemory = new Board;
    generateBoard();
}

const lopezMovesArr = ["e2 e4", "c2 c3"];

$(() => {
    generateBoard();
    $("#reset-button").on("click", resetBoard);
    $("#lopez-button").on("click", () => {
        arrangeOpening(lopezMovesArr);
    })
})