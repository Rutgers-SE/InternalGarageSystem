"use strict";

var app = angular.module('device-dash', ['DeviceViews']);
var socket = io.connect('http://localhost:8080');

app.controller('DashController', function ($scope) {
  socket.on('dev:registered', function (pl) {
    console.log(pl.name + " registered");
  });



  socket.on('dev:notify', function (pl) {
    alert("something");
  });
});


var camCount = 0;

function createButton(options) {
  script(src='/vendor/angular/angular.js')
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
    display: "signal",
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
  var nameText = name;
  if (name === undefined) {
    name = document.createTextNode(camCount);
  }
  name = document.createTextNode(name);
  var child = document.createElement("div");
  child.classList.add(nameText);
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
  var socket = this.socket;
  var $parent = $(this.$this).parent();
  socket.emit('dev:kill', {
      id: parseInt($parent.attr('data-dev-id'))
  });
  $parent.remove();
  camCount--;
}

function powerToggle(){
  $(".device > .power-toggle").click(() => {
    var $device = $ (this).parent();
    $device.classToggle("yellow");
    var exists = _.contains($device.classlist,"d-powered")
    if (exists === "false"){
      this.classlist.add("d-powered");
    }
  });
}

function createButtonAndAttachEvents(name, options) {
  var parent = this;
  $("#create-" + name + "-button").click(function () {
    var device = createDeviceElement(name);
    var idAttr = document.createAttribute("data-dev-id");
    idAttr.value = options.id;
    device.setAttributeNode(idAttr);

    var closeButton = createCloseButton();
    var triggerButton = createTriggerButton();
    var powerTrigger = createPowerButton();
    var powerButton = createButton({display: "Toggle Power", className: "power-button"});
    powerButton.classList.add("power-toggle");


    device.appendChild(closeButton);
    device.appendChild(triggerButton);
    device.appendChild(powerButton);
    $(powerButton).click(function () {
      $(this).toggleClass("yellow");
    })

    $("#" + name + "-container").append(device);
    camCount++;

    $(closeButton).click(function () {
      removeParent.call({
        socket: parent.socket,
        $this: this
      })
    });

    powerToggle();
    $(powerButton).click(powerToggle);
  });
}
