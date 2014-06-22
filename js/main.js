$(function () {
    var OnSLCPommand = function (command) {
        // Do nothing
    };

    var onSerialPortConnect = function (result) {
        if (result) {
            $(document).trigger(l8tbm.events.serialPortConnected);
        }
        else {
            $(document).trigger(l8tbm.events.serialPortConnectErrored);
        }
    };
    var onSerialPortDisconnect = function () {
        $(document).trigger(l8tbm.events.serialPortDisconnected);
    };

    l8tbm.portConnector = new PortConnector();
    l8tbm.portConnector.init();

    l8tbm.matrix = new l8tbm.Matrix(l8tbm.matrixStrategies.onscreen);
    l8tbm.matrix.init();

    l8tbm.onscreenGrid = new l8tbm.OnscreenGrid();
    l8tbm.onscreenGrid.init();

    L8_serialPort = new SerialPort(onSerialPortConnect, onSerialPortDisconnect, null, null);
    L8_SLCP = new SLCP({serialPort: L8_serialPort, OnCommand: OnSLCPommand});

    l8tbm.portConnector.fillPorts();


    /* ----------- *\
     | DOM BINDINGS |
     \*------------ */

    $("#start_poll").on("click", function () {
        var repo = $("#travis_url").val();

        $.ajax({
            url: 'https://api.travis-ci.org/repos/' + repo + '/builds',
            headers: {
                "Accept": 'application/vnd.travis-ci.2+json'
            }
        }).done(function (data) {
            if (data.builds[0].state == "passed") {
                l8tbm.matrix.set(l8tbm.matricies.passMatrix());
            }
            else {
                l8tbm.matrix.set(l8tbm.matricies.failMatrix());
            }
        });

    });

    $("#turn_on").on("click", function () {
        l8tbm.matrix.on();
    });

    $("#turn_off").on("click", function () {
        l8tbm.matrix.off();
    });
});