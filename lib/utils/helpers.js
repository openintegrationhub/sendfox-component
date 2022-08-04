/* eslint no-await-in-loop: "off" */

const request = require('request-promise').defaults({ simple: false, resolveWithFullResponse: true });

/**
 * @desc Internal function that checks whether an object with a certain ID already
 * exists in the target system
 *
 * @access  Private
 * @param {String} token - An authorization/access token
 * @param {String} recordUid - A unique ID identifying an object in the target system
 * @return {Boolean} - true if object exists, false if not
 */
async function checkExistence(token, recordUid) {
  try {
    const response = await request({
      method: 'GET',
      uri: `https://api.sendfox.com/contacts/${recordUid}`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.statusCode === 200) {
      return true;
    }

    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
}

/**
 * @desc Upsert function which creates or updates
 * an object, depending on whether it already exists in the target system
 *
 * @access  Private
 * @param {Object} object - The data object that will be pushed to the API
 * @param {String} token - An authorization/access token
 * @param {String} recordUid
 * @return {Object} - the new created ot update object in Snazzy Contacts
 */
async function createContact(object, token, recordUid, list) {
  /* If a recordUid is supplied, double-check whether the object exists in the target system
     As sendfox does not support updating contacts through the API, existing objects simply skipped
  */
  try {
    const body = object;

    if (list) {
      body.lists = [list];
    }

    if (recordUid) {
      const exists = await checkExistence(token, recordUid);
      if (exists) {
        return { success: true, responseId: recordUid };
      }
    }

    const response = await request({
      method: 'POST',
      uri: 'https://api.sendfox.com/contacts',
      json: true,
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.statusCode === 200) {
      return { success: true, responseId: response.body.id };
    }

    return ({ success: false });
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

/**
 * This method fetches objects from Snazzy Contacts
 * depending on the value of count variable and type
 *
 * @param token - Snazzy Contacts token required for authentication
 * @param snapshot - current state of snapshot
 * @param list - optionally, return only contacts with the provided list id
 * @return {Object} - Array of person objects containing data and meta
 */
async function getContacts(token, snapshot = {}, list = false) {
  try {
    let contacts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      hasMore = false;
      const response = await request({
        method: 'GET',
        uri: 'https://api.sendfox.com/contacts',
        json: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        qs: {
          page,
        },
      });

      if (response.statusCode === 200) {
        contacts = contacts.concat(response.body.data);
        if (response.body.last_page > page) {
          hasMore = true;
          page += 1;
        }
      }
    }

    if (snapshot.lastUpdate) {
      contacts = contacts.filter((contact) => Date.parse(contact.updated_at) > Date.parse(snapshot.lastUpdate));
    }

    if (list) {
      contacts = contacts.filter((contact) => {
        if (!contact.lists || !contact.lists.length) {
          return false;
        }

        for (let i = 0; i < contact.lists.length; i += 1) {
          if (contact.lists[i].id === list) return true;
        }

        return false;
      });
    }

    return contacts;
  } catch (e) {
    console.error(e);
    return [];
  }
}

module.exports = {
  createContact, getContacts,
};
