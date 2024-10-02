import axios from "axios";
const serviceId = "service_6zmczbh";
const publicKey = "4tiGQohDsjDdVDgQV";

export const sendConfirmation = async (userName, email, message) => {
  const templateId = "template_djo8kxa";

  const data = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      userId: userName,
      userMail: email,
      message: message,
    },
  };

  try {
    const res = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Email sent successfully:", res.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
  }
};

export const requestRolesMail = async (userName, email, message) => {
  const templateId = "template_a3dcs38";

  const data = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      userId: userName,
      email: email,
      userMail: `kalindubihanfdo@gmail.com`,
      message: message,
    },
  };

  try {
    const res = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Email sent successfully:", res.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
  }
};
