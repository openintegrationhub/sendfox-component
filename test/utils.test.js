/* eslint no-unused-expressions: "off" */

const { expect } = require('chai');
const nock = require('nock');
const { getContacts, createContact } = require('../lib/utils/helpers');

describe('Helpers', () => {
  it('should get contacts filtered by list', async () => {
    nock('https://api.sendfox.com/contacts')
      .get('')
      .query({
        page: 1,
      })
      .reply(200, {
        last_page: 2,
        data: [{
          id: 123, email: 'test@best.de', first_name: 'Jane', last_name: 'Doe', lists: [{ id: 370 }, { id: 159 }],
        }],
      });

    nock('https://api.sendfox.com/contacts')
      .get('')
      .query({
        page: 2,
      })
      .reply(200, {
        last_page: 2,
        data: [{
          id: 456, email: 'test@bestest.de', first_name: 'Janey', last_name: 'Doey',
        },
        {
          id: 789, email: 'some@body.de', first_name: 'Another', last_name: 'Person', lists: [{ id: 159 }],
        }],
      });

    const contacts = await getContacts('someToken', {}, 159);

    expect(contacts.length).to.equal(2);
    expect(contacts[0].email).to.equal('test@best.de');
    expect(contacts[1].email).to.equal('some@body.de');
  });

  it('should create a new contact', async () => {
    nock('https://api.sendfox.com/contacts')
      .post('', {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jdoe@doecorp.com',
        lists: [962],
      })
      .reply(200, {
        id: 369,
      });

    const newContact = {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jdoe@doecorp.com',
    };

    const { success, responseId } = await createContact(newContact, 'someToken', false, 962);

    expect(success).to.equal(true);
    expect(responseId).to.equal(369);
  });
});
