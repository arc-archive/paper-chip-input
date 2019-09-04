[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/paper-chip-input.svg)](https://www.npmjs.com/package/@advanced-rest-client/paper-chip-input)

[![Build Status](https://travis-ci.org/advanced-rest-client/paper-chip-input.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/paper-chip-input)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/paper-chip-input)

# paper-chip-input

A material design input with chips

**This project is deprecated.** Please, use [anypoint-chip-input](https://github.com/anypoint-web-components/anypoint-chip-input) instead.

```html
<p>Regular input</p>
<paper-chip-input label="Input with chips" value='["Alarm"]' source='[{"value": "Alarm", "icon": "alarm"}]'></paper-chip-input>

<p>Input with suggestions</p>
<paper-chip-input label="Type your favourite fruits" source='["Apple", "Banana", "Blueberry", "Cherry", "Cranberry", "Grape", "Lime"]'></paper-chip-input>
```

## Icons with suggestions

You can specify suggestions containing an icon. It is rendered as a prefix to the chip label.
The icon can be either Polymer's icon defined in `iron-iconset` or an image.

To render icons set suggestions' source to be a list of objects containing `value` property and `icon` or `image`.

```javascript
input.source = [{
  value: 'Icon item',
  icon: 'add'
},
{
  value: 'Image item',
  image: 'path/to/image.png'
}];
```

## Suggestions with ID

You may need to use some other identifier for values than the label of suggestion. It may happen if the rendered label is not unique. The suggestions support the `id` property which is used to compare chips. The `id` is used as a value of the input instead of suggestion's `value`.

For example:

```javascript
input.source = [{
  value: 'Biking',
  icon: 'maps:directions-bike',
  id: 'activity-1'
},
{
  value: 'Boat trip',
  icon: 'maps:directions-boat',
  id: 'activity-2'
}];
```

would produce input value as `["activity-1", "activity-2"]` when both suggestions are selected.

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @advanced-rest-client/paper-chip-input
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@advanced-rest-client/paper-chip-input/paper-chip-input.js';
    </script>
  </head>
  <body>
    <paper-chip-input></paper-chip-input>
  </body>
</html>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@advanced-rest-client/paper-chip-input/paper-chip-input.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <paper-chip-input></paper-chip-input>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Development

```sh
git clone https://github.com/advanced-rest-client/paper-chip-input
cd paper-chip-input
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests
```sh
polymer test
```
