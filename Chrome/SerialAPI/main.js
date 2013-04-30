/*
var onGetPorts = function(ports) {
  for (var i=0; i < ports.length; i++) {
      if (ports[i] == "COM1") {
          chrome.serial.open("COM1", { bitrate: 9600 }, function (cInfo) {
              chrome.serial.write(cInfo.connectionId, bufView, function () { });
          });
      }
  }
}

var bufView = new ArrayBuffer(6);
bufView[0] = 0x1B;
bufView[1] = 0x46;
bufView[2] = 0x41;
bufView[3] = 0x42;
bufView[4] = 0x45;
bufView[5] = 0x0D;

var onDeviceFound = function (device) {
    console.log(device);
    _this.device = device;
    if (device) {
        console.log("Device found: " + device.handle);
    } else {
        console.log("Device could not be found");
    }
};

var onUsbEvent = function (event) {
    console.log(event);
    console.log("Got some message from the USB device!");
};

chrome.usb.findDevices(vendorId, productId, { "onEvent": onUsbEvent }, onDeviceFound);
chrome.serial.getPorts(onGetPorts);
*/

//chrome.app.window.current().maximize();