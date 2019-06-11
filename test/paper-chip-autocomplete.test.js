import {fixture, assert, nextFrame} from '@open-wc/testing';
import '@polymer/iron-icons/iron-icons.js';
import sinon from 'sinon/pkg/sinon-esm.js';
import '../paper-chip-autocomplete.js';

describe('<paper-chip-autocomplete>', () => {
  async function basicFixture() {
    return (await fixture(`<paper-chip-autocomplete></paper-chip-autocomplete>`));
  }

  describe('selectPrevious()', () => {
    let element;
    const source = ['Apple', 'Appli', 'Applo'];
    beforeEach(async () => {
      element = await basicFixture();
      element.source = source;
      element.opened = true;
      element.value = 'A';
      await nextFrame();
    });

    it('Selectes previous element', async () => {
      element.selectedItem = 1;
      await nextFrame();
      element.selectPrevious();
      assert.equal(element.selectedItem, 0);
    });

    it('Opens the overlay', async () => {
      element.opened = false;
      element.selectedItem = 1;
      await nextFrame();
      element.selectPrevious();
      assert.isTrue(element.opened);
    });

    it('Does nothing when no suggestions', async () => {
      element.value = '';
      element.opened = false;
      element.selectedItem = 1;
      await nextFrame();
      element.selectPrevious();
      assert.isFalse(element.opened);
    });

    it('Goes to the end of the list', async () => {
      element.selectedItem = 0;
      await nextFrame();
      element.selectPrevious();
      assert.equal(element.selectedItem, 2);
    });

    it('Calls ensureItemVisible()', async () => {
      const spy = sinon.spy(element, 'ensureItemVisible');
      element.selectedItem = 1;
      await nextFrame();
      element.selectPrevious();
      assert.isTrue(spy.called);
    });
  });

  describe('selectNext()', () => {
    let element;
    let source;

    beforeEach(async () => {
      element = await basicFixture();
      source = ['Apple', 'Appli', 'Applo'];
      element.source = source;
      element.opened = true;
      element.value = 'A';
      await nextFrame();
    });

    it('Selectes previous element', async () => {
      element.selectedItem = 1;
      await nextFrame();
      element.selectNext();
      assert.equal(element.selectedItem, 2);
    });

    it('Opens the overlay', async () => {
      element.opened = false;
      element.selectedItem = 1;
      await nextFrame();
      element.selectNext();
      assert.isTrue(element.opened);
    });

    it('Does nothing when no suggestions', async () => {
      element.value = '';
      element.opened = false;
      element.selectedItem = 1;
      await nextFrame();
      element.selectNext();
      assert.isFalse(element.opened);
    });

    it('Goes to the start of the list', async () => {
      element.selectedItem = 2;
      await nextFrame();
      element.selectNext();
      assert.equal(element.selectedItem, 0);
    });

    it('Calls ensureItemVisible()', async () => {
      const spy = sinon.spy(element, 'ensureItemVisible');
      element.selectedItem = 1;
      await nextFrame();
      element.selectNext();
      assert.isTrue(spy.called);
    });
  });

  describe('acceptSelection()', () => {
    let element;
    let source;

    beforeEach(async () => {
      element = await basicFixture();
      source = ['Apple', 'Appli', 'Applo'];
      element.source = source;
      element.opened = true;
      element.value = 'A';
      await nextFrame();
    });

    it('Should fire `selected` event.', function(done) {
      element.addEventListener('selected', function f() {
        element.removeEventListener('selected', f);
        done();
      });
      setTimeout(function() {
        element.acceptSelection();
      }, 100);
    });
  });
});
