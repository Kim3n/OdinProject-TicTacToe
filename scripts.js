const GameBoard = (() =>{
    var gameBoard = [" "," "," ",
                     " "," "," ",
                     " "," "," "];

    const getBoard = () => gameBoard;

    const placeMarker = (playerMarker, cell) => {
        if(gameBoard[cell] != " ") return;
        gameBoard[cell] = playerMarker;
    }

    const clearBoard = () => gameBoard = [" "," "," "," "," "," "," "," "," "];

    return {
        getBoard,
        placeMarker,
        clearBoard
    };
})();

  

const Player = (name, marker) => {
    var playerName = name;
    var playerMarker = marker;

    const getName = () => playerName;
    const getMarker = () => playerMarker;
    const setName = (newName) => playerName = newName;

    return {
        getName,
        getMarker,
        setName
    };
};

const GameController = (() => {

    let playerOne = Player("Kim", "X");
    let playerTwo = Player("Andre", "O");
    let round = 0;

    const getCurrentPlayer = () =>{
        return round % 2 !== 1 ? playerOne : playerTwo;
    }

    const getPlayerOne = () =>{
        return playerOne;
    }
    const getPlayerTwo = () =>{
        return playerTwo;
    }

    const restartGame = () =>{
        round = 0;
        GameBoard.clearBoard();
        DisplayLogic.startGame();
    }

    const checkWinner = () => {
        let winConditions = [   
            [0,1,2], //TOP ROW  ["X","X","X","","","","","",""];
            [3,4,5], //MIDDLE ROW ["","","","X","X","X","","",""];
            [6,7,8], //BOTTOM ROW ["","","","","","","X","X","X"];

            [0,3,6], //FIRST COLUMN ["X","","","X","","","X","",""];
            [1,4,7], //SECOND COLUMN ["","X","","","X","","","X",""];
            [2,5,8], //LAST COLUMN ["","","X","","","X","","","X"];

            [0,4,8], //LEFT TO RIGHT DIAGONAL["X","","","","X","","","","X"];
            [2,4,6]  //RIGHT TO LEFT DIAGONAL ["","","X","","X","","X","",""];
            ];

            let marked = GameBoard.getBoard().reduce((indices, marker, index) => {
                if (marker === getCurrentPlayer().getMarker()) {
                    indices.push(index);
                }
                return indices;
            }, []);
        
            let markedSet = new Set(marked);
        
            for (let condition of winConditions) {
                if (condition.every(position => markedSet.has(position))) {
                    console.log(marked, condition);
                    console.log("WINNER IS " + getCurrentPlayer().getMarker());
                    console.log("Winning play: " + condition);
                    console.log(getCurrentPlayer());
                    DisplayLogic.displayWinner(getCurrentPlayer().getName());
                    return true;
                }
            }
            return false;
        }



    

    const getRound = () =>{
        return round;
    }

    
    const playRound = (index) => {
        
        if(round <= 8){
            
            GameBoard.placeMarker(getCurrentPlayer().getMarker(),index);
            DisplayLogic.drawGameBoard();
            console.log(GameBoard.getBoard());
            checkWinner();
            round++;
            DisplayLogic.updatePlayerCounter();
        }
        if (round == 9){
            GameBoard.placeMarker(getCurrentPlayer().getMarker(),index);
            DisplayLogic.drawGameBoard();
            console.log(getCurrentPlayer().getName());
            round++; // a bit hacky but works since need to switch the players to get correct winner in checkWinner, refactor and fix this later if you have time 
            checkWinner();
            if (checkWinner() == false){ // a bit hacky but works
                DisplayLogic.displayWinner("tie");
            }
        }

    }

    return {
        playRound,
        getCurrentPlayer,
        getRound,
        checkWinner,
        getPlayerOne,
        getPlayerTwo,
        restartGame
    };
})();



const DisplayLogic = (() =>{
    var container = document.getElementsByClassName("game_board")[0];
    var playerTurnContainer = document.getElementById("player-turn-counter");
    var playButton = document.getElementById("play-button");
    var startAudio = new Audio("voice/start_0.wav");
    var vsAudio = new Audio("voice/title_logo_0.wav");
    var finishAudio = new Audio("voice/battle_finish_0.wav");
    startAudio.volume = 0.2;
    vsAudio.volume = 0.2;
    finishAudio.volume = 0.2;
    var winnerScreen= document.getElementById("players-winner");
    var winnerContainer = document.getElementById("winner-container-name");
    var playerOne = document.getElementById("player-one");
    var playerTwo = document.getElementById("player-two");
    var playerOneNameDisplay = document.getElementById("player-one-name");
    var playerTwoNameDisplay = document.getElementById("player-two-name");
    var playerNameInputForm = document.getElementById("players-name-input");

    

    var previousBoard = [];

    const playerNameChoice = () => {
        playButton.hidden = true;
        vsAudio.play();
        playerNameInputForm.style.display ="flex";
    }


    const startGame = () =>{
        previousBoard = [];
        winnerScreen.style.display ="none";
        var playerOneName = document.getElementById("player-one-name-input").value;
        var playerTwoName = document.getElementById("player-two-name-input").value;
        GameController.getPlayerOne().setName(playerOneName);
        GameController.getPlayerTwo().setName(playerTwoName);
        playerNameInputForm.style.display ="none";
        startAudio.play();
        updatePlayerCounter();
        drawGameBoard();
        playerOneNameDisplay.innerHTML =  playerOneName;
        playerTwoNameDisplay.innerHTML = playerTwoName;
        playerOne.hidden = false;
        playerTwo.hidden = false;
    }

    const displayWinner = (winner) =>{
        var winnerText = document.createElement("h1");
        winnerContainer.replaceChildren();
        if(winner == "tie"){
            winnerText.innerHTML = "MATCH ENDED IN A TIE"
        }
        else{
            winnerText.innerHTML = winner + " WON THIS MATCH!"
        }
        winnerContainer.append(winnerText);
        finishAudio.play();
        winnerScreen.style.display ="flex";
    }

    const randomSound = (string) =>{
        var playerOneImg = document.getElementById("player-one-image");
        var playerTwoImg = document.getElementById("player-two-image");
        var fallback = new Audio("voice/dec_03_0.wav");

        const soundsK =[
            new Audio("voice/k/k1.wav"),
            new Audio("voice/k/k2.wav"),
            new Audio("voice/k/k3.wav"),
            new Audio("voice/k/k4.wav"),
            new Audio("voice/k/k5.wav"),
            new Audio("voice/k/k6.wav"),
        ]

        const soundsM =[
            new Audio("voice/m/m1.wav"),
            new Audio("voice/m/m2.wav"),
            new Audio("voice/m/m3.wav"),
            new Audio("voice/m/m4.wav"),
            new Audio("voice/m/m5.wav"),
        ]

        if(string === "X"){
            const randomNumber = Math.floor(Math.random() * soundsK.length); 
            playerOneImg.classList.remove("shake");
            void playerOneImg.offsetWidth; 
            playerOneImg.classList.add("shake");

            return soundsK[randomNumber];
        }
        
        else if(string === "O"){
            const randomindex = Math.floor(Math.random() * soundsM.length);     
            playerTwoImg.classList.remove("shake");
            void playerTwoImg.offsetWidth; 
            playerTwoImg.classList.add("shake");

            return soundsM[randomindex];
        }
       return fallback; //should never play but there just in case
    }

    

    const drawGameBoard = () => {
        let gameBoard = GameBoard.getBoard();
        
        if (previousBoard.length === 0) {
            previousBoard = gameBoard.slice();
            container.replaceChildren();
            console.log("redrawing")
            for (let i = 0; i < gameBoard.length; i++) {
                var cell = document.createElement("div");
                var marker = document.createElement("div");
                cell.setAttribute("class", "marker_cell");
                cell.addEventListener("click", ()=>GameController.playRound(i), { once: true }); //ONLY ALLOW CELL TO BE CLICKED ONCE
                marker.innerHTML = gameBoard[i];
                cell.setAttribute("id", "cell"+i);
                marker.setAttribute("class", "markers");
                marker.setAttribute("id", "marker"+i);
                cell.append(marker);
                container.append(cell);
            }
        } else {
            
            for (let i = 0; i < gameBoard.length; i++) {
                if (gameBoard[i] !== previousBoard[i]) {
                    var board  = document.getElementById("game_board");
                    var marker = document.getElementById("marker"+i);
                    marker.innerHTML = gameBoard[i];
                    const sound = randomSound(gameBoard[i]);
                    if (sound) {
                        sound.volume = 0.2;
                        sound.play();
                    }
                    
                    marker.classList.remove("markers");
                    board.classList.remove("game_board");
                    void marker.offsetWidth; 
                    marker.classList.add("markers");
                    board.classList.add("game_board")
                }
            }
        }
        
            previousBoard = gameBoard.slice();
        }


    const updatePlayerCounter = () => {
        playerTurnContainer.replaceChildren(); 
        var playerText = document.createElement("h2");
        playerText.setAttribute("class"," animate__animated animate__bounceIn")
        playerText.innerHTML = "It's " + GameController.getCurrentPlayer().getName() + "'s Turn.";
        playerTurnContainer.append(playerText);
    };

    return {
        drawGameBoard,
        updatePlayerCounter,
        startGame,
        playerNameChoice,
        displayWinner
    };
})();




//FORM SUBMIT

document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault(); //Prevent refresh
    DisplayLogic.startGame();

});