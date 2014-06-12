$(function() {
    var OnSLCPommand = function(command) {

    };

    L8_serialPort = new SerialPort(portConnector.connected, portConnector.disconnected, null, null);
    L8_SLCP = new SLCP({serialPort: L8_serialPort, OnCommand: OnSLCPommand});

    portConnector.fillPorts();
});

/* ----------- *\
| DOM BINDINGS |
\*------------ */

$(document).on("click", "#btn_serial_connect", function() {
    if( L8_serialPort.isConnected ) {
        portConnector.startDisconnect();
    }
    else {
        portConnector.startConnect();
    }
});

$(document).on("click", "#start_poll", function() {
    var repo = $("#travis_url").val();

    $.ajax({
        url: 'https://api.travis-ci.org/repos/' + repo + '/builds',
        headers: {
            "Accept": 'application/vnd.travis-ci.2+json'
        }
    }).done(function(data) {
        if( data.builds[0].state == "passed" ) {
            setMatrix(passMatrix());
        }
        else {
            setMatrix(failMatrix()); //red
        }
    });

});

$(document).on("click", "#turnon", function() {
    if( !L8_serialPort.isConnected ) {
        $("#errors").text("Serial Port is not connected");
        return;
    }

    L8_SLCP.SetRGBMatrix(solidMatrix(Color.WHITE));

});

$(document).on("click", "#turnoff", function() {
    if( !L8_serialPort.isConnected ) {
        $("#errors").text("Serial Port is not connected");
        return;
    }

    L8_SLCP.ClearRGBMatrix(false);
});