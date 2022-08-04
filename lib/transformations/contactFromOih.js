function contactFromOih(msg) {
  const contact = {
    first_name: msg.data.firstName,
    last_name: msg.data.lastName,
  };

  // Iterate through contactData, set email to first encountered email
  for (let i = 0; i < msg.data.contactData.length; i += 1) {
    if (msg.data.contactData[i].type === 'email') {
      contact.email = msg.data.contactData[i].value;
      break;
    }
  }

  return { data: contact, metadata: msg.metadata };
}

module.exports = {
  contactFromOih,
};
