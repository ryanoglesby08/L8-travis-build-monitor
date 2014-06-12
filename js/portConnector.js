var portConnector = (function () {
    var $buttonElement = function () {
        return $("#btn_serial_connect");
    };

    var $statusElement = function () {
        return $("#serial_status");
    };

    var selectedPort = function () {
        return $('#serial_ports :selected').text();
    };


    var connected = function (result) {
        if (result) {
            // Open success
            $buttonElement().removeAttr("disabled");
            $buttonElement().val("Disconnect");

            // Start SLCP
            L8_SLCP.Start();
        }
        else {
            // Open error
            $buttonElement().removeAttr("disabled");
            $buttonElement().val("Connect");

            $statusElement().html("Error connecting to L8 (" + selectedPort() + ")");
        }
    };

    var disconnected = function () {
        $buttonElement().val("Connect");
        $buttonElement().removeAttr("disabled");
    };

    var startDisconnect = function () {
        $buttonElement().val("Disconnecting...");
        $buttonElement().attr("disabled", "disabled");

        L8_serialPort.disconnect();
    };

    var startConnect = function () {
        $statusElement().html("");
        $buttonElement().val("Connecting...");
        $buttonElement().attr("disabled", "disabled");

        L8_serialPort.connect(selectedPort(), null);  // Port, bitrate
    };

    var fillPorts = function () {
        if (!L8_serialPort.systemPorts) {
            setTimeout(fillPorts, 100);
            return;
        }

        var $portsSelect = $('#serial_ports');
        L8_serialPort.systemPorts.forEach(function (port) {
            $portsSelect.append($("<option></option>")
                .attr("value", port.path)
                .text(port.path));
        });
    };

    return {
        connected: connected,
        disconnected: disconnected,
        startDisconnect: startDisconnect,
        startConnect: startConnect,
        fillPorts: fillPorts
    }
})();