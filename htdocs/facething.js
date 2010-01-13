
function onCellCreate(cell) {
    cell.elem.css("background-color", "#aaaaff");
    cell.elem.css("background-position", "center");
    cell.elem.css("background-repeat", "no-repeat");
    cell.elem.css("background-image", "url(http://static.typepad.com/.shared/images/default-avatars/avatar-03-250x250.gif)");
}
addCreateListener(onCellCreate);

$(document).ready(
    function () {
        initializeGrid();
    }
);



