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
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '../../@polymer/polymer/lib/legacy/class.js';
import '../../@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../../@polymer/paper-ripple/paper-ripple.js';
import '../../@polymer/paper-item/paper-item.js';
import '../../@polymer/iron-selector/iron-selector.js';
import {IronScrollTargetBehavior} from '../../@polymer/iron-scroll-target-behavior/iron-scroll-target-behavior.js';
import {IronOverlayBehavior} from '../../@polymer/iron-overlay-behavior/iron-overlay-behavior.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
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
 *
 * @customElement
 * @memberof UiElements
 * @appliesMixin Polymer.IronOverlayBehavior
 * @appliesMixin Polymer.IronScrollTargetBehavior
 * @polymer
 * @demo demo/index.html
 */
class PaperChipAutocomplete extends
  mixinBehaviors(
    [IronOverlayBehavior, IronScrollTargetBehavior], PolymerElement) {
  static get template() {
    return html`
    <style>
    :host {
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                  0 1px 5px 0 rgba(0, 0, 0, 0.12),
                  0 3px 1px -2px rgba(0, 0, 0, 0.2);
      background-color: var(--paper-chip-autocomplete-background-color);
      overflow: auto;
    }

    paper-item {
      position: relative;
    }
    </style>
    <iron-selector selected="{{selectedItem}}" id="selector">
      <template is="dom-repeat" items="[[_suggestions]]" id="repeater">
        <paper-item on-click="_itemClickHandler">
          <span>[[item.value]]</span>
          <paper-ripple></paper-ripple>
        </paper-item>
      </template>
    </iron-selector>
    <iron-a11y-keys id="a11y" target="[[inputTarget]]" keys="up" on-keys-pressed="selectPrevious"></iron-a11y-keys>
    <iron-a11y-keys id="a11y" target="[[inputTarget]]" keys="down" on-keys-pressed="selectNext"></iron-a11y-keys>
    <iron-a11y-keys id="a11y" target="[[inputTarget]]" keys="enter" on-keys-pressed="acceptSelection"></iron-a11y-keys>
    <iron-a11y-keys id="a11y" target="[[scrollTarget]]" keys="up" on-keys-pressed="selectPrevious"></iron-a11y-keys>
    <iron-a11y-keys id="a11y" target="[[scrollTarget]]" keys="down" on-keys-pressed="selectNext"></iron-a11y-keys>
    <iron-a11y-keys id="a11y" target="[[scrollTarget]]"
      keys="enter" on-keys-pressed="acceptSelection"></iron-a11y-keys>`;
  }

  static get is() {
    return 'paper-chip-autocomplete';
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
      source: {type: Array},
      /**
       * The value of the input field connected to this autocomplete
       */
      value: String,
      /**
       * List of computed and sotred suggestion to render.
       * @type {Array<Object>}
       */
      _suggestions: {
        type: Array,
        computed: '_computeSuggestions(value,source)'
      },
      /**
       * Computed value, `true` if has any suggestions to render.
       */
      _hasSuggestions: {
        type: Boolean,
        computed: '_computeHasSuggestions(_suggestions)',
        observer: '_hasSuggestionsChanged'
      },
      /**
       * Application's / parent element's scroll target element.
       * @type {HTMLElement}
       */
      scrollTarget: {
        type: Object,
        value: function() {
          return this;
        }
      },
      /**
       * Sizing target element. It is used to compute the size of the
       * autocomplete container.
       * @type {HTMLElement}
       */
      sizingTarget: {
        type: Object,
        value: function() {
          return this;
        }
      },
      /**
       * The input element used to input value.
       * It is used to observe keys pressed
       * @type {HTMLElement}
       */
      inputTarget: Object,
      /**
       * Currently selected item on a suggestions list.
       * @type {Number}
       */
      selectedItem: {
        type: Number,
        value: 0
      }
    };
  }

  _computeSuggestions(value, source) {
    if (!value || !source || !source.length) {
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
      return result;
    }
  }
  /**
   * Computes value for `hasSuggestions` property
   * @param {?Array<Object>} suggestions Computed suggestions
   * @return {Boolean}
   */
  _computeHasSuggestions(suggestions) {
    return !!(suggestions && suggestions.length);
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
    this.$.selector.selectPrevious();
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
    this.$.selector.selectNext();
    this.ensureItemVisible(true);
  }

  /**
   * Accepts currently selected suggestion and enters it into a text field.
   */
  acceptSelection() {
    const suggestions = this._suggestions;
    const item = this.$.selector.selectedItem;
    if (!this.opened || !suggestions || !suggestions.length || !item) {
      return;
    }
    const value = this.$.repeater.itemForElement(item);
    setTimeout(() => this._inform(value), 1);
  }
  /**
   * Dispatches non bubbling `selected` custom event.
   * @param {Object} value Selected suggestion value.
   */
  _inform(value) {
    const ev = new CustomEvent('selected', {
      detail: {
        value: value
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
    const index = this.$.selector.selected;
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
    const item = this.$.selector.selectedItem;
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
    const model = e.model.get('item');
    setTimeout(() => this._inform(model), 1);
  }

  /**
   * Dispatched when suggestion is selected
   *
   * @event selected
   * @param {Object} value The suggestion object.
   */
}
window.customElements.define(PaperChipAutocomplete.is, PaperChipAutocomplete);
