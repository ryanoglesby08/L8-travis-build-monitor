var setMatrix = function(matrix) {
    if( !L8_serialPort.isConnected ) {
        $("#errors").text("Serial Port is not connected");
        return;
    }

    L8_SLCP.SetRGBMatrix(matrix);
};

var solidMatrix = function(color) {
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

var failMatrix = function() {
    var matrix = solidMatrix(Color.RED);
    for (var i = 1; i < 7; i++) {
        matrix[i][1] = Color.WHITE;
        matrix[1][i] = Color.WHITE;
        matrix[4][i] = Color.WHITE;
    }
    return matrix;
};

var passMatrix = function() {
  return solidMatrix(Color.WHITNEY);
};
