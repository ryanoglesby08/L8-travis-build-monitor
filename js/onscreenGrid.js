l8tbm = l8tbm || {};

l8tbm.OnscreenGrid = function() {
    var grid = $("#onscreen_grid");

    var show = function() {
      grid.show();
    };
    var hide = function() {
      grid.hide();
    };

    var apply = function(matrix) {
        var rows = grid.find("tr");
        rows.each(function(rowIndex) {
            var columns = $(this).find("td");

            columns.each(function(columnIndex) {
                $(this).css("background-color", matrix[rowIndex][columnIndex].hex);
            });
        });
    };

    var init = function() {
        $(document).on(l8tbm.events.serialPortConnected, function () {
            hide();
        });
        $(document).on(l8tbm.events.serialPortConnectErrored, function () {
            show();
        });
        $(document).on(l8tbm.events.serialPortDisconnected, function () {
            show();
        });

        l8tbm.onscreenGrid.show();
    };

    return {
      show: show,
      apply: apply,
      init: init
    };
};