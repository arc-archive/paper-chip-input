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
import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {PaperChipInputMixin} from './paper-chip-input-mixin.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/paper-input/paper-input.js';
import '@advanced-rest-client/paper-chip/paper-chip.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/iron-icon/iron-icon.js';
import './paper-chip-autocomplete.js';
/**
 * `paper-chip-input`
 *
 * A material design input with material design chips.
 *
 * It renders chips on the left hand side of the input. It is added as an
 * add-on of the `paper-input` element.
 *
 * It allows to provide list of suggestions that are rendered is user input
 * allows to render suggestions.
 *
 * ## Example
 *
 * ```html
 * <paper-chip-input
 *  label="List your favourite fruits"
 *  required
 *  auto-validate
 *  name="fruits"
 *  allowed='["apple","Orange","BANANA"]'
 *  source='["Apple", "Apricot", 'Banana',"Orange"]'
 *  pattern="[a-zA-Z]+"
 *  error-message="This is not a fruit name!"></paper-chip-input>
 * ```
 *
 * ## Styling
 *
 * `<paper-chip-input>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 *
 * Use `paper-input` and `paper-chip` styles to style the element.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin PaperChipInputMixin
 */
class PaperChipInput extends PaperChipInputMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      position: relative;

      --paper-input-container-input: {
        min-width: 170px;
      };
    }

    .chips {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
    }
    </style>
    <paper-input
      class="input-input"
      always-float-label="[[alwaysFloatLabel]]"
      no-label-float="[[!alwaysFloatLabel]]"
      auto-validate="[[autoValidate]]"
      disabled="[[disabled]]"
      readonly="[[readonly]]"
      value="{{_value}}"
      label="[[label]]"
      allowed-pattern="[[allowedPattern]]"
      pattern="[[pattern]]"
      char-counter="[[charCounter]]"
      invalid="{{invalid}}"
      error-message="[[errorMessage]]"
      validator="[[validator]]"
      autofocus="[[autofocus]]"
      inputmode="[[inputmode]]"
      minlength="[[minlength]]"
      maxlength="[[maxlength]]"
      name="[[name]]"
      placeholder="[[placeholder]]"
      autocapitalize="[[autocapitalize]]"
      autocorrect="[[autocorrect]]"
      autosave="[[autosave]]"
      on-blur="_inputBlur">
      <div class="chips" slot="prefix">
        <template is="dom-repeat" items="[[chips]]">
          <paper-chip
            removable="[[_computeChipRemovable(item)]]"
            on-chip-removed="_chipRemovedHandler"
            on-focus="_chipFocused"
            tabindex="-1"
            remove-icon="[[chipRemoveIcon]]">
            <template is="dom-if" if="[[item.icon]]" restamp="true">
              <iron-icon icon="[[item.icon]]" slot="icon"></iron-icon>
            </template>
            [[item.label]]
          </paper-chip>
        </template>
      </div>
    </paper-input>
    <paper-chip-autocomplete
      source="[[source]]" value="[[_value]]"
      position-target="[[_positionTarget]]"
      input-target="[[_inputElement]]"
      dynamic-align=""
      vertical-align="top"
      vertical-offset="36"
      horizontal-align="left"
      on-selected="_suggestionSelected"
      opened="{{_suggestionsOpened}}"></paper-chip-autocomplete>
    <iron-a11y-keys
      target="[[_inputElement]]"
      keys="enter" on-keys-pressed="_enterHandler"></iron-a11y-keys>
    <iron-a11y-keys
      target="[[_inputElement]]"
      keys="backspace" on-keys-pressed="_backspaceHandler"></iron-a11y-keys>`;
  }

  static get is() {
    return 'paper-chip-input';
  }

  static get properties() {
    return {
      /**
       * True if the suggestions box is currently opened.
       * Prevents `enter` from accepting the value.
       */
      _suggestionsOpened: Boolean,
      /**
       * `iron-input` from the paper input to position auto suggestions
       * properly to the input real position.
       */
      _positionTarget: Object,
      /**
       * A name of the icon to render on the chip when `removable` property
       * is set.
       * By default it referes to Polymer's default icons library, to the
       * `clear` icon. You must include this library into your document.
       * You can also use whatever other icons library.
       */
      chipRemoveIcon: String
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._positionTarget = this._inputElement.inputElement;
  }
  /**
   * Listens for Enter key click and accepts the chip value if it can
   * be accepted.
   */
  _enterHandler() {
    if (this._suggestionsOpened || !this.shadowRoot.querySelector('paper-input').validate()) {
      return;
    }
    const value = this._value;
    if (!value) {
      return;
    }
    const lowerValue = value.toLowerCase();
    const source = this._findSource(this.source, lowerValue);
    const id = source && source.id;
    if (!this._isAllowed(value, id)) {
      return;
    }
    const icon = source && source.icon;
    this.addChip(value, true, icon, id);
    this._value = '';
  }
  /**
   * Removes latest chip if there's no value in the text field.
   */
  _backspaceHandler() {
    const chips = this.chips;
    if (this._value || !chips || !chips.length) {
      return;
    }
    let removeIndex = -1;
    for (let i = chips.length - 1; i >= 0; i--) {
      if (chips[i].removable) {
        removeIndex = i;
        break;
      }
    }
    if (removeIndex === -1) {
      return;
    }
    const chip = chips[removeIndex];
    this._removeChip(removeIndex);
    setTimeout(() => {
      this._value = chip.label;
    });
  }
  /**
   * Handler for `chip-removed` event.
   * @param {CustomEvent} e
   */
  _chipRemovedHandler(e) {
    const index = e.model.get('index');
    this._removeChip(index);
  }
  /**
   * Inserts chip from suggestion.
   * @param {CustomEvent} e
   */
  _suggestionSelected(e) {
    const item = e.detail.value;
    if (!this._isAllowed(item.value, item.id)) {
      return;
    }
    this.addChip(item.value, true, item.icon, item.id);
    this._value = '';
    setTimeout(() => {
      this._inputElement.inputElement.focus();
    });
  }
  /**
   * Chips are focusable elements and they work really
   * bed with paper-input as an addon.
   * This cancels the event so paper-input won't become focused.
   *
   * @param {ClickEvent} e
   */
  _chipFocused(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    this._inputElement.blur();
  }

  _inputBlur() {
    if (this._value) {
      this._enterHandler();
    }
    // Chip looses it's focus right after getting it as input stills the focus.
    // const chips = this.shadowRoot.querySelectorAll('paper-chip');
    // for (let i = 0, len = chips.length; i < len; i++) {
    //   if (chips[i].focused) {
    //     chips[i]._focusBlurHandler({});
    //   }
    // }
  }
}
window.customElements.define(PaperChipInput.is, PaperChipInput);
