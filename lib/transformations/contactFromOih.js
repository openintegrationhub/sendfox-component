function contactFromOih(msg) {
  const contact = {
    first_name: msg.data.firstName,
    last_name: msg.data.lastName,
    contact_fields: [],
  };

  // Iterate through contactData, set email to first encountered email
  for (let i = 0; i < msg.data.contactData.length; i += 1) {
    const dataType = msg.data.contactData[i].type;
    const dataValue = msg.data.contactData[i].value;
    if (dataType === 'email') {
      contact.email = dataValue;
      break;
    } else if (dataType === 'phone') {
      contact.contact_fields.push({
        name: 'phone_number',
        value: dataValue.trim(),
      });
    } else if (dataType === 'mobile' || dataType === 'mobil') {
      contact.contact_fields.push({
        name: 'phone_number',
        value: dataValue.trim(),
      });
    } else if (dataType === 'website') {
      contact.contact_fields.push({
        name: 'website',
        value: dataValue.trim(),
      });
    }
  }

  if (msg.data.birthday) {
    contact.contact_fields.push({
      name: 'birthday',
      value: msg.data.birthday.trim(),
    });
  }

  if (msg.data.addresses && msg.data.addresses.length > 0) {
    for (let i = 0; i < msg.data.addresses.length; i += 1) {
      contact.contact_fields.push({
        name: 'address',
        value: `${msg.data.addresses[i].street} ${msg.data.addresses[i].streetNumber}, ${msg.data.addresses[i].zipcode} ${msg.data.addresses[i].city}, ${msg.data.addresses[i].country}`, // eslint-disable-line max-len
      });
    }
  }

  return { data: contact, metadata: msg.metadata };
}

module.exports = {
  contactFromOih,
};
