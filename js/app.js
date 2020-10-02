const generateBoard = () => {
    let spaceIsWhite = true;
    for(let i = 1; i <= 32; i++) {
        const $spaceDiv = $("<div>").addClass("space");
        if(spaceIsWhite) {
            $spaceDiv.addClass("white-space");
            (i % 8 == 0) ? spaceIsWhite = true : spaceIsWhite = false;
        } else {
            $spaceDiv.addClass("black-space");
            (i % 8 == 0) ? spaceIsWhite = false : spaceIsWhite = true;
        }
        $spaceDiv.on("click", (event) => {
            const $currentTarget = $(event.currentTarget);
            highlightSpace($currentTarget);
        })
        if(i >= 17)
            addPiece(i, $spaceDiv);
        $("#board-container").append($spaceDiv);
    }
}

const addPiece = (index, $spaceDiv) => {
    const $spaceP = $("<p>");
    if(index < 25)
        $spaceP.text("\u2659");
    else if(index == 25 || index == 32)
        $spaceP.text("\u2656");
    else if(index == 26 || index == 31)
        $spaceP.text("\u2658");
    else if(index == 27 || index == 30)
        $spaceP.text("\u2657");
    else if(index == 28)
        $spaceP.text("\u2655");
    else
        $spaceP.text("\u2654");
    $spaceDiv.append($spaceP);
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
        $currentTarget.on("click", (event) => {
            const $futureTarget = $(event.currentTarget);
            highlightSpace($futureTarget);
        })
    })
}

const resetBoard = () => {
    $("#board-container").empty();
    generateBoard();
}

$(() => {
    generateBoard();
    $("#reset-button").on("click", resetBoard);
})