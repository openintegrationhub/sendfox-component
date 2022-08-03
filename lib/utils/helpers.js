const qs = require('qs');
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
      uri: `https://people.googleapis.com/v1/${recordUid}`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      qs: {
        personFields: 'names',
      },
    });

    return { exists: response.statusCode === 200, etag: response.body.etag };
  } catch (e) {
    console.error(e);
    return { exists: false };
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
async function upsertObject(object, token, recordUid) {
  /* If a recordUid is supplied, double-check whether the object exists in the target system
     If your api natively supports conditional upserting, you can skip this step
  */

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
 * @return {Object} - Array of person objects containing data and meta
 */
async function getObjects(token, snapshot = {}) {
  try {

  } catch (e) {
    console.error(e);
    return { objects: [] };
  }
}



module.exports = {
  getObjects, upsertObject
};
