var l8_tbm = {};

$(function() {
    var OnSLCPommand = function(command) {
        // Do nothing
    };

    l8_tbm.portConnector = new PortConnector();

    L8_serialPort = new SerialPort(l8_tbm.portConnector.onSerialPortConnect, l8_tbm.portConnector.onSerialPortDisconnect, null, null);
    L8_SLCP = new SLCP({serialPort: L8_serialPort, OnCommand: OnSLCPommand});

    l8_tbm.portConnector.fillPorts();
});

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

var red, green, blue;

var changeColor = function() {
  L8_SLCP.SetRGBMatrix(solidMatrix(new Color(red,green,blue)));
};

var incrColor = function() {
  red = (red+1)%16;
  green = (green+2)%16;
  blue = (blue+3)%16;
  $('#r').val(red);
  $('#g').val(green);
  $('#b').val(blue);
  changeColor();
};

$(document).on("click", "#btnColor", function() {
  red = parseInt($('#r').val());
  green = parseInt($('#g').val());
  blue = parseInt($('#b').val());
  
  setInterval(incrColor, 500);
});

$(document).on("click", "#btnStop", function() {
  clearInterval();
});
