
var camCount = 0;

function createButton(options) {
  var button = document.createElement("button");
  button.classList.add(options.className);
  var text = document.createTextNode(options.display);
  button.appendChild(text);
  return button;

}

function createCloseButton() {
  return createButton({
    display: "X",
    className: "close-button"
  });
}

function createTriggerButton() {
  return createButton({
    display: "->",
    className:"trigger-button"
  });
}

function createPowerButton() {
  return createButton({
    display: "Power - ",
    className: "power-toggle"
  });
}


function createDeviceElement(name) {
  if (name === undefined) {
    name = document.createTextNode(camCount);
  }
  name = document.createTextNode(name);
  var child = document.createElement("div");
  child.classList.add("camera");
  child.classList.add("d-powered");
  child.classList.add("col-sm-4");
  child.appendChild(name);
  return child;
}

function createCamera(name) {
  if (name === undefined) {
    name = document.createTextNode(camCount);
  }
  name = document.createTextNode(name);
  var child = document.createElement("div");
  child.classList.add("camera");
  child.classList.add("d-powered");
  child.appendChild(name);
  return child;
}


function removeParent () {
  var $cameraElement = $(this).parent();
  $cameraElement.remove();
  camCount--;
}

function notifySystem() {
  socket.emit("", {

  });
}

function powerToggle(){
  $("device>.power-toggle").click(() => {
    var $device = $ (this).parent();
    var exists = _.contains($device.classlist,"d-powered")
    if (exists === "false"){
      this.classlist.add("d-powered");
    }

  })
}

function createButtonAndAttachEvents(name, options) {
  $("#create-" + name + "-button").click(function () {
    var device = createDeviceElement(name);

    var closeButton = createCloseButton();
    var triggerButton = createTriggerButton();
    var powerTrigger = createPowerButton();
    var powerButton = createButton({display: "bp", className: "power-button"});

    device.appendChild(closeButton);
    device.appendChild(triggerButton);
    device.appendChild(powerButton);
    $("#" + name + "-container").append(device);
    camCount++;

    $(closeButton).click(removeParent);
    $(triggerButton).click(notifySystem);
    $(powerButton).click(powerToggle);
  });
}
$(function () {
  // This is where you should attach the event listeners
  createButtonAndAttachEvents("camera");
  createButtonAndAttachEvents("sensor");
  createButtonAndAttachEvents("terminal");
  createButtonAndAttachEvents("gate");
  createButtonAndAttachEvents("qrScanner");

  var socket = io.connect('http://localhost:8080');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });

});
