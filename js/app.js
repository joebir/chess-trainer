class Board {
    constructor() {
        this.board = [{
                a: "♜",
                b: "♞",
                c: "♝",
                d: "♛",
                e: "♚",
                f: "♝",
                g: "♞",
                h: "♜"
            },
            {
                a: "♟",
                b: "♟",
                c: "♟",
                d: "♟",
                e: "♟",
                f: "♟",
                g: "♟",
                h: "♟"
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
                a: "♙",
                b: "♙",
                c: "♙",
                d: "♙",
                e: "♙",
                f: "♙",
                g: "♙",
                h: "♙"
            },
            {
                a: "♖",
                b: "♘",
                c: "♗",
                d: "♕",
                e: "♔",
                f: "♗",
                g: "♘",
                h: "♖"
            }
        ];
        this.space = (divIndex, newValue = null) => {
            const rankIndex = Math.floor(divIndex / 8);
            const fileArrIndex = divIndex % 8;
            const fileArr = ["a", "b", "c", "d", "e", "f", "g", "h"];
            const fileIndex = fileArr[fileArrIndex]
            if (newValue)
                this.board[rankIndex][fileIndex] = newValue;
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
            for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
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
    for (let i = 1; i <= 64; i++) {
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
    $spaceDiv.one("click", (event) => {
        const $currentTarget = $(event.currentTarget);
        $currentTarget.removeClass("highlight-space");
        $currentTarget.addClass(spaceColorClass);
    })
}


const highlightToSelect = (movesArr, notationArr) => {
    const $startDiv = $($("#board-container").children().get(movesArr[0][0]));
    const $endDiv = $($("#board-container").children().get(movesArr[0][1]));
    highlightSpace($startDiv);
    $startDiv.one("click", () => {
        highlightToMove($endDiv, movesArr, notationArr);
    });
}

const highlightToMove = ($endDiv, movesArr, notationArr) => {
    highlightSpace($endDiv);
    $endDiv.one("click", () => {
        boardMemory.move(movesArr[0]);
        const $notationLi = $("<li>").text(notationArr[0]);
        $("ol").append($notationLi);
        movesArr.shift();
        notationArr.shift();
        if (movesArr.length)
            opponentMove(movesArr, notationArr);
    })
}

const opponentMove = (movesArr, notationArr) => {
    boardMemory.move(movesArr[0]);
    const $notationLi = $($("ol").children().last());
    let notationText = `${$notationLi.text()} ${notationArr[0]}`;
    $notationLi.text(notationText);
    movesArr.shift();
    notationArr.shift();
    highlightToSelect(movesArr, notationArr);
}

const arrangeOpening = (opening) => {
    const movesArr = [];
    opening.moves.map(move => move).forEach(move => {
        const spaces = move.split(" ");
        const divIndices = [];
        spaces.forEach(spaceNotation => {
            const noPieceSpaceNotation = spaceNotation.substring(spaceNotation.length - 2);
            const splitNotation = noPieceSpaceNotation.split("");
            const rankIndex = Math.abs(parseInt(splitNotation[1]) - 8)
            const fileArr = ["a", "b", "c", "d", "e", "f", "g", "h"];
            const fileIndex = fileArr.indexOf(splitNotation[0]);
            divIndices.push(rankIndex * 8 + fileIndex);
        });
        movesArr.push(divIndices);
    });
    const notationArr = opening.notation.map(notation => notation);
    highlightToSelect(movesArr, notationArr);
}

const resetBoard = () => {
    $("#board-container").empty();
    $("ol").empty();
    $(".space").off("click");
    boardMemory = new Board;
    generateBoard();
}

$(() => {
    let openings = [{
        name: "",
        moves: [""],
        notation: [""]
    }];
    $.getJSON("openings.json", (data) => {
        openings = data;
        openings.forEach(opening => {
            const $openingButton = $("<button>").text(opening.name);
            $openingButton.addClass("opening-button");
            $("#button-container").append($openingButton);
        });

        $(".opening-button").one("click", (event) => {
            const $currentTarget = $(event.currentTarget);
            const opening = openings.find(opening => opening.name ==
                $currentTarget.text());
            arrangeOpening(opening);
            $(".opening-button").off("click");
            $(".opening-button").on("click", (event) => {
                const $currentTarget = $(event.currentTarget);
                $("#modal").show();
                nextOpening = openings.find(opening => opening.name ==
                    $currentTarget.text());
            })
        })
    })

    let nextOpening = {
        name: "",
        moves: [""],
        notation: [""]
    };
    $(".close-modal").on("click", () => $("#modal").hide());
    $("#reset-button").on("click", () => {
        resetBoard();
        arrangeOpening(nextOpening);
    })

    generateBoard();
});