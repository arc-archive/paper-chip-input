import { html, render } from 'lit-html';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/maps-icons.js';
import '../paper-chip-input.js';

class DemoPage {
  constructor() {
    this.simpleSuggestions = ['Apple', 'Apricot', 'Avocado',
      'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry',
      'Boysenberry', 'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya',
      'Cloudberry', 'Coconut', 'Cranberry', 'Damson', 'Date', 'Dragonfruit',
      'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Goji berry', 'Gooseberry',
      'Grape', 'Grapefruit', 'Guava', 'Huckleberry', 'Jabuticaba', 'Jackfruit',
      'Jambul', 'Jujube', 'Juniper berry', 'Kiwi fruit', 'Kumquat', 'Lemon',
      'Lime', 'Loquat', 'Lychee', 'Mango', 'Marion berry', 'Melon', 'Miracle fruit',
      'Mulberry', 'Nectarine', 'Olive', 'Orange'
    ];
    this.iconSuggestions = [{
      value: 'Biking',
      icon: 'maps:directions-bike'
    }, {
      value: 'Boat trip',
      icon: 'maps:directions-boat'
    }, {
      value: 'Bus trip',
      icon: 'maps:directions-bus'
    }, {
      value: 'Car trip',
      icon: 'maps:directions-car'
    }, {
      value: 'Train trip',
      icon: 'maps:directions-railway'
    }, {
      value: 'Running',
      icon: 'maps:directions-run'
    }, {
      value: 'Hiking',
      icon: 'maps:directions-walk'
    }, {
      value: 'Reading',
      icon: 'maps:local-library'
    }, {
      value: 'Shopping',
      icon: 'maps:local-grocery-store'
    }, {
      value: 'Movies!',
      icon: 'maps:local-movies'
    }];

    this.idSuggestions = [{
      value: 'Biking',
      icon: 'maps:directions-bike',
      id: 'activity-1'
    }, {
      value: 'Boat trip',
      icon: 'maps:directions-boat',
      id: 'activity-2'
    }, {
      value: 'Bus trip',
      icon: 'maps:directions-bus',
      id: 'activity-3'
    }, {
      value: 'Car trip',
      icon: 'maps:directions-car',
      id: 'activity-4'
    }, {
      value: 'Train trip',
      icon: 'maps:directions-railway',
      id: 'activity-5'
    }, {
      value: 'Running',
      icon: 'maps:directions-run',
      id: 'activity-6'
    }, {
      value: 'Hiking',
      icon: 'maps:directions-walk',
      id: 'activity-7'
    }, {
      value: 'Reading',
      icon: 'maps:local-library',
      id: 'activity-8'
    }, {
      value: 'Shopping',
      icon: 'maps:local-grocery-store',
      id: 'activity-9'
    }, {
      value: 'Movies!',
      icon: 'maps:local-movies',
      id: 'activity-10'
    }];

    this.predefChips = [
      {
        'label': 'Chip #1'
      },
      {
        'label': 'Chip #2'
      },
      {
        'label': 'Removable chip', 'removable': true
      }
    ];

    this.auto4Out = ['activity-1', 'activity-2'];
    this.auto5Out = ['Biking', 'Shopping'];

    this.basicOut = '';
    this.predefOut = '';
    this.validateOut = '';
    this.validate2Out = '';
    this.allowedOut = '';

    this._basicValueChanged = this._basicValueChanged.bind(this);
    this._predefValueChanged = this._predefValueChanged.bind(this);
    this._validateValueChanged = this._validateValueChanged.bind(this);
    this._validate2ValueChanged = this._validate2ValueChanged.bind(this);
    this._allowedValueChanged = this._allowedValueChanged.bind(this);
  }

  _basicValueChanged(e) {
    this._renderChipArray(e.detail.value, 'basicOut');
  }

  _predefValueChanged(e) {
    this._renderChipArray(e.detail.value, 'predefOut');
  }

  _validateValueChanged(e) {
    this._renderChipArray(e.detail.value, 'validateOut');
  }

  _validate2ValueChanged(e) {
    this._renderChipArray(e.detail.value, 'validate2Out');
  }

  _allowedValueChanged(e) {
    this._renderChipArray(e.detail.value, 'allowedOut');
  }

  _renderChipArray(arr, prop) {
    const nval = arr.join(', ');
    if (nval === this[prop]) {
      return;
    }
    this[prop] = nval;
    setTimeout(() => {
      this.render();
    });
  }

  renderChipValue(value) {
    return value ? html`<label>Value:</label><output>${value}</output>` : '';
  }

  render() {
    render(html`<div class="vertical-section-container centered" role="main">
      <h2>Basics</h2>
      <paper-chip-input label="Chips input demo" @value-changed="${this._basicValueChanged}"></paper-chip-input>
      ${this.renderChipValue(this.basicOut)}

      <h2>Predefined</h2>
      <paper-chip-input label="Chips input demo"
        @value-changed="${this._predefValueChanged}" .chips="${this.predefChips}"></paper-chip-input>
      ${this.renderChipValue(this.predefOut)}

      <h2>Validation with pattern</h2>
      <p>Pattern: <i>[a-zA-Z]+</i></p>
      <paper-chip-input
        label="Chips input demo"
        pattern="[a-zA-Z]+"
        auto-validate=""
        error-message="Only [a-zA-Z]+ allowed"
        @value-changed="${this._validateValueChanged}"></paper-chip-input>
      ${this.renderChipValue(this.validateOut)}

      <h2>Required input</h2>
      <paper-chip-input
        label="Chips input demo"
        required="" auto-validate=""
        error-message="This input is required"
        @value-changed="${this._validate2ValueChanged}"></paper-chip-input>
      ${this.renderChipValue(this.validate2Out)}

      <h2>Allowed chips only</h2>
      <p>Allowed are: <i>Apple</i>, <i>Orange</i>, and <i>Banana</i>.</p>
      <paper-chip-input
        label="Only allowed will become chips and value"
        allowed="[&quot;apple&quot;,&quot;Orange&quot;,&quot;BANANA&quot;]"
        @value-changed="${this._allowedValueChanged}"></paper-chip-input>
      ${this.renderChipValue(this.allowedOut)}

      <h2>Simple auto suggestions</h2>
      <p>Try a name of a fruit</p>
      <paper-chip-input label="Type your favourite fruits" value="{{auto1Out}}" source="[[simpleSuggestions]]"></paper-chip-input>
      <template is="dom-if" if="[[auto1Out]]">
        <label>Value:</label>
        <output>[[auto1Out]]</output>
      </template>

      <h2>Suggestions with icons</h2>
      <p>Start with "<b>b</b>"</p>
      <paper-chip-input label="Type your favourite fruits" value="{{auto2Out}}" source="[[iconSuggestions]]"></paper-chip-input>
      <template is="dom-if" if="[[auto2Out]]">
        <label>Value:</label>
        <output>[[auto2Out]]</output>
      </template>

      <h2>Restoring values with suggestions with icons</h2>
      <p>Chips have icons restored from suggestions from passed value</p>
      <paper-chip-input label="Type your favourite fruits" value="{{auto5Out}}" source="[[iconSuggestions]]"></paper-chip-input>
      <template is="dom-if" if="[[auto5Out]]">
        <label>Value:</label>
        <output>[[auto5Out]]</output>
      </template>

      <h2>Suggestions with IDs</h2>
      <p>Similar to the above but the returned value is the "id" set on suggestion.</p>
      <paper-chip-input label="Type your favourite fruits" value="{{auto3Out}}" source="[[idSuggestions]]"></paper-chip-input>
      <template is="dom-if" if="[[auto3Out]]">
        <label>Value:</label>
        <output>[[auto3Out]]</output>
      </template>

      <h2>Restoring from IDs</h2>
      <p>Chips are restored from suggestions from passed value containing IDs.</p>
      <paper-chip-input label="Type your favourite fruits" value="{{auto4Out}}" source="[[idSuggestions]]"></paper-chip-input>
      <template is="dom-if" if="[[auto4Out]]">
        <label>Value:</label>
        <output>[[auto4Out]]</output>
      </template>
    </div>`, document.querySelector('#demo'));
  }
}
const instance = new DemoPage();
instance.render();
window._demo = instance;
