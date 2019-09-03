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

    this._inputValueChanged = this._inputValueChanged.bind(this);
    this._predefChipsChanged = this._predefChipsChanged.bind(this);
  }

  _inputValueChanged(e) {
    const prop = e.target.dataset.property;
    this._renderChipArray(e.detail.value, prop);
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

  _predefChipsChanged(e) {
    this.predefChips = e.detail.value;
  }

  renderChipValue(value) {
    return value ? html`<label>Value:</label><output>${value}</output>` : '';
  }

  render() {
    render(html`<div class="vertical-section-container centered" role="main">
      <h2>Basics</h2>
      <paper-chip-input
        data-property="basicOut"
        label="Chips input demo"
        @value-changed="${this._inputValueChanged}"></paper-chip-input>
      ${this.renderChipValue(this.basicOut)}

      <h2>Predefined</h2>
      <paper-chip-input
        data-property="predefOut"
        label="Chips input demo"
        @value-changed="${this._inputValueChanged}"
        .chips="${this.predefChips}"
        @chips-changed="${this._predefChipsChanged}"></paper-chip-input>
      ${this.renderChipValue(this.predefOut)}

      <h2>Validation with pattern</h2>
      <p>Pattern: <i>[a-zA-Z]+</i></p>
      <paper-chip-input
        data-property="validateOut"
        label="Chips input demo"
        pattern="[a-zA-Z]+"
        autovalidate=""
        invalidmessage="Only [a-zA-Z]+ allowed"
        @value-changed="${this._inputValueChanged}"></paper-chip-input>
      ${this.renderChipValue(this.validateOut)}

      <h2>Required input</h2>
      <paper-chip-input
        data-property="validate2Out"
        label="Chips input demo"
        required=""
        autovalidate=""
        invalidmessage="This input is required"
        @value-changed="${this._inputValueChanged}"></paper-chip-input>
      ${this.renderChipValue(this.validate2Out)}

      <h2>Allowed chips only</h2>
      <p>Allowed are: <i>Apple</i>, <i>Orange</i>, and <i>Banana</i>.</p>
      <paper-chip-input
        data-property="allowedOut"
        label="Only allowed will become chips and value"
        allowed="[&quot;apple&quot;,&quot;Orange&quot;,&quot;BANANA&quot;]"
        @value-changed="${this._inputValueChanged}"></paper-chip-input>
      ${this.renderChipValue(this.allowedOut)}

      <h2>Simple auto suggestions</h2>
      <p>Try a name of a fruit</p>
      <paper-chip-input
        data-property="auto1Out"
        label="Type your favourite fruits"
        .source="${this.simpleSuggestions}"
        @value-changed="${this._inputValueChanged}"></paper-chip-input>
      ${this.renderChipValue(this.auto1Out)}

      <h2>Suggestions with icons</h2>
      <p>Start with "<b>b</b>"</p>
      <paper-chip-input
        data-property="auto2Out"
        label="Type your favourite fruits"
        @value-changed="${this._inputValueChanged}"
        .source="${this.iconSuggestions}"></paper-chip-input>
      ${this.renderChipValue(this.auto2Out)}

      <h2>Restoring values with suggestions with icons</h2>
      <p>Chips have icons restored from suggestions from passed value</p>
      <paper-chip-input
        data-property="auto5Out"
        label="Type your favourite fruits"
        .value="${this.auto5Out}"
        .source="${this.iconSuggestions}"></paper-chip-input>
      ${this.renderChipValue(this.auto5Out)}

      <h2>Suggestions with IDs</h2>
      <p>Similar to the above but the returned value is the "id" set on suggestion.</p>
      <paper-chip-input
        data-property="auto3Out"
        label="Type your favourite fruits"
        .source="${this.idSuggestions}"
        @value-changed="${this._inputValueChanged}"></paper-chip-input>
      ${this.renderChipValue(this.auto3Out)}

      <h2>Restoring from IDs</h2>
      <p>Chips are restored from suggestions from passed value containing IDs.</p>
      <paper-chip-input
        data-property="auto4Out"
        label="Type your favourite fruits"
        .value="${this.auto4Out}"
        .source="${this.idSuggestions}"></paper-chip-input>
      ${this.renderChipValue(this.auto4Out)}
    </div>`, document.querySelector('#demo'));
  }
}
const instance = new DemoPage();
instance.render();
window._demo = instance;
