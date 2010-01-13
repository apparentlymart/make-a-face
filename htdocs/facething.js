
function onCellCreate(cell) {
    cell.elem.css("background-color", "#aaaaff");
    cell.elem.css("background-position", "center");
    cell.elem.css("background-repeat", "no-repeat");
    cell.elem.css("background-image", "url(http://static.typepad.com/.shared/images/default-avatars/avatar-03-250x250.gif)");

    if (cell.x == 4 && cell.y == 4) {
        cell.elem.css("background-image", "none");
        cell.elem.css("-webkit-box-shadow", "0 0 20px #000000");
        cell.elem.css("-webkit-transform", "Scale(1.5)");
        cell.elem.css("z-index", "100");
        cell.elem.css("outline", "2px solid white");
    }
}
addCreateListener(onCellCreate);

$(document).ready(
    function () {
        initializeGrid();

        cells[0][2].setBothspan(2);
    }
);



