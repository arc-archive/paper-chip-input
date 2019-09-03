/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
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
/**
 * A behavior to be implemented with inputs that uses `paper-chips`.
 *
 * @param {Class} superClass
 * @return {Class}
 * @mixinFunction
 * @memberof ArcBehaviors
 */
export const PaperChipInputMixin = (superClass) => class extends superClass {
  static get properties() {
    return {
      /**
       * A paper input element.
       */
      _inputElement: Object,
      /**
       * The label for this input. If you're using PaperInputBehavior to
       * implement your own paper-input-like element, bind this to
       * `<label>`'s content and `hidden` property, e.g.
       * `<label hidden$="[[!label]]">[[label]]</label>` in your `template`
       */
      label: {
        type: String
      },
      /**
       * The value for this input. If you're using PaperInputBehavior to
       * implement your own paper-input-like element, bind this to
       * the `<iron-input>`'s `bindValue`
       * property, or the value property of your input that is `notify:true`.
       * @type {*}
       */
      value: {
        type: Array,
      },
      /**
       * Set to true to disable this input. If you're using PaperInputBehavior to
       * implement your own paper-input-like element, bind this to
       * both the `<paper-input-container>`'s and the input's `disabled` property.
       */
      disabled: {
        type: Boolean
      },
      /**
       * Returns true if the value is invalid. If you're using PaperInputBehavior
       * to implement your own paper-input-like element, bind this to both the
       * `<paper-input-container>`'s and the input's `invalid` property.
       *
       * If `autoValidate` is true, the `invalid` attribute is managed
       * automatically, which can clobber attempts to manage it manually.
       */
      invalid: {
        type: Boolean,
        reflect: true
      },
      /**
       * Set this to specify the pattern allowed by `preventInvalidInput`. If
       * you're using PaperInputBehavior to implement your own paper-input-like
       * element, bind this to the `<input is="iron-input">`'s `allowedPattern`
       * property.
       */
      allowedPattern: {
        type: String
      },
      /**
       * When set, it reduces height of the button and hides
       * the label when the value is provided.
       *
       * Use it carefully as user should be able to recognize the input
       * when the value is predefined.
       */
      noLabelFloat: {
        type: Boolean
      },
      /**
       * A pattern to validate the `input` with. If you're using
       * PaperInputBehavior to implement your own paper-input-like element, bind
       * this to the `<input is="iron-input">`'s `pattern` property.
       */
      pattern: {
        type: String
      },
      /**
       * Set to true to mark the input as required. If you're using
       * PaperInputBehavior to implement your own paper-input-like element, bind
       * this to the `<input is="iron-input">`'s `required` property.
       */
      required: {
        type: Boolean
      },
      /**
       * The error message to display when the input is invalid. If you're using
       * PaperInputBehavior to implement your own paper-input-like element,
       * bind this to the `<paper-input-error>`'s content, if using.
       */
      invalidMessage: {
        type: String
      },
      /**
       * Set to true to show a character counter.
       */
      charCounter: {
        type: Boolean
      },
      /**
       * Set to true to auto-validate the input value. If you're using
       * PaperInputBehavior to implement your own paper-input-like element, bind
       * this to the `<paper-input-container>`'s `autoValidate` property.
       */
      autoValidate: {
        type: Boolean
      },
      /**
       * Name of the validator to use. If you're using PaperInputBehavior to
       * implement your own paper-input-like element, bind this to
       * the `<input is="iron-input">`'s `validator` property.
       */
      validator: {
        type: String
      },
      /**
       * If you're using PaperInputBehavior to implement your own paper-input-like
       * element, bind this to the `<input is="iron-input">`'s `autofocus`
       * property.
       */
      autofocus: {
        type: Boolean
      },
      /**
       * If you're using PaperInputBehavior to implement your own paper-input-like
       * element, bind this to the `<input is="iron-input">`'s `inputmode`
       * property.
       */
      inputmode: {
        type: String
      },
      /**
       * The minimum length of the input value.
       * If you're using PaperInputBehavior to implement your own paper-input-like
       * element, bind this to the `<input is="iron-input">`'s `minlength`
       * property.
       */
      minlength: {
        type: Number
      },
      /**
       * The maximum length of the input value.
       * If you're using PaperInputBehavior to implement your own paper-input-like
       * element, bind this to the `<input is="iron-input">`'s `maxlength`
       * property.
       */
      maxlength: {
        type: Number
      },
      /**
       * If you're using PaperInputBehavior to implement your own paper-input-like
       * element, bind this to the `<input is="iron-input">`'s `name` property.
       */
      name: {
        type: String
      },
      /**
       * A placeholder string in addition to the label. If this is set, the label
       * will always float.
       */
      placeholder: {
        type: String,
        // need to set a default so _computeAlwaysFloatLabel is run
      },
      /**
       * If you're using PaperInputBehavior to implement your own paper-input-like
       * element, bind this to the `<input is="iron-input">`'s `readOnly`
       * property.
       */
      readOnly: {
        type: Boolean
      },
      /**
       * If you're using PaperInputBehavior to implement your own paper-input-like
       * element, bind this to the `<input is="iron-input">`'s `autocapitalize`
       * property.
       */
      autocapitalize: {
        type: String
      },
      /**
       * If you're using PaperInputBehavior to implement your own paper-input-like
       * element, bind this to the `<input is="iron-input">`'s `autocorrect`
       * property.
       */
      autocorrect: {
        type: String
      },
      /**
       * If you're using PaperInputBehavior to implement your own paper-input-like
       * element, bind this to the `<input is="iron-input">`'s `autosave`
       * property, used with type=search.
       */
      autosave: {
        type: String
      },
      /**
       * A list of chip items to render
       * @type {Array<Object>} Each array item must have `label` property
       * for the chip. It can contain `removable` property it the chip can
       * be removed. It is added by default when chip's source is user input.
       */
      chips: {
        type: Array
      },
      /**
       * Actual paper-input value
       */
      _inputValue: {
        type: String
      },
      /**
       * List of allowed chips labels. Character case does not matter.
       * @type {Array<String>}
       */
      allowed: {
        type: Array
      },
      /**
       * List of suggestions to render when the user type in the input field.
       *
       * Each array item can be a string which will be compared to user input.
       * If the item is an object is must contain the `value` property which
       * is used to compare the values. It can also contain `icon` property
       * which is used to render `<iron-icon>`. It may also contain
       * `image` property which is used to pass to `<iron-image>` element.
       *
       * If the suggestion item contains `id` property it's value will be returned
       * as a value of the input. Otherwise `value` is used.
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
       *  },
       *  {
       *    "value": "Rendered label",
       *    "id": "returned-value"
       *  }
       * ]
       * ```
       *
       * @type {Object<Stirng|Object>}
       */
      source: {
        type: Array
      }
    };
  }

  get value() {
    return this._value;
  }

  set value(value) {
    const oldValue = this._value;
    if (oldValue === value) {
      return;
    }
    this._value = value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      composed: true,
      detail: {
        value
      }
    }));
    this.requestUpdate('value', oldValue);
    this._computeChipsValues(value, this.source);
  }

  get autofocus() {
    return this._autofocus;
  }

  set autofocus(value) {
    const oldValue = this._autofocus;
    this._autofocus = value;
    this.requestUpdate('autofocus', oldValue);
    this._autofocusChanged();
  }

  get invalid() {
    return this._invalid;
  }

  set invalid(value) {
    const oldValue = this._invalid;
    if (oldValue === value) {
      return;
    }
    this._invalid = value;
    this.requestUpdate('invalid', oldValue);
    this.dispatchEvent(new CustomEvent('invalid-changed', {
      composed: true,
      detail: {
        value
      }
    }));
  }

  get chips() {
    return this._chips;
  }

  set chips(value) {
    const oldValue = this._chips;
    if (oldValue === value) {
      return;
    }
    this._chips = value;
    this.requestUpdate('chips', oldValue);
    this._computeValue(value);
    this.dispatchEvent(new CustomEvent('chips-changed', {
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
    const oldValue = this._source;
    this._source = value;
    this.requestUpdate('source', oldValue);
    this._computeChipsValues(this.value, value);
    if (value && value.length) {
      this.setAttribute('aria-autocomplete', 'list');
    } else {
      this.removeAttribute('aria-autocomplete');
    }
  }

  get readOnly() {
    return this._readOnly;
  }

  set readOnly(value) {
    const oldValue = this._readOnly;
    if (oldValue === value) {
      return;
    }
    this._readOnly = value;
    this.requestUpdate('readOnly', oldValue);
    if (value) {
      this.setAttribute('aria-readonly', 'true');
    } else {
      this.removeAttribute('aria-readonly');
    }
  }

  get required() {
    return this._required;
  }

  set required(value) {
    const oldValue = this._required;
    if (oldValue === value) {
      return;
    }
    this._required = value;
    this.requestUpdate('required', oldValue);
    if (value) {
      this.setAttribute('aria-required', 'true');
    } else {
      this.removeAttribute('aria-required');
    }
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    const oldValue = this._disabled;
    if (oldValue === value) {
      return;
    }
    this._disabled = value;
    this.requestUpdate('disabled', oldValue);
    if (value) {
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute('aria-disabled');
    }
  }
  /**
   * @return {Function} Previously registered handler for `value-changed` event
   */
  get onchanged() {
    return this['_onvalue-changed'];
  }
  /**
   * Registers a callback function for `value-changed` event
   * @param {Function} value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onchanged(value) {
    this._registerCallback('value-changed', value);
  }
  /**
   * @return {Function} Previously registered handler for `invalid-changed` event
   */
  get oninvalid() {
    return this['_oninvalid-changed'];
  }
  /**
   * Registers a callback function for `invalid-changed` event
   * @param {Function} value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set oninvalid(value) {
    this._registerCallback('invalid-changed', value);
  }
  /**
   * @return {Function} Previously registered handler for `chips-changed` event
   */
  get onchipschanged() {
    return this['_onchips-changed'];
  }
  /**
   * Registers a callback function for `chips-changed` event
   * @param {Function} value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onchipschanged(value) {
    this._registerCallback('chips-changed', value);
  }

  constructor() {
    super();
    this.autocorrect = 'off';
    this.autocapitalize = 'none';
    this.placeholder = '';
    this.alwaysFloatLabel = false;
  }

  firstUpdated() {
    this._inputElement = this.shadowRoot.querySelector('.input-input');
    if (!this._inputElement.hasAttribute('tabindex')) {
      this._inputElement.setAttribute('tabindex', 0);
    }
  }

  _registerCallback(eventType, value) {
    const key = `_on${eventType}`;
    if (this[key]) {
      this.removeEventListener(eventType, this[key]);
    }
    if (typeof value !== 'function') {
      this[key] = null;
      return;
    }
    this[key] = value;
    this.addEventListener(eventType, value);
  }

  /**
   * Validates the input element and sets an error style if needed.
   *
   * @return {boolean}
   */
  validate() {
    if (this.chips === undefined) {
      return true;
    }
    const hasChips = this.chips && this.chips.length;
    if (this.required && !hasChips) {
      this._inputElement.invalid = true;
      return false;
    }
    return this._inputElement.validate();
  }

  _autofocusChanged() {
    if (this.autofocus && this._inputElement) {
      const activeElement = document.activeElement;
      const isActiveElementValid = activeElement instanceof HTMLElement;
      const isSomeElementActive = isActiveElementValid &&
        activeElement !== document.body &&
        activeElement !== document.documentElement;
      if (!isSomeElementActive) {
        this._inputElement.focus();
      }
    }
  }
  /**
   * Computes value for paper-chip's `removable` property.
   * @param {Object} item `chips` list item.
   * @return {Boolean}
   */
  _computeChipRemovable(item) {
    return !!(item && item.removable);
  }
  /**
   * Adds a new chip to the list of chips.
   * @param {String} label Label of the chip
   * @param {?Boolean} removable True if the chip can be removed.
   * @param {?String} icon An icon to pass to the chip.
   * @param {?String} id An ID to be used as a value.
   */
  addChip(label, removable, icon, id) {
    const chips = this.chips || [];
    for (let i = 0, len = chips.length; i < len; i++) {
      if (chips[i].label === label) {
        // TODO: highlight the chip?
        return;
      }
    }
    this.chips = [...chips, {
      label,
      removable,
      icon,
      id
    }];
  }
  /**
   * Computes value of the form input. Produced value is an array of chip
   * labels.
   * @param {Array|undefined} chips Current chips value.
   */
  _computeValue(chips) {
    if (this._cancelValueComputation) {
      return;
    }
    const result = (chips || []).map((item) => item.id || item.label);
    this._cancelValueComputation = true;
    this.value = result;
    this._cancelValueComputation = false;
  }
  /**
   * Restores chips from passed value.
   * When input's (this element) value change it computes list of chips
   * @param {Array<Object>} value List of chips definitions
   * @param {Array<Object>} source List of suggestions
   */
  _computeChipsValues(value, source) {
    if (this._cancelValueComputation) {
      return;
    }
    if (!value || !value.length) {
      if (this.chips) {
        this.chips = [];
      }
      return;
    }
    source = source || [];
    const newChips = [];
    for (let i = 0, len = value.length; i < len; i++) {
      const _value = value[i];
      if (!_value || typeof _value !== 'string') {
        continue;
      }
      const _lowerValue = _value.toLowerCase();
      const _source = this._findSource(source, _lowerValue, _value);
      const chip = {
        removable: true
      };
      if (_source && typeof _source === 'object') {
        chip.label = _source.value;
        chip.icon = _source.icon;
        chip.id = _source.id;
      } else {
        chip.label = _value;
      }
      newChips[newChips.length] = chip;
    }
    this.chips = newChips;
  }
  /**
   * Finsd a suggestion source in the list of suggestions.
   * Primarly it looks for a value (lowercasing it) and then it compares
   * `id` if defined.
   * @param {Array<Object|String>} source List of suggestions passed to the element
   * @param {String} value Search value. Should be lowercased before calling this function
   * @param {?String} id Optional ID to compare.
   * @return {String|Object|undefined} Suggestion source or undefined if not found.
   */
  _findSource(source, value, id) {
    if (!source || !source.length) {
      return;
    }
    for (let i = 0; i < source.length; i++) {
      const item = source[i];
      if (typeof item === 'string') {
        if (!item) {
          // Empty string
          continue;
        }
        const lowerItem = item.toLowerCase();
        if (lowerItem === value || lowerItem === id) {
          return item;
        }
        continue;
      }
      const itemValue = source[i].value;
      if (itemValue && typeof itemValue === 'string' && itemValue.toLowerCase() === value) {
        return item;
      }
      if (!id) {
        continue;
      }
      const itemId = source[i].id;
      if (itemId && itemId === id) {
        return item;
      }
    }
  }
  /**
   * Tests if given value is allowed to enter when `allowed` property is set.
   * @param {String} value The value to test
   * @param {?String} id The Suggestion id, if any.
   * @return {Boolean} True if the value is allowed as a chip label.
   */
  _isAllowed(value, id) {
    const allowed = this.allowed;
    if (!allowed || !allowed.length || !value) {
      return true;
    }
    const lowerValue = value.toLowerCase();
    for (let i = 0, len = allowed.length; i < len; i++) {
      if (id && id === allowed[i]) {
        return true;
      }
      if (allowed[i].toLowerCase && allowed[i].toLowerCase() === lowerValue) {
        return true;
      }
    }
    return false;
  }
  /**
   * Removes a chip on a specific index.
   *
   * @param {Number} index Index of the chip in the `chips` array
   */
  _removeChip(index) {
    const chips = this.chips;
    if (!chips || !chips.length) {
      return;
    }
    chips.splice(index, 1);
    this.chips = Array.from(chips);
    if (chips.length === 0) {
      this.validate();
    }
  }
};
