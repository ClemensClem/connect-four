(function () {
    var currentPlayer = "player1";
    var currentPlayerCoinColor = "coinPlayer1";
    var topElements = [0, 6, 12, 18, 24, 30, 36];
    var bottomElements = [5, 11, 17, 23, 29, 35, 41];
    var countPlayer1 = 0;
    var countPlayer2 = 0;
    var allSlots = $(".slot");
    var allCoins = $(".coin");
    var replay = $("#replayButton");

    //Playing a round --> inserting coin Player-X
    $(".column").on("click", function (e) {
        var col = $(e.currentTarget);
        var slotsInColumn = col.children(); //col.find('.slot');
        var slotsInRow;
        var myId;

        for (var i = 5; i >= 0; i--) {
            if (
                !slotsInColumn.eq(i).hasClass("player1") &&
                !slotsInColumn.eq(i).hasClass("player2")
            ) {
                // lowest empty slot found!
                slotsInColumn.eq(i).addClass(currentPlayer);
                slotsInColumn
                    .eq(i)
                    .children(".coin")
                    .addClass(currentPlayerCoinColor + " drop");
                myId = parseInt(slotsInColumn.eq(i).attr("id")); //assigning the id of the very slot
                slotsInRow = $(".row" + i); //selector for slots in the row
                break;
            }
        }

        if (i < 0) {
            return;
            //column is full
        }

        //calling victory function
        if (checkForVictory(slotsInColumn)) {
            victoryCounter(myId);
            displayVictoryDialog();
            return;
        } else if (checkForVictory(slotsInRow)) {
            victoryCounter(myId);
            displayVictoryDialog();
            return;
        } else {
            //Checking diagonal +/-5
            var diagonal5 = getDiagonalElemens(
                myId,
                -5,
                bottomElements
            ).reverse();
            diagonal5 = $.merge(diagonal5, [$("#" + myId)]);
            diagonal5 = $.merge(
                diagonal5,
                getDiagonalElemens(myId, +5, topElements)
            ); //check if there is a method to add to the end of an array in jQuery

            if (checkForVictoryPlainVanilla(diagonal5)) {
                victoryCounter(myId);
                displayVictoryDialog();
                return;
            }

            //Checking diagonal +/- 7
            var diagonal7 = getDiagonalElemens(myId, -7, topElements).reverse();
            diagonal7 = $.merge(diagonal7, [$("#" + myId)]);
            diagonal7 = $.merge(
                diagonal7,
                getDiagonalElemens(myId, +7, bottomElements)
            ); //check if there is a method to add to the end of an array in jQuery

            if (checkForVictoryPlainVanilla(diagonal7)) {
                victoryCounter(myId);
                displayVictoryDialog();
                return;
            }
        }

        switchPlayer();
    });

    //Checking for victory
    function checkForVictory(slotsToCheck) {
        var count = 0;
        for (var i = 0; i < slotsToCheck.length; i++) {
            if (slotsToCheck.eq(i).hasClass(currentPlayer)) {
                count++;
                if (count == 4) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
    }

    //Checking for victory Plain Vanilla
    function checkForVictoryPlainVanilla(slotsToCheck) {
        var count = 0;
        for (var i = 0; i < slotsToCheck.length; i++) {
            if (slotsToCheck[i].hasClass(currentPlayer)) {
                // the "[i]" makes the difference somehow between jQuery and Plain Vanilla JS
                count++;
                if (count == 4) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
    }

    //Collecting the diagonal elements:
    function getDiagonalElemens(startElemement, stepwide, endElements) {
        var output = [];
        var currentElement = startElemement;
        while (!endElements.includes(currentElement)) {
            currentElement += stepwide;
            var myElement = $("#" + currentElement + "." + currentPlayer);
            if (!myElement.attr("id")) {
                break;
            }
            output.push(myElement); //which is the equivalent to "push()" in jQuery
        }
        return output;
    }

    //Switching players
    function switchPlayer() {
        if (currentPlayer === "player1") {
            currentPlayer = "player2";
            currentPlayerCoinColor = "coinPlayer2";
        } else {
            currentPlayer = "player1";
            currentPlayerCoinColor = "coinPlayer1";
        }
    }

    //Tracks victories
    function victoryCounter(myId) {
        if ($("#" + myId).hasClass("player1")) {
            countPlayer1++;
            $("#counterPlayer1 p").text(countPlayer1);
            $(".textPopUp h3").text("Player1 won");
        } else {
            countPlayer2++;
            $("#counterPlayer2 p").text(countPlayer2);
            $(".textPopUp h3").text("Player2 won");
        }
    }

    //Displays the victory dialog
    function displayVictoryDialog() {
        $(".victoryDialog").css({ visibility: "visible" });
    }

    //Defines what happens upon clicking "revenge"-Button
    replay.on("click", function (e) {
        e.stopPropagation();
        $(".victoryDialog").css({ visibility: "hidden" });
        allSlots.removeClass("player1 player2");
        allCoins.removeClass("drop coinPlayer1 coinPlayer2");
    });
    //end of iife
})();
