# FarbtasticColorPicker

`jQuery` needed and add `farbtastic-color-wheel.js` `farbtastic-color-wheel.css` to your html.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>

<script src="javascripts/farbtastic-color-wheel.js"></script>
<link rel="stylesheet" type="text/css" href="stylesheets/farbtastic-color-wheel.css">
```

## Html

color picker html

```html
<div id='colorContainer' class='color-container'>
  <canvas id='colorWheel' class='color-canvas'></canvas>
  <canvas id='colorRect' class='color-canvas'></canvas>
  <div id='sliderWheel' class='slider-wrapper'>
    <div id='controlWheel' class='slider-button'></div>
  </div>
  <div id='sliderMask' class='slider-wrapper'></div>
  <div id='sliderRect' class='slider-wrapper'>
    <div id='controlRect' class='slider-button'></div>
  </div>
</div>
```

## Color Picker Size

color picker and slider's variable

```scss
$container: 400px;
$slider: 20px;
$slider-border: 3px;
```

## Action

edit `farbtastic-color-wheel.js` function `colorChange` if you want to do something when changing color.

```javascript
// ar
function colorChange(){
  var rgb = getRectColor();

  // do something
  $('#status').html(rgbString(rgb));
  $('#box').css('background-color', rgbString(rgb));
}
```

## Demo page

- [Codepen](http://codepen.io/AkiiCat/pen/LRQXYd/)
- [Codepen Full Page](http://codepen.io/AkiiCat/full/LRQXYd/)
