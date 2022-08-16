const USER1 = "red"

const USER2 = "yellow"

function createWlcMessage(board) {
  // Generate board.
  const chatElement = document.createElement("div")
  chatElement.className = "message"
  chatElement.innerHTML = "Welcome to the chat"
  board.append(chatElement)
}

// function playMove(board, player, column, row) {
//   // Check values of arguments.
//   if (player !== PLAYER1 && player !== PLAYER2) {
//     throw new Error(`player must be ${PLAYER1} or ${PLAYER2}.`);
//   }
//   const columnElement = board.querySelectorAll(".column")[column];
//   if (columnElement === undefined) {
//     throw new RangeError("column must be between 0 and 6.");
//   }
//   const cellElement = columnElement.querySelectorAll(".cell")[row];
//   if (cellElement === undefined) {
//     throw new RangeError("row must be between 0 and 5.");
//   }
//   // Place checker in cell.
//   if (!cellElement.classList.replace("empty", player)) {
//     throw new Error("cell must be empty.");
//   }
// }

export { USER1, USER2, createWlcMessage }
