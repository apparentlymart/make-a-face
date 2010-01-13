
function onCellCreate(cell) {
    cell.elem.css("background-color", "#aaaaff");
    cell.elem.css("background-position", "center");
    cell.elem.css("background-repeat", "no-repeat");
    cell.elem.css("background-image", "url(http://static.typepad.com/.shared/images/default-avatars/avatar-03-250x250.gif)");
    cell.elem.css("background-size", "100%");
    cell.elem.css("-moz-background-size", "100%");

    if (cell.x == 2 && cell.y == 1) {
        cell.elem.css("background-image", "url(http://up4.typepad.com/6a010535617444970b0120a5aa75ce970c-250si)");
        cell.elem.css("-webkit-box-shadow", "0 0 20px #000000");
        cell.elem.css("-webkit-transform", "Scale(1.1)");
        cell.elem.css("-moz-box-shadow", "0 0 20px #000000");
        cell.elem.css("-moz-transform", "Scale(1.1)");
        cell.elem.css("z-index", "100");
        //cell.elem.css("outline", "2px solid white");
    }
    else if (cell.x == -2 && cell.y == 2) {
        cell.elem.css("background-image", "url(http://up3.typepad.com/6a00d83451ce6b69e200e5500958118834-250si)");
    }
    else if (cell.x == 1 && cell.y == 3) {
        cell.elem.css("background-image", "url(http://up3.typepad.com/6a00e54feb2fc38833010535dc4b63970b-250si)");
    }
    else if (cell.x == 0 && cell.y == 0) {
        cell.elem.css("background-image", "url(uglylogo.png)");
        //cell.elem.css("-webkit-box-shadow", "0 0 20px #000000");
        //cell.elem.css("-webkit-transform", "Scale(1.5)");
        //cell.elem.css("-webkit-transform-origin", "top left");
        //cell.elem.css("z-index", "100");
    }
}
addCreateListener(onCellCreate);

$(document).ready(
    function () {
        initializeGrid();

        cells[0][-3].setBothspan(2);
    }
);



