export default async function sendEmailToUser(email) {
  const API_KEY = process.env.REACT_APP_ELASTIC_EMAIL_API_KEY;
  const subject = "Amigo Secreto";
  const template = "templateId";
  const from = "sergioeduardoigreja16@gmail.com";

  let data = new URLSearchParams();
  data.append(`apiKey`, API_KEY);
  data.append(`subject`, subject);
  data.append(`template`, template);
  data.append(`msgTo`, email);
  data.append(`from`, from);

  return fetch("https://api.elasticemail.com/v2/email/send", {
    method: "POST",
    body: data,
  });
}
