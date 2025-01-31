let imagenActual;
var rows = 3;
var columns = 3;

var currTile;
var otherTile; //blank tile

var turns = 0;

// var imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
var imgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];

window.onload = function () {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            //<img id="0-0" src="1.jpg">
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = imgOrder.shift() + ".jpg";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart);  //click an image to drag
            tile.addEventListener("dragover", dragOver);    //moving image around while clicked
            tile.addEventListener("dragenter", dragEnter);  //dragging image onto another one
            tile.addEventListener("dragleave", dragLeave);  //dragged image leaving anohter image
            tile.addEventListener("drop", dragDrop);        //drag an image over another image, drop the image
            tile.addEventListener("dragend", dragEnd);      //after drag drop, swap the two tiles

            document.getElementById("board").append(tile);
            
        }
    }
    imagenActual = document.getElementById("2-2");
}

function dragStart() {
    currTile = this; //this refers to the img tile being dragged
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this; //this refers to the img tile being dropped on
}

function dragEnd() {
    if (!otherTile.src.includes("3.jpg")) {
        return;
    }

    let currCoords = currTile.id.split("-"); //ex) "0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = r == r2 && c2 == c - 1;
    let moveRight = r == r2 && c2 == c + 1;

    let moveUp = c == c2 && r2 == r - 1;
    let moveDown = c == c2 && r2 == r + 1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        turns += 1;
        document.getElementById("turns").innerText = turns;
    }


}

document.addEventListener("keydown", (event) => {
    if (event.key === "a" || event.key === "ArrowLeft") {
        leftFn();
    } else if (event.key === "w" || event.key === "ArrowUp") {
        upFn();
    } else if (event.key === "d" || event.key === "ArrowRight") {
        rightFn();
    } else if (event.key === "s" || event.key === "ArrowDown") {
        downFn();
    }
});


const leftFn = () => {
    console.log("La tecla 'a' fue presionada");
    let coords = imagenActual.id.split("-");
    if (coords[1] != 0){
        let currentRow = coords[0];
        let currentColumn = coords[1];
        let leftColumn = String(parseInt(currentColumn) - 1);
        let leftImage = document.getElementById(currentRow + "-" + leftColumn);

        let newColumn = String(leftColumn);
        let newRow = String(currentRow);
        // Logical

        let currentSrc = imagenActual.src;
        let leftSrc = leftImage.src;

        imagenActual.src = leftSrc;
        leftImage.src = currentSrc;
        imagenActual = document.getElementById(newRow + "-" + newColumn);
    }
}

const rightFn = () => {
    console.log("La tecla 'd' fue presionada");
    let coords = imagenActual.id.split("-");
    if (coords[1] != 2){
        let currentRow = coords[0];
        let currentColumn = coords[1];
        let rightColumn = String(parseInt(currentColumn) + 1);
        let rightImage = document.getElementById(currentRow + "-" + rightColumn);

        let newColumn = String(rightColumn);
        let newRow = String(currentRow);
        // Logical

        let currentSrc = imagenActual.src;
        let rightSrc = rightImage.src;

        imagenActual.src = rightSrc;
        rightImage.src = currentSrc;
        imagenActual = document.getElementById(newRow + "-" + newColumn);
    }
}


const upFn = () => {
    console.log("La tecla 'w' fue presionada");
    let coords = imagenActual.id.split("-");
    if (coords[0] != 0){
        let currentRow = coords[0];
        let currentColumn = coords[1];
        let upRow = String(parseInt(currentRow) - 1);
        let upImage = document.getElementById(upRow + "-" + currentColumn);

        let newRow = String(upRow);
        let newColumn = String(currentColumn);
        // Logical

        let currentSrc = imagenActual.src;
        let upSrc = upImage.src;

        imagenActual.src = upSrc;
        upImage.src = currentSrc;
        imagenActual = document.getElementById(newRow + "-" + newColumn);
    }
}

const downFn = () => {
    console.log("La tecla 'w' fue presionada");
    let coords = imagenActual.id.split("-");
    if (coords[0] != 2){
        let currentRow = coords[0];
        let currentColumn = coords[1];
        let downRow = String(parseInt(currentRow) + 1);
        let downImage = document.getElementById(downRow + "-" + currentColumn);

        let newRow = String(downRow);
        let newColumn = String(currentColumn);
        // Logical

        let currentSrc = imagenActual.src;
        let downSrc = downImage.src;

        imagenActual.src = downSrc;
        downImage.src = currentSrc;
        imagenActual = document.getElementById(newRow + "-" + newColumn);
    }
}