// canvas variable
var area = $('#colorContainer');
var centerX = area.width() / 2;
var centerY = area.height() / 2;
var innerRadius = area.width() / 2.75;
var outerRadius = area.width() / 2;

var clickWheel = false;
var colorWheel = $('#colorWheel');
var sliderWheel = $('#sliderWheel');
var controlWheel = $('#controlWheel');

var clickRect = false;
var colorRect = $('#colorRect');
var sliderRect = $('#sliderRect');
var controlRect = $('#controlRect');

var sliderMask = $('#sliderMask');

var colorHue = 0;
var colorWhite = 0;
var colorBlack = 0;

// start script
colorInit();
printColorWheel();
printColorRect('#FF0000');

$(window).resize(function(){
  colorInit();
  printColorWheel();
  printColorRect('#FF0000');
})

$(window).mouseup(function (e) {
  clickWheel = false;
  clickRect = false;
})

sliderWheel.mousedown(function (e) {
  clickWheel = true;
  wheelController(e);
});

sliderRect.mousedown(function (e) {
  clickRect = true;
  rectController(e);
})

$(window).mousemove(function (e) {
  if (clickWheel) { wheelController(e); }
  if (clickRect) { rectController(e); }
});
// end script

// variable initialize
function colorInit(){
  sliderWheel.width(2 * outerRadius)
  sliderWheel.height(2 * outerRadius)
  sliderWheel.css('border-radius', outerRadius)

  sliderMask.width(2 * innerRadius)
  sliderMask.height(2 * innerRadius)
  sliderMask.css('border-radius', innerRadius)

  sliderRect.width(outerRadius)
  sliderRect.height(outerRadius)

  var sliderWheelRadius = controlWheel.width() / 2 + parseInt(controlWheel.css('borderWidth'))
  controlWheel.css('left', outerRadius - sliderWheelRadius)
  controlWheel.css('top' , outerRadius * 3 / 22 - sliderWheelRadius)

  var sliderRectRadius = controlRect.width() / 2 + parseInt(controlRect.css('borderWidth'))
  controlRect.css('left', outerRadius - sliderRectRadius)
  controlRect.css('top' , - sliderRectRadius)
}

// do somthing in this function
function colorChange(){
  var rgb = getRectColor();

  // ------------------------------------------------
  // do somthing here
  // $('#status').html(rgbString(rgb))
  // $('#box').css('background-color', rgbString(rgb))
  // ------------------------------------------------
}

// html canvas wheel
function printColorWheel() {
  var canvas = document.getElementById(colorWheel.attr('id'));
  var context = canvas.getContext('2d');

  canvas.width  = 2 * outerRadius;
  canvas.height = 2 * outerRadius;

  for (var angle = 0; angle <= 360; angle += 1) {
    var startAngle = (angle - 90 - 2) * Math.PI / 180;
    var endAngle = (angle - 90) * Math.PI / 180;
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, outerRadius, startAngle, endAngle, false);
    context.closePath();
    context.fillStyle = 'hsl(' + angle + ', 100%, 50%)';
    context.fill();
    context.closePath();
  }

  context.save();
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI, false);
  context.fill();
  context.restore();
}

// html canvas rect
function printColorRect(rgba) {
  var canvas = document.getElementById(colorRect.attr('id'));
  var context = canvas.getContext('2d');

  var sideRect = outerRadius;
  var rectX = centerX - sideRect / 2;
  var rectY = centerY - sideRect / 2;

  canvas.width  = sideRect;
  canvas.height = sideRect;
  canvas.style.left = rectX + 'px';
  canvas.style.top  = rectY + 'px';

  var gradient = context.createLinearGradient(0, 0, 0 + sideRect, 0);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(1, rgba);
  context.fillStyle = gradient;
  context.fillRect(0, 0, sideRect, sideRect);

  var gradient = context.createLinearGradient(0, 0, 0, 0 + sideRect);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,1)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, sideRect, sideRect);
}

// wheel controller
function wheelController(e){
  colorHue = getWheelHue(e);
  var rect = hslToRgb(colorHue, 1, .5);
  printColorRect(rgbString(rect));
  colorChange();
}

// get hue value from wheel
function getWheelHue(e) {
  var deg = 0;

  var widthBorder = outerRadius - innerRadius;
  var widthSlider = controlWheel.width() + 2 * parseInt(controlWheel.css('borderWidth'));
  var radius = outerRadius - widthBorder / 2;
  var shift = (widthBorder - widthSlider) / 2;

  var posO = area.offset();
  var posM = {
    x: e.clientX - posO.left + window.pageXOffset,
    y: e.clientY - posO.top  + window.pageYOffset};
  var atan = Math.atan2(posM.x - outerRadius, posM.y - outerRadius);
  deg = -atan / (Math.PI / 180) + 180;
  // final (0-360 positive) degrees from mouse position

  var X = Math.round(radius *  Math.sin(deg * Math.PI / 180));
  var Y = Math.round(radius * -Math.cos(deg * Math.PI / 180));

  var left = X + radius + shift;
  var top  = Y + radius + shift;
  controlWheel.css('left', left);
  controlWheel.css('top' , top );
  // AND FINALLY apply exact degrees to ball rotation
  //controlWheel.css('WebkitTransform', 'rotate(' + deg + 'deg)');
  //controlWheel.css('-moz-transform', 'rotate(' + deg + 'deg)');

  return Math.round(deg);
}

// rect position handler
function rectController(e) {
  var sideRect    = outerRadius;
  var widthSlider = controlRect.width() + 2 * parseInt(controlRect.css('borderWidth'));
  var shift       = - outerRadius / 2;

  var posO = area.offset();
  var posM = {
    x: e.clientX - posO.left + window.pageXOffset,
    y: e.clientY - posO.top  + window.pageYOffset };

  var X = posM.x + shift;
  var Y = posM.y + shift;
  X = (X < 0)        ? 0        : X;
  Y = (Y < 0)        ? 0        : Y;
  X = (X > sideRect) ? sideRect : X;
  Y = (Y > sideRect) ? sideRect : Y;

  var left = X - widthSlider / 2;
  var top  = Y - widthSlider / 2;
  controlRect.css('left', left);
  controlRect.css('top' , top );

  colorBlack =      Y / sideRect;
  colorWhite = (1 - X / sideRect) * (1 - colorBlack);

  colorChange();
}

// return rect slider poition color
function getRectColor(){
  return hwbToRgb(colorHue, colorWhite, colorBlack);
}

function hslToRgb(hue, sat, light) {
  var t1, t2, r, g, b;
  hue = hue / 60;
  if ( light <= 0.5 ) {
    t2 = light * (sat + 1);
  } else {
    t2 = light + sat - (light * sat);
  }
  t1 = light * 2 - t2;
  r = hueToRgb(t1, t2, hue + 2) * 255;
  g = hueToRgb(t1, t2, hue) * 255;
  b = hueToRgb(t1, t2, hue - 2) * 255;
  return {r : r, g : g, b : b};
}

function hueToRgb(t1, t2, hue) {
  if (hue < 0) hue += 6;
  if (hue >= 6) hue -= 6;
  if (hue < 1) return (t2 - t1) * hue + t1;
  else if(hue < 3) return t2;
  else if(hue < 4) return (t2 - t1) * (4 - hue) + t1;
  else return t1;
}

function hwbToRgb(hue, white, black) {
  var i, rgb, rgbArr = [];
  rgb = hslToRgb(hue, 1, 0.50);
  rgbArr[0] = rgb.r / 255;
  rgbArr[1] = rgb.g / 255;
  rgbArr[2] = rgb.b / 255;
  for (i = 0; i < 3; i++) {
    rgbArr[i] *= (1 - (white) - (black));
    rgbArr[i] += (white);
    rgbArr[i] = Number(rgbArr[i] * 255);
  }
  return {r : rgbArr[0], g : rgbArr[1], b : rgbArr[2] };
}

// convert rgb object to string
function rgbString(rgb) {
  return "rgb(" + Math.round(rgb.r) + ", "
                + Math.round(rgb.g) + ", "
                + Math.round(rgb.b) + ")";
}
