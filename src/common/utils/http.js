const { default: axios } = require("axios");

const cardToSheba = async (card_number) => {
  const headers = {
    Authorization: `Bearer ${process.env.ZOHAL_API_KEY}`,
  };
  const data = {
    card_number,
  };
  const result = await axios({
    method: "POST",
    url: `${process.env.ZOHAL_URL}/api/v0/services/inquiry/card_to_iban`,
    headers,
    data,
  });
  return result.data;
};
module.exports = {
  cardToSheba,
};
