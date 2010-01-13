

// Fills a page with a grid of DIV elements and provides an API
// to manipulate them.

var cellSize = 128;
var cellSpacing = 4;

var currentColumns = 0;
var currentRows = 0;

var cells = [];

var cellCreateListeners = [];
var cellDestroyListeners = [];

function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.elem = makeElementForCell(x, y);
    this.colspan = 1;
    this.rowspan = 1;
    this.obscuredBy = null;
    for (var i = 0; i < cellCreateListeners.length; i++) {
        var func = cellCreateListeners[i];
        func(this);
    }
}
var cellMethods = {};
Cell.prototype = cellMethods;
cellMethods.setColspan = function (colspan) {
    console.log("Setting ", this, " colspan to be ", colspan);

    if (this.obscuredBy) {
        var obscuredBy = this.obscuredBy;
        obscuredBy.destroy();
        obscuredBy.undestroy();
    }

    var oldColspan = this.colspan;
    var exposedColumns = oldColspan - colspan;
    if (exposedColumns > 0) {
        // We're shrinking, so we need to re-create
        // all of the cells in the space we're creating.

        var startColumn = this.x + (oldColspan - exposedColumns);
        for (var y = this.y; y < (this.y + this.rowspan); y++) {
            for (var x = startColumn; x < (this.x + oldColspan); x++) {
                cells[y][x].undestroy();
                cells[y][x].obscuredBy = null;
            }
        }
    }
    else if (exposedColumns < 0) {
        // We're growing, so we need to destroy
        // the cells that we're covering up.

        var startColumn = this.x + oldColspan;
        for (var y = this.y; y < (this.y + this.rowspan); y++) {
            for (var x = startColumn; x < (this.x + colspan); x++) {
                cells[y][x].destroy();
                cells[y][x].obscuredBy = this;
            }
        }

    }

    this.colspan = colspan;
    this.elem.width(spanSize(colspan));
};
cellMethods.setRowspan = function (rowspan) {
    console.log("Setting ", this, " rowspan to be ", rowspan);
    if (this.obscuredBy) {
        var obscuredBy = this.obscuredBy;
        obscuredBy.destroy();
        obscuredBy.undestroy();
    }

    var oldRowspan = this.rowspan;
    var exposedRows = oldRowspan - rowspan;
    if (exposedRows > 0) {
        // We're shrinking, so we need to re-create
        // all of the cells in the space we're creating.

        var startRow = this.y + (oldRowspan - exposedRows);
        for (var y = startRow; y < (this.y + oldRowspan); y++) {
            for (var x = this.x; x < (this.x + this.colspan); x++) {
                if (this.x == x && this.y == y) {
                    console.log("I seem to be undestroying myself?!");
                }
                cells[y][x].undestroy();
                cells[y][x].obscuredBy = null;
                console.log([x,y], " is now ", cells[y][x]);
            }
        }
    }
    else if (exposedRows < 0) {
        // We're growing, so we need to destroy
        // the cells that we're covering up.

        var startRow = this.y + oldRowspan;
        for (var y = startRow; y < (this.y + rowspan); y++) {
            for (var x = this.x; x < (this.x + this.colspan); x++) {
                if (this.x == x && this.y == y) {
                    console.log("I seem to be destroying myself?!");
                }
                cells[y][x].destroy();
                cells[y][x].obscuredBy = this;
                console.log([x,y], " is now ", cells[y][x]);
            }
        }

    }

    this.rowspan = rowspan;
    this.elem.height(spanSize(rowspan));
};
cellMethods.setBothspan = function (span) {
    this.setRowspan(span);
    this.setColspan(span);
};
cellMethods.destroy = function () {
    console.log("Destroying ", this);
    for (var i = 0; i < cellDestroyListeners.length; i++) {
        var func = cellDestroyListeners[i];
        func(this);
    }
    // If we're being obscured by something, force that thing
    // to be recreated as a 1x1 cell so we don't end up
    // with large cells hanging out of the grid.
    if (this.obscuredBy) {
        var obscuredBy = this.obscuredBy;
        obscuredBy.destroy();
        obscuredBy.undestroy();
    }

    // Set the span to be 1 so that we recreate any other
    // cells that we were obscuring if we were larger.
    this.setRowspan(1);
    this.setColspan(1);
    var elem = this.elem;
    if (elem) {
        elem.remove();
        this.elem = null;
    }
};
cellMethods.undestroy = function () {
    console.log("Undestroying ", this);
    if (! this.elem) {
        this.elem = makeElementForCell(this.x, this.y);
    }
    for (var i = 0; i < cellCreateListeners.length; i++) {
        var func = cellCreateListeners[i];
        func(this);
    }
};

function initializeGrid() {

    // The initial setup is actually implemented just be resizing
    // the grid from 0 by 0 to whatever the window actually requires.
    handleResize();

    $(window).resize(handleResize);

}

function handleResize() {

    var pageWidth = $(document).width();
    var pageHeight = $(document).height();

    var columns = Math.ceil((pageWidth - cellSpacing) / (cellSize + cellSpacing));
    var rows = Math.ceil((pageHeight - cellSpacing) / (cellSize + cellSpacing));

    var newRows = rows - currentRows;
    if (newRows > 0) {
        // We're growing, so we need to add some new rows.
        for (var y = currentRows; y < rows; y++) {
            cells[y] = [];
            for (var x = 0; x < currentColumns; x++) {
                cells[y][x] = new Cell(x, y);
            }
        }

        currentRows = rows;
    }
    else if (newRows < 0) {
        // We're shrinking, so we need to destroy some rows.

        for (var y = rows; y < currentRows; y++) {
            for (var x = 0; x < currentColumns; x++) {
                cell = cells[y][x];
                cell.destroy();
            }
        }
        cells = cells.slice(0, rows);

        currentRows = rows;
    }

    var newColumns = columns - currentColumns;
    if (newColumns > 0) {
        // We're growing, so we need to add some new columns.
        for (var y = 0; y < currentRows; y++) {
            for (var x = currentColumns; x < columns; x++) {
                cells[y][x] = new Cell(x, y);
            }
        }

        currentColumns = columns;
    }
    else if (newColumns < 0) {
        // We're shrinking, so we need to destroy some columns.

        for (var y = 0; y < currentRows; y++) {
            for (var x = columns; x < currentColumns; x++) {
                cell = cells[y][x];
                cell.destroy();
            }
            cells[y] = cells[y].slice(0, columns);
        }

        currentColumns = columns;
    }

}

function addCreateListener(func) {
    cellCreateListeners.push(func);
}
function addDestroyListener(func) {
    cellDestroyListeners.push(func);
}

function makeElementForCell(cellX, cellY) {

    var elem = $("<div></div>");

    elem.width(cellSize);
    elem.height(cellSize);

    var realX = (cellX * (cellSize + cellSpacing)) + cellSpacing;
    var realY = (cellY * (cellSize + cellSpacing)) + cellSpacing;

    elem.css("position", "fixed");
    elem.css("left", realX+"px");
    elem.css("top", realY+"px");
    elem.css("background-color", "#222222");

    $(document.body).append(elem);

    return elem;

}

function spanSize(span) {
    return (span * cellSize) + ((span - 1) * cellSpacing);
}

