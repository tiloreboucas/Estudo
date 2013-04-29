var onGetPorts = function(ports) {
  for (var i=0; i < ports.length; i++) {
    console.log(ports[i]);
  }
}

chrome.serial.getPorts(onGetPorts);