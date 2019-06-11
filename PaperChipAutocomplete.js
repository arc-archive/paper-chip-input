/*
Copyright 2018 Pawel Psztyc, The ARC team
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { LitElement, html, css } from 'lit-element';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-selector/iron-selector.js';
import { ArcScrollTargetMixin } from '@advanced-rest-client/arc-scroll-target-mixin/arc-scroll-target-mixin.js';
import { ArcOverlayMixin } from '@advanced-rest-client/arc-overlay-mixin/arc-overlay-mixin.js';
/**
 * An autocomplete element for `paper-chip-input`.
 * It is a lightweigth version of `paper-autocomplete` element.
 *
 * ### Styling
 *
 * ## Styling
 *
 * `<paper-chip-autocomplete>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--paper-chip-autocomplete-background-color` | Background color of the element. | `inherit`
 * `--box-shadow-2dp` | Value for `box-shadow` set on  this element. | ``
 *
 * `<paper-chip>` provides the following [parts](https://www.w3.org/TR/css-shadow-parts-1/):
 *
 * Part name | Description
 * ----------------|-------------
 * `paper-item` | Styles applied to a paper-item element
 * `paper-chip-autocomplete-item` | The same as `paper-item` but less general.
 *
 * @customElement
 * @memberof UiElements
 * @appliesMixin ArcOverlayMixin
 * @appliesMixin ArcScrollTargetMixin
 * @polymer
 * @demo demo/index.html
 */
export class PaperChipAutocomplete extends ArcOverlayMixin(ArcScrollTargetMixin(LitElement)) {
  static get styles() {
    return css`
    :host {
      box-shadow: var(--box-shadow-2dp,
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2));
      background-color: var(--paper-chip-autocomplete-background-color, #fff);
      overflow: auto;
    }

    paper-item {
      position: relative;
    }`;
  }

  static get properties() {
    return {
      /**
       * List of suggestions to render when the user type in the input field.
       *
       * Each array item can be a string which will be compared to user input.
       * If the item is an object is must contain the `value` property which
       * is used to compare the values. It can also contain `icon` property
       * which is used to render `<iron-icon>`. It may also contain
       * `image` property which is used to pass to `<iron-image>` element.
       *
       * ### Example
       *
       * ```json
       * [
       *  "item 1",
       *  {
       *    "value": "Other item",
       *    "icon": "add"
       *  },
       *  {
       *    "value": "Image item",
       *    "image": "path/to/image.png"
       *  }
       * ]
       * ```
       *
       * @type {Object<Stirng|Object>}
       */
      source: { type: Array },
      /**
       * The value of the input field connected to this autocomplete
       */
      value: { type: String },
      /**
       * List of computed and sotred suggestion to render.
       * @type {Array<Object>}
       */
      _suggestions: { type: Array },
      /**
       * Computed value, `true` if has any suggestions to render.
       */
      _hasSuggestions: { type: Boolean },
      /**
       * Application's / parent element's scroll target element.
       * @type {HTMLElement}
       */
      scrollTarget: { type: Object },
      /**
       * Sizing target element. It is used to compute the size of the
       * autocomplete container.
       * @type {HTMLElement}
       */
      sizingTarget: { type: Object },
      /**
       * The input element used to input value.
       * It is used to observe keys pressed
       * @type {HTMLElement}
       */
      inputTarget: { type: Object },
      /**
       * Currently selected item on a suggestions list.
       * @type {Number}
       */
      selectedItem: { type: Number }
    };
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this._computeSuggestions(value, this.source);
  }

  /**
   * True if the overlay is currently displayed.
   */
  get opened() {
    return this._opened || false;
  }

  set opened(value) {
    if (value === this._opened) {
      return;
    }
    this._opened = value;
    this._openedChanged(value);
    this.__updateScrollObservers(this._isAttached, value, this.scrollAction);
    this.dispatchEvent(new CustomEvent('opened-changed', {
      composed: true,
      detail: {
        value
      }
    }));
  }

  get source() {
    return this._source;
  }

  set source(value) {
    this._source = value;
    this._computeSuggestions(this.value, value);
  }

  get _hasSuggestions() {
    return this.__hasSuggestions;
  }

  set _hasSuggestions(value) {
    const oldValue = this.__hasSuggestions;
    this.__hasSuggestions = value;
    this.requestUpdate('_hasSuggestions', oldValue);
    this._hasSuggestionsChanged(value);
  }

  constructor() {
    super();
    this.selectedItem = 0;
    this.sizingTarget = this;
    this.scrollTarget = this;

    this._selectedItemChanged = this._selectedItemChanged.bind(this);
    this._itemClickHandler = this._itemClickHandler.bind(this);
    this._selectPreviousHandler = this._selectPreviousHandler.bind(this);
    this._selectNextHandler = this._selectNextHandler.bind(this);
    this._acceptSelectionHandler = this._acceptSelectionHandler.bind(this);
  }

  _computeSuggestions(value, source) {
    if (!value || !source || !source.length) {
      this._suggestions = undefined;
      this._hasSuggestions = false;
      return;
    }
    const result = [];
    const lowerValue = value.toLowerCase();
    for (let i = 0, len = source.length; i < len; i++) {
      const suggestion = source[i];
      const isStringType = typeof suggestion === 'string';
      const inputLabel = isStringType ? suggestion : suggestion.value;
      const lowerLabel = inputLabel && inputLabel.toLowerCase();
      if (!lowerLabel) {
        continue;
      }
      if (lowerLabel.indexOf(lowerValue) !== -1) {
        const item = !isStringType ? suggestion : {
          value: inputLabel
        };
        result.push(item);
      }
    }
    if (result.length) {
      result.sort((a, b) => {
        return a.value > b.value ? 1 : a.value < b.value ? -1 : 0;
      });
      this._suggestions = result;
      this._hasSuggestions = true;
    } else {
      this._suggestions = undefined;
      this._hasSuggestions = false;
    }
  }
  /**
   * Opens the suggestions if list of suggestions changed
   *
   * @param {Boolean} hasSuggestions
   */
  _hasSuggestionsChanged(hasSuggestions) {
    if (hasSuggestions && !this.opened) {
      this.opened = true;
    } else if (!hasSuggestions && this.opened) {
      this.opened = false;
    }
  }

  /**
   * Highlight previous suggestion
   */
  selectPrevious() {
    const suggestions = this._suggestions;
    if (!suggestions || !suggestions.length) {
      return;
    }
    if (!this.opened) {
      this.opened = true;
    }
    this.shadowRoot.querySelector('#selector').selectPrevious();
    this.ensureItemVisible(false);
  }
  /**
   * Highlight next suggestion
   */
  selectNext() {
    const suggestions = this._suggestions;
    if (!suggestions || !suggestions.length) {
      return;
    }
    if (!this.opened) {
      this.opened = true;
    }
    this.shadowRoot.querySelector('#selector').selectNext();
    this.ensureItemVisible(true);
  }

  /**
   * Accepts currently selected suggestion and enters it into a text field.
   */
  acceptSelection() {
    const suggestions = this._suggestions;
    const value = suggestions && suggestions[this.selectedItem];
    if (!this._opened || !value) {
      return;
    }
    setTimeout(() => this._inform(value), 1);
  }
  /**
   * Dispatches non bubbling `selected` custom event.
   * @param {Object} value Selected suggestion value.
   */
  _inform(value) {
    const ev = new CustomEvent('selected', {
      detail: {
        value
      },
      composed: true
    });
    this.dispatchEvent(ev);
    this.opened = false;
  }

  /**
   * Ensure that the selected item is visible in the scroller.
   * When there is more elements to show than space available (height)
   * then some elements will be hidden. When the user use arrows to navigate
   * the selection may get out from the screen. This function ensures that
   * currently selected element is visible.
   *
   * @param {Boolean} bottom If trully it will ensure that the element is
   * visible at the bottom of the container. On the top otherwise.
   */
  ensureItemVisible(bottom) {
    const suggestions = this._suggestions;
    if (!this.opened || !suggestions || !suggestions.length) {
      return;
    }
    const container = this.scrollTarget;
    const index = this.shadowRoot.querySelector('#selector').selected;
    if (bottom && index === 0) {
      this.scroll(0);
      return;
    }
    let toMove;
    if (!bottom && index === suggestions.length - 1) {
      toMove = container.scrollHeight - container.offsetHeight;
      this.scroll(0, toMove);
      return;
    }
    const item = this.shadowRoot.querySelector('#selector').selectedItem;
    const containerOffsetHeight = bottom ? container.offsetHeight : 0;
    const itemOffsetHeight = bottom ? item.offsetHeight : 0;
    const visible = containerOffsetHeight + container.scrollTop;
    const treshold = item.offsetTop + itemOffsetHeight;
    if (bottom && treshold > visible) {
      toMove = item.offsetHeight + item.offsetTop - container.offsetHeight;
      this.scroll(0, toMove);
    } else if (!bottom && visible > treshold) {
      this.scroll(0, treshold);
    }
  }

  _itemClickHandler(e) {
    const index = Number(e.target.dataset.index);
    if (isNaN(index)) {
      return;
    }
    const suggestions = this._suggestions;
    const model = suggestions && suggestions[index];
    setTimeout(() => this._inform(model), 1);
  }

  _selectedItemChanged(e) {
    this.selectedItem = e.detail.value;
  }

  _selectPreviousHandler() {
    this.selectPrevious();
  }

  _selectNextHandler() {
    this.selectNext();
  }

  _acceptSelectionHandler() {
    this.acceptSelection();
  }

  _suggestionsTemplate() {
    if (!this._hasSuggestions) {
      return undefined;
    }
    return this._suggestions.map((item, index) => html`
    <paper-item data-index="${index}" @click="${this._itemClickHandler}" part="paper-item paper-chip-autocomplete-item">
      <span>${item.value}</span>
      <paper-ripple></paper-ripple>
    </paper-item>`);
  }

  render() {
    return html`
    <iron-selector .selected="${this.selectedItem}" @selected-changed="${this._selectedItemChanged}" id="selector">
      ${this._suggestionsTemplate()}
    </iron-selector>
    <iron-a11y-keys .target="${this.inputTarget}" keys="up"
      @keys-pressed="${this._selectPreviousHandler}"></iron-a11y-keys>
    <iron-a11y-keys .target="${this.inputTarget}" keys="down"
      @keys-pressed="${this._selectNextHandler}"></iron-a11y-keys>
    <iron-a11y-keys .target="${this.inputTarget}" keys="enter"
      @keys-pressed="${this._acceptSelectionHandler}"></iron-a11y-keys>
    <iron-a11y-keys .target="${this.scrollTarget}" keys="up"
      @keys-pressed="${this._selectPreviousHandler}"></iron-a11y-keys>
    <iron-a11y-keys .target="${this.scrollTarget}" keys="down"
      @keys-pressed="${this._selectNextHandler}"></iron-a11y-keys>
    <iron-a11y-keys .target="${this.scrollTarget}"
      keys="enter" @keys-pressed="${this._acceptSelectionHandler}"></iron-a11y-keys>`;
  }

  /**
   * Dispatched when suggestion is selected
   *
   * @event selected
   * @param {Object} value The suggestion object.
   */
}
