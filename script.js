// Wait for the DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', ()=>{
    let board = null;  //Initialize the chessboard
    const game = new Chess();   //Create new Chess.js game instance
    const moveHistory = document.getElementById('move-history');
    let moveCount = 1;
    let userColor = 'w';


    //Random move function
    const makeRandomMove = () =>{
        const possibleMoves = game.moves();

        if(game.game_over()) {
            alert("Checkmate!");

        } else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];
            game.move(move);
            board.position(game.fen());
            recordMove(move, moveCount);
            moveCount++;
        }
    };

    //Move history record and display function
    const recordMove = (move, count)=>{
        const formattedMove = count % 2 === 1 ?  `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight;
    };

    //Starting drag position function
    const onDragStart = (source, piece) => {
        return !game.game_over() && piece.search(userColor) === 0;
    };

    // Piece drop function
    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q',
        });

        if (move === null) return 'snapback';

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount);
        moveCount++;
    };

    // Piece snap ending animation function
    const onSnapEnd = () => {
        board.position(game.fen());

    };

    // Chessboard config. options
    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };

    // Chessboard initialization
    board = Chessboard('board', boardConfig);

    //"Play Again" button function
    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount = 1;
        userColor = 'w';
    });

    // "Set Position" button function
    document.querySelector('.set-pos').addEventListener('click', () => {
        const fen = prompt("Enter the FEN notation for the desired position!");
        if (fen !== null){
            if (game.load(fen)) {
                board.position(fen);
                moveHistory.textContent = '';
                moveCount = 1;
                userColor = 'w';
            } else {
                alert("Invalid FEN noation. Please try again");
            }
        }
    });

    //"Flip Board" button function
    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
        makeRandomMove();
        userColor = userColor === 'w' ? 'b' : 'w';
    });
})