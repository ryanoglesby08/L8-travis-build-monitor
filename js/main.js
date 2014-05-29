$(function() {
    var serial_connect_cb = function(result) {

        if( result ) {
            // Open success
            $("#btn_serial_connect").removeAttr("disabled");
            $("#btn_serial_connect").val("Disconnect");

            // Start SLCP
            L8_SLCP.Start();
        }
        else {
            // Open error
            $("#btn_serial_connect").removeAttr("disabled");
            $("#btn_serial_connect").val("Connect");
            $("#serial_status").html("Error connecting to L8 ("+ $('#serial_ports :selected').text() +")");
        }
    };
    var serial_disconnect_cb = function(result) {
        $("#btn_serial_connect").val("Connect");
        $("#btn_serial_connect").removeAttr("disabled");
    };

    var fillPorts = function() {
        if( !L8_serialPort.systemPorts ) {
            setTimeout(fillPorts, 100);
            return;
        }

        L8_serialPort.systemPorts.forEach(function(port) {
            $('#serial_ports')
                .append($("<option></option>")
                    .attr("value", port.path)
                    .text(port.path));
        });
    };

    var OnSLCPommand = function(command) {

    };

    L8_serialPort = new SerialPort(serial_connect_cb, serial_disconnect_cb, null, null);
    L8_SLCP = new SLCP({serialPort: L8_serialPort, OnCommand: OnSLCPommand});

    fillPorts();
});

$(document).on("click", "#btn_serial_connect", function() {
    if( L8_serialPort.isConnected ) {
        $("#btn_serial_connect").val("Disconnecting...");
        $("#btn_serial_connect").attr("disabled", "disabled");
        L8_serialPort.disconnect();
    }
    else {
        $("#serial_status").html("");
        $("#btn_serial_connect").val("Connecting...");
        $("#btn_serial_connect").attr("disabled", "disabled");
        L8_serialPort.connect($('#serial_ports :selected').text(), null);  // Port, bitrate
    }
});

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
            matrix[i][j] = new Object();
            matrix[i][j].r = r;
            matrix[i][j].g = g;
            matrix[i][j].b = b;
        }
    }

    L8_SLCP.SetRGBMatrix(matrix);
};

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
            setMatrix(15,0,0); //red
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
            matrix[i][j] = new Object();
            matrix[i][j].r = 15;
            matrix[i][j].g = 15;
            matrix[i][j].b = 15;
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