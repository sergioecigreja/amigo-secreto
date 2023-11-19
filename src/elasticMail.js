import { renderToStaticMarkup } from "react-dom/server";

export async function sendHelpRequestEmailToUser(email) {
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

export async function sendFriendRespondedEmailToUser(email) {
  const API_KEY = process.env.REACT_APP_ELASTIC_EMAIL_API_KEY;
  const subject = "Amigo Secreto";
  const template = "templateFriendResponded";
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

export async function sendInviteEmailToUser(secretEmail, friendEmail) {
  const API_KEY = process.env.REACT_APP_ELASTIC_EMAIL_API_KEY;
  const subject = "Amigo Secreto";
  const bodyHtml = generateEmail(friendEmail);
  const from = "sergioeduardoigreja16@gmail.com";

  let data = new URLSearchParams();
  data.append(`apiKey`, API_KEY);
  data.append(`subject`, subject);
  data.append(`bodyHtml`, renderToStaticMarkup(bodyHtml));
  data.append(`msgTo`, secretEmail);
  data.append(`from`, from);

  return fetch("https://api.elasticemail.com/v2/email/send", {
    method: "POST",
    body: data,
  });
}

function generateEmail(friend) {
  return (
    <body
      width="100%"
      style={{ margin: 0, padding: 0, backgroundColor: "#F5F6F8" }}
    >
      <center
        role="article"
        aria-roledescription="email"
        lang="en"
        style={{ width: "100%", backgroundColor: "#F5F6F8" }}
      >
        <table
          role="presentation"
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style={{ backgroundColor: "#F5F6F8" }}
        >
          <tr>
            <td>
              <table
                align="center"
                role="presentation"
                cellspacing="0"
                cellpadding="0"
                border="0"
                width="640"
                style={{ margin: "auto" }}
                class="email-container"
              >
                <tr>
                  <td style={{ padding: "20px 32px", textAlign: "center" }}>
                    <p
                      style={{
                        height: "auto",
                        margin: "15px 0",
                        background: "#F5F6F8",
                        fontFamily: "Open Sans",
                        fontSize: "11px",
                        lineHeight: "15px",
                        color: "#555555",
                        backgroundColor: "#F5F6F8",
                      }}
                    >
                      Unable to view? Read it{" "}
                      <a href="{view}" class="link-btn">
                        online
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "48px 32px 20px",
                      textAlign: "center",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <h2
                      class="header-text"
                      style={{
                        height: "auto",
                        margin: "15px 0",
                        background: "#ffffff",
                        fontFamily: "Open Sans",
                        textAlign: "center",
                        fontSize: "32px",
                        lineHeight: "34px",
                        color: "#000000",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      Amigo Secreto - Natal 2023
                    </h2>
                    <h3
                      style={{
                        height: "auto",
                        margin: "28px 0 15px",
                        background: "#ffffff",
                        textAlign: "center",
                        fontFamily: "Open Sans",
                        fontSize: "18px",
                        lineHeight: "27px",
                        color: "#5F5F5F",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      O teu amigo secreto é:
                    </h3>
                    <h3
                      style={{
                        height: "auto",
                        margin: "28px 0 15px",
                        background: "#ffffff",
                        textAlign: "center",
                        fontFamily: "Open Sans",
                        fontSize: "18px",
                        lineHeight: "27px",
                        color: "#5F5F5F",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <strong>{friend}</strong>
                    </h3>
                  </td>
                </tr>
                <td
                  style={{
                    padding: "20px 32px 64px",
                    textAlign: "center",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <table
                    align="center"
                    role="presentation"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style={{ margin: "auto", padding: "20px" }}
                  >
                    <tr>
                      <td
                        class="button-td button-td-primary"
                        style={{ borderRadius: "4px", background: "#2e66ff" }}
                      >
                        <a
                          class="button-a button-a-primary"
                          href="https://amigo-secreto-a8233.web.app"
                          style={{
                            background: "#2e66ff",
                            border: "1px solid #2e66ff",
                            fontFamily: "Open Sans",
                            fontSize: "16px",
                            lineHeight: "inherit",
                            textDecoration: "none",
                            padding: "16px",
                            color: "#ffffff",
                            display: "block",
                            borderRadius: "4px",
                          }}
                        >
                          Ir para o site
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
                <tr>
                  <td
                    style={{
                      padding: "20px 32px 0px",
                      textAlign: "center",
                      background: "#F5F6F8",
                      backgroundColor: "#F5F6F8",
                    }}
                    bgcolor="#F5F6F8"
                  >
                    <p
                      class="text-center small"
                      style={{
                        height: "auto",
                        background: "#F5F6F8",
                        margin: "15px 0",
                        fontFamily: "Open Sans",
                        fontSize: "11px",
                        lineHeight: "15px",
                        color: "#555555",
                        backgroundColor: "#F5F6F8",
                      }}
                    >
                      If you no longer wish to receive mail from us, you can{" "}
                      <a href="{unsubscribe}" class="link-btn">
                        unsubscribe
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </center>
    </body>
  );
}
