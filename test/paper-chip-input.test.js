import { fixture, assert, nextFrame } from '@open-wc/testing';
import '@polymer/iron-icons/iron-icons.js';
import sinon from 'sinon/pkg/sinon-esm.js';
import { a11ySuite } from '@advanced-rest-client/a11y-suite/index.js';
import '../paper-chip-input.js';

describe('<paper-chip-input>', () => {
  async function basicFixture() {
    return (await fixture(`<paper-chip-input></paper-chip-input>`));
  }

  async function basicRequiredFixture() {
    return (await fixture(`<paper-chip-input required></paper-chip-input>`));
  }

  async function patternFixture() {
    return (await fixture(`<paper-chip-input pattern="[a-zA-Z]+"></paper-chip-input>`));
  }

  async function chipsFixture() {
    return (await fixture(`
      <paper-chip-input
        chips='[{"label": "c-1"}, {"label": "c-2", "removable": true}, {"label": "c-3"}]'></paper-chip-input>`));
  }

  async function chipsWithIconFixture() {
    return (await fixture(`
      <paper-chip-input chipremoveicon="add"
        chips='[{"label": "c-1"}, {"label": "c-2", "removable": true}, {"label": "c-3"}]'></paper-chip-input>`));
  }

  async function allRemoveFixture() {
    const str = JSON.stringify([
      { label: 'c-1', removable: true },
      { label: 'c-2', removable: true },
      { label: 'c-3', removable: true }
    ]);
    return (await fixture(`
      <paper-chip-input
        chips='${str}'></paper-chip-input>
    `));
  }

  async function allowedFixture() {
    return (await fixture(`
      <paper-chip-input allowed='["c1", "c2", "c-3"]'></paper-chip-input>
    `));
  }

  async function suggestionsFixture() {
    return (await fixture(`
      <paper-chip-input source='["c1", "c2", "c-3"]'></paper-chip-input>
    `));
  }

  async function suggestionsWithIconsFixture() {
    const str = JSON.stringify([
      { value: 'c1', icon: 'i1' },
      { value: 'c2', icon: 'i2' },
      { value: 'c3', icon: 'i3' },
    ]);
    return (await fixture(`
      <paper-chip-input source='${str}'></paper-chip-input>
    `));
  }

  describe('Basics', () => {
    let element;

    it('_positionTarget is set', async () => {
      element = await basicFixture();
      await nextFrame();
      assert.ok(element._positionTarget);
      assert.equal(element._positionTarget.nodeName, 'IRON-INPUT');
    });
  });

  describe('Adding a chip', () => {
    let element;

    it('Value is initially undefined', async () => {
      element = await basicFixture();
      assert.isUndefined(element.value);
    });

    it('Accepts chip from value', async () => {
      element = await basicFixture();
      element._inputValue = 'test';
      await nextFrame();
      element._enterHandler();
      assert.typeOf(element.value, 'array');
      assert.lengthOf(element.value, 1);
      assert.equal(element.value[0], 'test');
    });

    it('Ignores empty values', async () => {
      element = await basicFixture();
      element._inputValue = '';
      await nextFrame();
      element._enterHandler();
      assert.isUndefined(element.value, 'array');
    });

    it('Clears input value after accepting input', async () => {
      element = await basicFixture();
      element._inputValue = 'test';
      await nextFrame();
      element._enterHandler();
      assert.equal(element._inputValue, '');
    });

    it('Ignores existing value', async () => {
      element = await chipsFixture();
      element._inputValue = 'c-1';
      await nextFrame();
      element._enterHandler();
      assert.typeOf(element.value, 'array');
      assert.lengthOf(element.value, 3);
    });

    it('Clears input value after ignoring it', async () => {
      element = await chipsFixture();
      element._inputValue = 'c-1';
      await nextFrame();
      element._enterHandler();
      assert.equal(element._inputValue, '');
    });

    it('Allows only "allowed" chips (by value)', async () => {
      element = await allowedFixture();
      element._inputValue = 'c1';
      await nextFrame();
      element._enterHandler();
      assert.equal(element._inputValue, '');
    });

    it('Ignores values not defined in "allowed" (by value)', async () => {
      element = await allowedFixture();
      element._inputValue = 'c1';
      await nextFrame();
      element._enterHandler();
      assert.typeOf(element.value, 'array');
      assert.equal(element.value[0], 'c1');
    });

    it('Allows only "allowed" chips (by id)', async () => {
      element = await allowedFixture();
      element.source = [{ value: 'c1 label', id: 'c1' }];
      element._inputValue = 'c1 label';
      await nextFrame();
      element._suggestionsOpened = false;
      element._enterHandler();
      assert.typeOf(element.value, 'array');
      assert.equal(element.value[0], 'c1');
    });

    it('Ignores values not defined in "allowed" (by id)', async () => {
      element = await allowedFixture();
      element.source = [{ value: 'c1 label', id: 'c-not-allowed' }];
      await nextFrame();
      element._inputValue = 'c1 label';
      element._suggestionsOpened = false;
      element._enterHandler();
      assert.isUndefined(element.value, 'array');
    });
  });

  describe('Removing a chip', () => {
    let element;
    it('Does nothing when no input and no chips', async () => {
      element = await basicFixture();
      await nextFrame();
      element._backspaceHandler();
    });

    it('Do not remove chips when input has text', async () => {
      element = await allRemoveFixture();
      element._inputValue = 'test';
      await nextFrame();
      element._backspaceHandler();
      assert.typeOf(element.value, 'array');
      assert.lengthOf(element.value, 3);
    });

    it('Removes the chip when input is empty', async () => {
      element = await allRemoveFixture();
      await nextFrame();
      element._backspaceHandler();
      assert.typeOf(element.value, 'array');
      assert.lengthOf(element.value, 2);
      assert.deepEqual(element.value, ['c-1', 'c-2']);
    });

    it('Removes only removable chips', async () => {
      element = await chipsFixture();
      await nextFrame();
      element._backspaceHandler();
      assert.typeOf(element.value, 'array');
      assert.lengthOf(element.value, 2);
      assert.deepEqual(element.value, ['c-1', 'c-3']);
    });

    it('Enters chip label into the input field', (done) => {
      allRemoveFixture()
          .then((el) => {
            element = el;
            return nextFrame();
          })
          .then(() => {
            element._backspaceHandler();
            setTimeout(() => {
              assert.equal(element._inputValue, 'c-3');
              done();
            }, 10);
          });
    });

    it('Handles remove event', async () => {
      element = await chipsFixture();
      await nextFrame();
      const node = element.shadowRoot.querySelectorAll('paper-chip')[1];
      node.dispatchEvent(new CustomEvent('chip-removed', {
        composed: true
      }));
      assert.typeOf(element.value, 'array');
      assert.lengthOf(element.value, 2);
      assert.deepEqual(element.value, ['c-1', 'c-3']);
    });
  });

  describe('Allowed chips', () => {
    let element;
    beforeEach(async () => {
      element = await allowedFixture();
      await nextFrame();
    });

    it('Accepts allowed value', () => {
      element._inputValue = 'c1';
      element._enterHandler();
      assert.equal(element.value[0], 'c1');
    });

    it('Ignores unknown value', () => {
      element._inputValue = 'unknown';
      element._enterHandler();
      assert.isUndefined(element.value);
    });
  });

  describe('Auto suggestions', () => {
    let element;
    beforeEach(async () => {
      element = await suggestionsFixture();
      await nextFrame();
    });

    it('Opens suggestions dropdown', async () => {
      element._inputValue = 'c';
      await nextFrame();
      const node = element.shadowRoot.querySelector('paper-chip-autocomplete');
      assert.isTrue(node.opened);
    });

    it('Does no open suggestions when filtered empty', async () => {
      element._inputValue = 'cz';
      await nextFrame();
      const node = element.shadowRoot.querySelector('paper-chip-autocomplete');
      assert.isFalse(node.opened);
    });

    it('Ignores enter when suggestions are opened', async () => {
      element._inputValue = 'c';
      await nextFrame();
      element._enterHandler();
      assert.equal(element._inputValue, 'c');
      assert.isUndefined(element.value);
    });

    it('Accepts suggestion', async () => {
      element._inputValue = 'c';
      await nextFrame();
      const node = element.shadowRoot.querySelector('paper-chip-autocomplete');
      node.dispatchEvent(new CustomEvent('selected', {
        composed: true,
        detail: {
          value: {
            value: 'c1'
          }
        }
      }));
      assert.equal(element._inputValue, '');
      assert.equal(element.value[0], 'c1');
    });

    it('Accepts suggestion and an icon', async () => {
      element._inputValue = 'c';
      await nextFrame();
      const node = element.shadowRoot.querySelector('paper-chip-autocomplete');
      node.dispatchEvent(new CustomEvent('selected', {
        composed: true,
        detail: {
          value: {
            value: 'c1',
            icon: 'test'
          }
        }
      }));
      await nextFrame();
      const iconNode = element.shadowRoot.querySelector('paper-chip iron-icon');
      assert.equal(iconNode.icon, 'test');
    });
  });

  describe('Value computation', () => {
    let element;

    it('Creates chips from value', async () => {
      element = await basicFixture();
      element.value = ['test1', 'test2'];
      assert.typeOf(element.chips, 'array');
      assert.lengthOf(element.chips, 2);
    });

    it('Created chip is removable', async () => {
      element = await basicFixture();
      element.value = ['test1'];
      assert.isTrue(element.chips[0].removable);
    });

    it('Created chip has label from value', async () => {
      element = await basicFixture();
      element.value = ['test1'];
      assert.equal(element.chips[0].label, 'test1');
    });

    it('Value is unchanged', async () => {
      element = await basicFixture();
      element.value = ['test1'];
      assert.deepEqual(element.value, ['test1']);
    });

    it('Uses suggestions to render chips', async () => {
      element = await suggestionsWithIconsFixture();
      element.value = ['c2'];
      assert.equal(element.chips[0].label, 'c2', 'Has label');
      assert.isTrue(element.chips[0].removable, 'Is removable');
      assert.equal(element.chips[0].icon, 'i2', 'Has icon');
    });

    it('Removes chips when value is empty array', async () => {
      element = await basicFixture();
      element.value = ['test1', 'test2'];
      await nextFrame();
      element.value = [];
      assert.lengthOf(element.chips, 0);
    });

    it('Removes chips when value is undefined', async () => {
      element = await basicFixture();
      element.value = ['test1', 'test2'];
      await nextFrame();
      element.value = undefined;
      assert.lengthOf(element.chips, 0);
    });
  });

  describe('_chipFocused()', () => {
    let element;
    let ev;
    beforeEach(async () => {
      element = await basicFixture();
      ev = {
        preventDefault: () => {},
        stopPropagation: () => {},
        stopImmediatePropagation: () => {}
      };
      await nextFrame();
    });

    it('Prevents default', () => {
      const spy = sinon.spy(ev, 'preventDefault');
      element._chipFocused(ev);
      assert.isTrue(spy.called);
    });

    it('Stops propagation', () => {
      const spy = sinon.spy(ev, 'stopPropagation');
      element._chipFocused(ev);
      assert.isTrue(spy.called);
    });

    it('Stops propagation on element', () => {
      const spy = sinon.spy(ev, 'stopImmediatePropagation');
      element._chipFocused(ev);
      assert.isTrue(spy.called);
    });
  });

  describe('_inputBlur()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      await nextFrame();
    });

    it('Calls _enterHandler() when value', () => {
      element._inputValue = 'test';
      const spy = sinon.spy(element, '_enterHandler');
      element._inputBlur();
      assert.isTrue(spy.called);
    });

    it('Won\'t call _enterHandler() when no value', () => {
      element._inputValue = '';
      const spy = sinon.spy(element, '_enterHandler');
      element._inputBlur();
      assert.isFalse(spy.called);
    });
  });

  describe('validate()', () => {
    it('Returns true when no chips', async () => {
      const element = await basicFixture();
      await nextFrame();
      const result = element.validate();
      assert.isTrue(result);
    });

    it('Returns false when no chips and required', async () => {
      const element = await basicRequiredFixture();
      element.value = ['test'];
      await nextFrame();
      element._removeChip(0);
      const result = element.validate();
      assert.isFalse(result);
    });

    it('Returns false when pattern do not match', async () => {
      const element = await patternFixture();
      element.value = ['test'];
      element._inputValue = 'test value';
      await nextFrame();
      const result = element.validate();
      assert.isFalse(result);
    });
  });

  describe('_autofocusChanged()', () => {
    it('Calls _autofocusChanged() when property change', async () => {
      const element = await basicFixture();
      await nextFrame();
      const spy = sinon.spy(element, '_autofocusChanged');
      element.autofocus = true;
      assert.isTrue(spy.called);
    });
  });

  describe('_findSource()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns undefine when no source', () => {
      const result = element._findSource();
      assert.isUndefined(result);
    });

    it('Returns undefine when source empty', () => {
      const result = element._findSource([]);
      assert.isUndefined(result);
    });

    it('Finds string item by value', () => {
      const result = element._findSource(['test'], 'test');
      assert.equal(result, 'test');
    });

    it('Ignores empty values', () => {
      const result = element._findSource(['', 'test'], 'test');
      assert.equal(result, 'test');
    });

    it('Ignores case of source', () => {
      const result = element._findSource(['', 'Test'], 'test');
      assert.equal(result, 'Test');
    });

    it('Returns undefined when not found', () => {
      const result = element._findSource(['Test'], 'other');
      assert.isUndefined(result);
    });

    it('Finds string item by id', () => {
      const result = element._findSource(['test'], '', 'test');
      assert.equal(result, 'test');
    });

    it('Finds object item by value', () => {
      const result = element._findSource([{ value: 'test' }], 'test');
      assert.deepEqual(result, { value: 'test' });
    });

    it('Finds object item by id', () => {
      const result = element._findSource([{ value: 'test', id: 'other' }], 'other', 'other');
      assert.deepEqual(result, { value: 'test', id: 'other' });
    });

    it('Returns undefined when not found in objects', () => {
      const result = element._findSource([{ value: 'test', id: 'id' }], 'other', 'other');
      assert.isUndefined(result);
    });

    it('Returns undefined when not found in objects and no id', () => {
      const result = element._findSource([{ value: 'test', id: 'id' }], 'other');
      assert.isUndefined(result);
    });
  });

  describe('Chip icon', () => {
    let element;

    it('has default icon on the chip', async () => {
      element = await chipsFixture();
      await nextFrame();
      const node = element.shadowRoot.querySelector('paper-chip');
      assert.equal(node.removeIcon, 'clear');
    });

    it('has the icon from attribute', async () => {
      element = await chipsWithIconFixture();
      await nextFrame();
      const node = element.shadowRoot.querySelector('paper-chip');
      assert.equal(node.removeIcon, 'add');
    });
  });

  describe('a11y', () => {
    it('Passes accessibility tests', async () => {
      // tabindex is passed to the internal input element and this one should not have it
      // I am not sure what "aria-input-field-name" is about...
      const ignoredRules = ['aria-input-field-name', 'tabindex'];
      const opts = { ignoredRules };

      await a11ySuite('Normal state', '<paper-chip-input name="i1" label="x"></paper-chip-input>', opts);
      await a11ySuite('Required', '<paper-chip-input name="i2" label="x" required></paper-chip-input>', opts);
      await a11ySuite('Disabled', '<paper-chip-input name="i3" label="x" disabled></paper-chip-input>', opts);
      await a11ySuite('Read only', '<paper-chip-input name="i4" label="x" readonly></paper-chip-input>', opts);
      await a11ySuite('Suggestions', '<paper-chip-input name="i5" label="x" readonly></paper-chip-input>', {
        ignoredRules,
        afterFixture: (element) => {
          element.source = ['Apple', 'Apricot', 'Avocado'];
        }
      });
    });
  });
});
