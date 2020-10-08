class Board {
    constructor() {
        if (this.constructor === Board) {
            throw "Can't instantiate the abstract class Board";
        }
        this.board = {
            rank8: {
                a: "♜",
                b: "♞",
                c: "♝",
                d: "♛",
                e: "♚",
                f: "♝",
                g: "♞",
                h: "♜"
            },
            rank7: {
                a: "♟",
                b: "♟",
                c: "♟",
                d: "♟",
                e: "♟",
                f: "♟",
                g: "♟",
                h: "♟"
            },
            rank6: {
                a: " ",
                b: " ",
                c: " ",
                d: " ",
                e: " ",
                f: " ",
                g: " ",
                h: " "
            },
            rank5: {
                a: " ",
                b: " ",
                c: " ",
                d: " ",
                e: " ",
                f: " ",
                g: " ",
                h: " "
            },
            rank4: {
                a: " ",
                b: " ",
                c: " ",
                d: " ",
                e: " ",
                f: " ",
                g: " ",
                h: " "
            },
            rank3: {
                a: " ",
                b: " ",
                c: " ",
                d: " ",
                e: " ",
                f: " ",
                g: " ",
                h: " "
            },
            rank2: {
                a: "♙",
                b: "♙",
                c: "♙",
                d: "♙",
                e: "♙",
                f: "♙",
                g: "♙",
                h: "♙"
            },
            rank1: {
                a: "♖",
                b: "♘",
                c: "♗",
                d: "♕",
                e: "♔",
                f: "♗",
                g: "♘",
                h: "♖"
            }
        }
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
        this.space = (divIndex, newValue = null) => {
            throw "Abstract method call!";
        }
    }
}

class WhiteBoard extends Board {
    constructor() {
        super();
        this.space = (divIndex, newValue = null) => {
            const rankNum = Math.abs(Math.floor(divIndex / 8) - 8);
            const rank = `rank${rankNum}`
            const fileArrIndex = divIndex % 8;
            const fileArr = ["a", "b", "c", "d", "e", "f", "g", "h"];
            const file = fileArr[fileArrIndex]
            if (newValue)
                this.board[rank][file] = newValue;
            else
                return this.board[rank][file];
        };
    }
}

class BlackBoard extends Board {
    constructor() {
        super();
        this.space = (divIndex, newValue = null) => {
            const rankNum = Math.floor(divIndex / 8) + 1;
            const rank = `rank${rankNum}`
            const fileArrIndex = divIndex % 8;
            const fileArr = ["h", "g", "f", "e", "d", "c", "b", "a"];
            const file = fileArr[fileArrIndex]
            if (newValue)
                this.board[rank][file] = newValue;
            else
                return this.board[rank][file];
        };
    }
}

let boardMemory = null;

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
        updateNotation(notationArr[0]);
        movesArr.shift();
        notationArr.shift();
        if (movesArr.length)
            opponentMove(movesArr, notationArr);
        else
            finishOpening();
    })
}

const opponentMove = (movesArr, notationArr) => {
    setTimeout(() => {
        boardMemory.move(movesArr[0]);
        updateNotation(notationArr[0]);
        movesArr.shift();
        notationArr.shift();
        highlightToSelect(movesArr, notationArr);
    }, 1000)
}

const updateNotation = (notation) => {
    if ($("ol").children().length) {
        const $lastNotationLine = $($("ol").children().last());
        const currentText = $lastNotationLine.text();
        if (currentText.includes(" "))
            addNotationLine(notation);
        else
            $lastNotationLine.text(`${currentText} ${notation}`);
    } else
        addNotationLine(notation);
}

const addNotationLine = (notation) => {
    const $notationLi = $("<li>").text(notation);
    $("ol").append($notationLi);
}

const arrangeOpening = (opening) => {
    const movesArr = opening.moves.map(move => move);
    const notationArr = opening.notation.map(notation => notation);
    if (opening.isWhite) {
        boardMemory = new WhiteBoard();
        boardMemory.displayBoard();
        highlightToSelect(movesArr, notationArr);
    } else {
        boardMemory = new BlackBoard();
        boardMemory.displayBoard();
        opponentMove(movesArr, notationArr);
    }
}

const finishOpening = () => {
    const $endMessage = $("<h3>").text("End of Opening");
    $("#moves-sidebar").append($endMessage)
}

const resetBoard = () => {
    $("#board-container").empty();
    $("ol").empty();
    $("#moves-sidebar").children().last().remove();
    $(".space").off("click");
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
            if (opening.isWhite)
                $openingButton.addClass("white-opening");
            else
                $openingButton.addClass("black-opening");
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