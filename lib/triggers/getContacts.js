/* eslint no-param-reassign: "off" */

/**
 * Copyright 2020 Basaas GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const { transform } = require('@openintegrationhub/ferryman');
const { getContacts } = require('../utils/helpers');
const { contactToOih } = require('../transformations/contactToOih');

/**
 * This method will be called from OIH platform providing following data
 *
 * @param msg - incoming message object that contains keys `data` and `metadata`
 * @param cfg - configuration that is account information and configuration field values
 * @param snapshot - saves the current state of integration step for the future reference
 */
async function processTrigger(msg, cfg, snapshot = {}) {
  try {
    const token = await cfg.accessToken;

    // Initialise the snapshot if it is not provided
    snapshot.lastUpdate = snapshot.lastUpdate || (new Date(0)).getTime();

    const oihMeta = {};

    const objects = await getContacts(token, snapshot, cfg.list);

    console.log(`Found ${objects.length} new records.`);

    if (objects.length > 0) {
      const newSnapshot = {
        lastUpdate: objects[objects.length - 1].updated_at,
      };

      this.emit('snapshot', newSnapshot);

      objects.forEach((elem) => {
        const newElement = {};

        oihMeta.recordUid = elem.id;

        newElement.metadata = oihMeta;
        newElement.data = elem;
        // Emit the object with meta and data properties

        const transformedElement = transform(newElement, cfg, contactToOih);

        // Emit the object to the OIH
        this.emit('data', transformedElement);
      });
    }

    console.log('Finished execution');
    this.emit('end');
  } catch (e) {
    console.log(`ERROR: ${e}`);
    this.emit('error', e);
  }
}

module.exports = {
  process: processTrigger,
};
