$(function() {
    var OnSLCPommand = function(command) {

    };

    L8_serialPort = new SerialPort(portConnector.connected, portConnector.disconnected, null, null);
    L8_SLCP = new SLCP({serialPort: L8_serialPort, OnCommand: OnSLCPommand});

    portConnector.fillPorts();
});

$(document).on("click", "#btn_serial_connect", function() {
    if( L8_serialPort.isConnected ) {
        portConnector.startDisconnect();
    }
    else {
        portConnector.startConnect();
    }
});

var Color = function(r,g,b) {
  this.r = r;
  this.g = g;
  this.b = b;
};

Color.WHITE = new Color(15,15,15);
Color.RED = new Color(15,0,0);
Color.GREEN = new Color(0,15,0);


/* ------- *\
| Matrices |
\*-------- */

var setMatrix = function(r,g,b) {
    if( !L8_serialPort.isConnected ) {
        $("#errors").text("Serial Port is not connected");
        return;
    }

    var matrix = new Array(8);

    for (var i = 0; i < 8; i++)
    {
        matrix[i] = new Array(8);
        for (var j = 0; j < 8; j++)
        {
            matrix[i][j] = color;
        }
    }

    L8_SLCP.SetRGBMatrix(matrix);
    return matrix;
};

var failMatrix = (function() {
    var matrix = setMatrix(15, 0, 0);
    for (var i = 1; i < 7; i++) {
        matrix[i][1] = Color.WHITE;
        matrix[1][i] = Color.WHITE;
        matrix[4][i] = Color.WHITE;
    }
    return matrix;
})();


/* ----------- *\
| DOM BINDINGS |
\*------------ */

$(document).on("click", "#start_poll", function() {
    var repo = $("#travis_url").val();

    $.ajax({
        url: 'https://api.travis-ci.org/repos/' + repo + '/builds',
        headers: {
            "Accept": 'application/vnd.travis-ci.2+json'
        }
    }).done(function(data) {
        if( data.builds[0].state == "passed" ) {
            setMatrix(0,15,0); //white
        }
        else {
            L8_SLCP.SetRGBMatrix(failMatrix); //red
        }
    });

});

$(document).on("click", "#turnon", function() {
//    var repo = $("#travis_url").val();
    if( !L8_serialPort.isConnected ) {
        $("#errors").text("Serial Port is not connected");
        return;
    }

    var matrix = new Array(8);

    for (var i = 0; i < 8; i++)
    {
        matrix[i] = new Array(8);
        for (var j = 0; j < 8; j++)
        {
            matrix[i][j] = Color.WHITE;
        }
    }

    L8_SLCP.SetRGBMatrix(matrix);

});

$(document).on("click", "#turnoff", function() {
    if( !L8_serialPort.isConnected ) {
//        modalDialog("#dialog_not_connected");
        $("#errors").text("Serial Port is not connected");
        return;
    }

    L8_SLCP.ClearRGBMatrix(false);
});