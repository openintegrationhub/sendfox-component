module.exports.contactToOih = (msg) => {
  if (Object.keys(msg).length === 0 && msg.constructor === Object) {
    return msg;
  }

  const expression = {
    metadata: {
      recordUid: msg.metadata.recordUid,
    },
    data: {
      firstName: msg.data.first_name,
      lastName: msg.data.last_name,
      contactData: [
        {
          type: 'email',
          value: msg.data.email,
        },
      ],
    },
  };
  return expression;
};
