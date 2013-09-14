# toolbar

keyboard selectable toolbar for selecting an active tool

when users hit 0-9 on their keyboard or click an item on the toolbar `toolbar` will emit a javascript event that will tell you which item in the toolbar has been selected

## install

step 1:

`npm install toolbar`

step 2: 

include some html in your page that looks like this:

```html
<nav class="bar-tab">
  <ul class="tab-inner">
    <li class="tab-item active">
      <a href="">
        <img class="tab-icon" src="icons/first-tool.png">
        <div class="tab-label">First Tool</div>
      </a>
    </li>
    <li class="tab-item">
      <a href="">
        <img class="tab-icon" src="icons/second-tool.png">
        <div class="tab-label">Second Tool</div>
      </a>
    </li>
  </ul>
</nav>
```

step 3:

```javascript
var toolbar = require('toolbar')
var bartab = toolbar('.bar-tab')
```

use [browserify](http://browserify.org/) to package toolbar for use in your client side app!

step 4:

```javascript
bartab.on('select', function(item) {
  // item is the .tab-label innerText
})
```

## programmatically modify toolbar contents

* setContent - clear and set the toolbar items
* addContent - append a toolbar item to the end (right-most side)
* emptyContent - remove all items from the toolbar

```javascript
bartab.setContent([{
  icon:'icons/poptart.png',
  label:'has icon',
  id:'poptart',
},{
  icon:'icons/toast.png',
  label:'no icon',
  id:'toast',
}])

bartab.emptyContent()

bartab.addContent({
  icon:'icons/toast.png',
  label:'yummy toast',
  id:'toast',
})
```

## bonus advice

to convert svgs from the noun project into cute little transparent pngs:

`mogrify -fill "#ffffff" -opaque "#000000" -background none -format png *.svg`

## license

BSD