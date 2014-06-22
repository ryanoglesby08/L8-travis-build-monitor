l8tbm = l8tbm || {};

l8tbm.matricies = (function() {
    var solidMatrix = function (color) {
        // Default to white
        if (typeof  color === "undefined") {
            color = Color.WHITE;
        }

        // Allow for RGB to be passed
        if (typeof color === "number" && arguments.length === 3) {
            color = new Color(arguments[0], arguments[1], arguments[2]);
        }

        var matrix = new Array(8);

        for (var i = 0; i < 8; i++) {
            matrix[i] = new Array(8);

            for (var j = 0; j < 8; j++) {
                matrix[i][j] = color;
            }
        }

        return matrix;
    };

    var failMatrix = function () {
        var matrix = solidMatrix(Color.RED);
        for (var i = 1; i < 7; i++) {
            matrix[i][1] = Color.WHITE;
            matrix[1][i] = Color.WHITE;
            matrix[4][i] = Color.WHITE;
        }
        return matrix;
    };

    var passMatrix = function () {
        return solidMatrix(Color.GREEN);
    };

    return {
        solidMatrix: solidMatrix,
        failMatrix: failMatrix,
        passMatrix: passMatrix
    }
})();

l8tbm.matrixStrategies = {};
l8tbm.matrixStrategies.l8 = function () {
    return {
        set: function (matrix) {
            if (!L8_serialPort.isConnected) {
                $("#errors").text("Serial Port is not connected");
                return;
            }

            L8_SLCP.SetRGBMatrix(matrix);
        },

        on: function() {
            if (!L8_serialPort.isConnected) {
                $("#errors").text("Serial Port is not connected");
                return;
            }

            L8_SLCP.SetRGBMatrix(l8tbm.matricies.solidMatrix(Color.WHITE));
        },

        off: function() {
            if (!L8_serialPort.isConnected) {
                $("#errors").text("Serial Port is not connected");
                return;
            }

            L8_SLCP.ClearRGBMatrix(false);
        }
    };
};
l8tbm.matrixStrategies.onscreen = {
    set: function (matrix) {
        l8tbm.onscreenGrid.apply(matrix);
    },

    on: function() {
        l8tbm.onscreenGrid.apply(l8tbm.matricies.solidMatrix(Color.GREY));
    },

    off: function() {
        l8tbm.onscreenGrid.apply(l8tbm.matricies.solidMatrix(Color.WHITE));
    }
};

l8tbm.Matrix = function (matrixStrategy) {
    return {
        set: function (matrix) {
            matrixStrategy.set(matrix);
        },

        on: function() {
            matrixStrategy.on();
        },

        off: function() {
            matrixStrategy.off();
        },

        init: function() {
            $(document).on(l8tbm.events.serialPortConnected, function () {
                matrixStrategy = l8tbm.matrixStrategies.l8;
            });
            $(document).on(l8tbm.events.serialPortConnectErrored, function () {
                matrixStrategy = l8tbm.matrixStrategies.onscreen;
            });
            $(document).on(l8tbm.events.serialPortDisconnected, function () {
                matrixStrategy = l8tbm.matrixStrategies.onscreen;
            });
        }
    }
};