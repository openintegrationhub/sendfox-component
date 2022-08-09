module.exports.contactToOih = (msg) => {
  if (Object.keys(msg).length === 0 && msg.constructor === Object) {
    return msg;
  }

  let birthday;
  let addresses;
  const contactData = [
    {
      type: 'email',
      value: msg.data.email,
    },
  ];

  if (msg.data.contact_fields) {
    for (let i = 0; i < msg.data.contact_fields.length; i += 1) {
      const entry = msg.data.contact_fields[i];

      if (entry.name === 'phone_number') {
        contactData.push({
          type: 'phone',
          value: entry.value,
        });
      } else if (entry.name === 'address') {
        let street;
        let streetNumber;
        let zipcode;
        let city;
        let country;

        if (entry.value) {
          const value = entry.value.trim();
          let parts = value.split(',');
          if (parts.length < 2) {
            parts = value.split(' ');
            if (parts.length > 0) {
              street = parts.shift();
              if (parts.length > 0) {
                streetNumber = parts.shift();
                if (parts.length > 0) {
                  zipcode = parts.shift();
                  if (parts.length > 0) {
                    city = parts.shift();
                    if (parts.length > 0) {
                      country = parts.join(' ');
                    }
                  }
                }
              }
            }
          } else if (parts.length > 0) {
            let subParts = parts[0].split(' ');

            if (subParts.length > 0) {
              street = parts.shift();
              if (subParts.length > 0) {
                streetNumber = subParts.join(' ');
              }
            }

            if (subParts.length > 1) {
              subParts = parts[1].split(' ');

              if (subParts.length > 0) {
                zipcode = parts.shift();
                if (subParts.length > 0) {
                  city = subParts.join(' ');
                }
              }
            }

            if (subParts.length > 2) {
              country = parts[2]; // eslint-disable-line prefer-destructuring
            }
          }
        }

        addresses.push({
          street,
          streetNumber,
          zipcode,
          city,
          country,
        });
      } else if (entry.name === 'website') {
        contactData.push({
          type: 'website',
          value: entry.value,
        });
      } else if (entry.name === 'birthday') {
        birthday = entry.value;
      }
    }
  }

  const expression = {
    metadata: {
      recordUid: msg.metadata.recordUid,
    },
    data: {
      firstName: msg.data.first_name,
      lastName: msg.data.last_name,
      contactData,
      birthday,
      addresses,
    },
  };
  return expression;
};
