function PortConnector() {
    var $buttonElement = $("#btn_serial_connect");
    var $statusElement = $("#serial_status");
    var $serialPortsElement = $("#serial_ports");


    var selectedPort = function () {
        return $serialPortsElement.find(':selected').text();
    };

    var onSerialPortConnect = function (result) {
        $buttonElement.removeAttr("disabled")
            .val("Disconnect");
        L8_SLCP.Start();
    };

    var onSerialPortConnectError = function () {
        $buttonElement.removeAttr("disabled")
                      .val("Connect");
        $statusElement.html("Error connecting to L8 (" + selectedPort() + ")");
    };

    var onSerialPortDisconnect = function () {
        $buttonElement.removeAttr("disabled")
                      .val("Connect");
    };


    var init = function () {
        $(document).on(l8tbm.events.serialPortConnected, function () {
            onSerialPortConnect();
        });
        $(document).on(l8tbm.events.serialPortConnectErrored, function () {
            onSerialPortConnectError();
        });
        $(document).on(l8tbm.events.serialPortDisconnected, function () {
            onSerialPortDisconnect();
        });
    };

    var startDisconnect = function () {
        $buttonElement.val("Disconnecting...")
            .attr("disabled", "disabled");

        L8_serialPort.disconnect();
    };

    var startConnect = function () {
        $statusElement.html("");
        $buttonElement.val("Connecting...")
            .attr("disabled", "disabled");

        L8_serialPort.connect(selectedPort(), null);  // Port, bit rate
    };

    var fillPorts = function () {
        if (!L8_serialPort.systemPorts) {
            setTimeout(fillPorts, 100);
            return;
        }

        L8_serialPort.systemPorts.forEach(function (port) {
            $serialPortsElement.append($("<option></option>")
                .attr("value", port.path)
                .text(port.path));
        });
    };

    return {
        startDisconnect: startDisconnect,
        startConnect: startConnect,
        fillPorts: fillPorts,
        init: init
    }
};

$(function () {
    $("#btn_serial_connect").on("click", function () {
        if (L8_serialPort.isConnected) {
            l8tbm.portConnector.startDisconnect();
        }
        else {
            l8tbm.portConnector.startConnect();
        }
    });
});