/* eslint no-param-reassign: "off" */

const { transform } = require('@openintegrationhub/ferryman');
const { createContact } = require('../utils/helpers');
const { contactFromOih } = require('../transformations/contactFromOih');

/**
 * This method will be called from OIH platform upon receiving data
 *
 * @param {Object} msg - incoming message object that contains keys `data` and `metadata`
 * @param {Object} cfg - configuration that contains login information and configuration field values
 */
async function processAction(msg, cfg) {
  try {
    /*
      This metadata is used to identify the current object within the OIH and your application
      "oihUid" uniquely identifies it within the OIH itself
      "recordUid" is used to identify it within your application
    */
    const { oihUid, recordUid } = msg.metadata;

    /*
      Make sure to pass the object through the transform interface.
      This allows for flow-specific custom mappings to be used.
    */
    const transformedObject = transform(msg, cfg, contactFromOih);

    // Execute the upsert operation
    const { success, responseId } = await createContact(transformedObject.data, cfg.accessToken, recordUid, cfg.list);

    if (success) {
      const newElement = {
        metadata: {
          oihUid,
          recordUid: responseId,
        },
      };

      // Once finished, emit the new metadata to allow the OIH to synchronise ids
      this.emit('data', newElement);
    }

    console.log('Finished execution');
    this.emit('end');
  } catch (e) {
    console.log(`ERROR: ${e}`);
    this.emit('error', e);
  }
}

module.exports = {
  process: processAction,
};
