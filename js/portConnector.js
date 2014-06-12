function PortConnector() {
    var $buttonElement = $("#btn_serial_connect");
    var $statusElement = $("#serial_status");
    var $serialPortsElement = $("#serial_ports");


    var selectedPort = function () {
        return $serialPortsElement.find(':selected').text();
    };

    var onSerialPortConnect = function (result) {
        $buttonElement.removeAttr("disabled");

        if (result) {
            $buttonElement.val("Disconnect");
            L8_SLCP.Start();
        }
        else {
            $buttonElement.val("Connect");
            $statusElement.html("Error connecting to L8 (" + selectedPort() + ")");
        }
    };

    var onSerialPortDisconnect = function () {
        $buttonElement.val("Connect")
                      .removeAttr("disabled");
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
        onSerialPortConnect: onSerialPortConnect,
        onSerialPortDisconnect: onSerialPortDisconnect,
        startDisconnect: startDisconnect,
        startConnect: startConnect,
        fillPorts: fillPorts
    }
}

$(function() {
    $("#btn_serial_connect").on("click", function() {
        if( L8_serialPort.isConnected ) {
            l8_tbm.portConnector.startDisconnect();
        }
        else {
            l8_tbm.portConnector.startConnect();
        }
    });
});