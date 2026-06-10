import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { nome, email, municipio, cargo, telefone } = req.body

  if (!email || !nome || !municipio) {
    return res.status(400).json({ error: 'Dados incompletos' })
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  const LOGO_BASE64 = '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Ans8AF6LDqC72Qu+jqt0TXnLmEBzSfHBRaKaV7q+P0My640U5KEoS4SVRSta65yTTWfCx4M9uidRC31NZLR9QyBvE5sjwHOA7cexSI6l6jSmnLRjnPPAHj1D9o78lGd71XfbxB1FbXOMJ7Y2NDGu9uO1eUur9QSz00z67L6Ykwnq2+bkYPd4LbUo1qtuVsHJ27etk2yVRaeNRqSUbvjdrleWFa2ML19iSNZXXSVNfYPpqKeaspGh8TWtJaMnI5ZwTy715aOvp1NqSsr2QuhpKSnEULXdpLnZLj6/NCiG63Crula+srpjLO8AOcQB2DA7FlWa/wB1s8E0NuquoZMcyANBzyx3hQei/l2Tz+hbh11y3J1ZwtR5NtRiuUrJqPJ3zbHnwSxYZXXjRdy+jpWtq55akZzgh7nHGf7uFx2hNH3yLUtNV1tJJSQUr+NznkZcR2AeK5Wy3u6Wad01uq3wOf8AXA5td7QeS2Vy1tqSvpzBLcDHG4YcImBhI9o5qS09WHKMGrM1S6k2rWR09fWwn8Wj2UbcZNO6bvlZWf3Oyv1+u7NYyVtgoZLhS00QpagRsLmudkuIyOwjPavDcu2W6p0sy/vofo+4PLC5h5OcXdrXDvPfnt5LiLBqq82OndT2+oYyJ7+NzXRh2T2Z5+xei/X+7Xt7XXKrdKGfUYAGtb7AEjpZxnFrCXnyzGq6q0mo0VeFXlOdW7UWo8YSfmL+rC/u/wAzVoiK+efBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAf/Z'

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Credenciamento Confirmado</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
    body, table, td, p, a, h1, h2 { font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif !important; }
  </style>
</head>
<body style="margin:0;padding:0;background:#F0F2F5;font-family:'Poppins','Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F2F5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#111111;border-radius:16px 16px 0 0;padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td valign="middle">
                  <img src="cid:facilita_logo" alt="Facilita SP Municípios" width="180" style="display:block;max-width:180px;height:auto;"/>
                </td>
                <td align="right" valign="middle">
                  <div style="background:#E8001C;border-radius:8px;padding:9px 16px;display:inline-block;">
                    <p style="margin:0;font-size:11px;font-weight:700;color:#FFFFFF;text-transform:uppercase;letter-spacing:0.07em;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">Credenciamento<br>Confirmado</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td style="background:#E8001C;height:4px;"></td></tr>

        <tr>
          <td style="background:#FFFFFF;padding:36px 32px;">
            <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#111111;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">
              Olá, ${nome}!
            </p>
            <p style="margin:0 0 28px;font-size:14px;color:#4A5568;line-height:1.7;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">
              Seu credenciamento para o evento <strong style="color:#111111;font-weight:600;">Facilita SP Municípios</strong>
              foi registrado com sucesso. Guarde este e-mail como comprovante.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FB;border:1px solid #E4E8EF;border-radius:14px;margin-bottom:24px;">
              <tr>
                <td style="padding:16px 22px;border-bottom:1px solid #E4E8EF;">
                  <p style="margin:0;font-size:10px;font-weight:700;color:#E8001C;text-transform:uppercase;letter-spacing:0.12em;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">Dados do Credenciamento</p>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 22px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:7px 0;width:38%;vertical-align:top;"><p style="margin:0;font-size:11px;color:#A0AEC0;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">Município</p></td>
                      <td style="padding:7px 0;vertical-align:top;"><p style="margin:0;font-size:13px;font-weight:700;color:#111111;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">${municipio}</p></td>
                    </tr>
                    <tr><td colspan="2" style="border-bottom:1px solid #EDF0F4;height:1px;padding:0;font-size:0;"></td></tr>
                    <tr>
                      <td style="padding:7px 0;vertical-align:top;"><p style="margin:0;font-size:11px;color:#A0AEC0;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">Nome</p></td>
                      <td style="padding:7px 0;vertical-align:top;"><p style="margin:0;font-size:13px;font-weight:600;color:#1A2233;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">${nome}</p></td>
                    </tr>
                    <tr><td colspan="2" style="border-bottom:1px solid #EDF0F4;height:1px;padding:0;font-size:0;"></td></tr>
                    <tr>
                      <td style="padding:7px 0;vertical-align:top;"><p style="margin:0;font-size:11px;color:#A0AEC0;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">Cargo</p></td>
                      <td style="padding:7px 0;vertical-align:top;"><p style="margin:0;font-size:13px;font-weight:600;color:#1A2233;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">${cargo}</p></td>
                    </tr>
                    <tr><td colspan="2" style="border-bottom:1px solid #EDF0F4;height:1px;padding:0;font-size:0;"></td></tr>
                    <tr>
                      <td style="padding:7px 0;vertical-align:top;"><p style="margin:0;font-size:11px;color:#A0AEC0;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">WhatsApp</p></td>
                      <td style="padding:7px 0;vertical-align:top;"><p style="margin:0;font-size:13px;font-weight:600;color:#1A2233;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">${telefone || '-'}</p></td>
                    </tr>
                    <tr><td colspan="2" style="border-bottom:1px solid #EDF0F4;height:1px;padding:0;font-size:0;"></td></tr>
                    <tr>
                      <td style="padding:7px 0;vertical-align:top;"><p style="margin:0;font-size:11px;color:#A0AEC0;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">E-mail</p></td>
                      <td style="padding:7px 0;vertical-align:top;"><p style="margin:0;font-size:13px;font-weight:600;color:#1A2233;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">${email}</p></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:14px;margin-bottom:28px;">
              <tr>
                <td style="padding:22px 24px;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#E8001C;text-transform:uppercase;letter-spacing:0.12em;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">Informações do Evento</p>
                  <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#FFFFFF;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">Reconhecimento Facilita SP Municípios</p>
                  <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.65);font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">
                    📅 02 de julho de 2026 &nbsp;·&nbsp; 📍 Auditório CDI USP
                  </p>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#718096;line-height:1.7;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">
              Em caso de dúvidas, entre em contato pelo e-mail
              <a href="mailto:facilitasp@sde.sp.gov.br" style="color:#E8001C;font-weight:600;text-decoration:none;">facilitasp@sde.sp.gov.br</a>
              ou pelo WhatsApp
              <a href="https://wa.me/5511983709053" style="color:#E8001C;font-weight:600;text-decoration:none;">(11) 98370-9053</a>.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#F8F9FB;border-radius:0 0 16px 16px;padding:20px 32px;border:1px solid #E4E8EF;border-top:none;">
            <p style="margin:0;font-size:11px;color:#B0BAC9;text-align:center;line-height:1.7;font-family:'Poppins','Helvetica Neue',Arial,sans-serif;">
              Secretaria de Desenvolvimento Econômico do Estado de São Paulo<br>
              Este e-mail foi enviado automaticamente. Por favor, não responda.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`

  try {
    await transporter.sendMail({
      from: '"Facilita SP Municípios" <' + process.env.GMAIL_USER + '>',
      to: email,
      subject: 'Credenciamento confirmado — ' + municipio + ' | Facilita SP',
      html,
      attachments: [
        {
          filename: 'logo-facilita-sp.png',
          content: Buffer.from(LOGO_BASE64, 'base64'),
          cid: 'facilita_logo',
        }
      ],
    })
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    return res.status(500).json({ error: error.message })
  }
}
