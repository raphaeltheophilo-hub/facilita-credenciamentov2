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

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Credenciamento Confirmado</title>
</head>
<body style="margin:0;padding:0;background:#F0F2F5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F2F5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#111111;border-radius:16px 16px 0 0;padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:11px;font-weight:700;color:#E8001C;letter-spacing:0.10em;text-transform:uppercase;">
                    Secretaria de Desenvolvimento Econômico · Estado de São Paulo
                  </p>
                  <h1 style="margin:6px 0 0;font-size:22px;font-weight:900;color:#FFFFFF;letter-spacing:0.01em;">
                    FACILITA <span style="color:#E8001C;">SP</span> MUNICÍPIOS
                  </h1>
                </td>
                <td align="right" valign="middle">
                  <div style="background:#E8001C;border-radius:8px;padding:8px 16px;display:inline-block;">
                    <p style="margin:0;font-size:11px;font-weight:900;color:#FFFFFF;text-transform:uppercase;letter-spacing:0.06em;">Credenciamento<br>Confirmado</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="background:#E8001C;height:4px;"></td></tr>

        <!-- Body -->
        <tr>
          <td style="background:#FFFFFF;padding:32px;">

            <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#111111;">
              Olá, ${nome}!
            </p>
            <p style="margin:0 0 24px;font-size:14px;color:#4A5568;line-height:1.6;">
              Seu credenciamento para o evento <strong style="color:#111111;">Facilita SP Municípios</strong> 
              foi registrado com sucesso. Guarde este e-mail como comprovante.
            </p>

            <!-- Data card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FB;border:1px solid #E4E8EF;border-radius:12px;margin-bottom:24px;">
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #E4E8EF;">
                  <p style="margin:0;font-size:10px;font-weight:800;color:#E8001C;text-transform:uppercase;letter-spacing:0.10em;">Dados do Credenciamento</p>
                </td>
              </tr>
              <tr>
                <td style="padding:20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:6px 0;width:40%;">
                        <p style="margin:0;font-size:11px;color:#718096;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Município</p>
                      </td>
                      <td style="padding:6px 0;">
                        <p style="margin:0;font-size:13px;font-weight:700;color:#111111;">${municipio}</p>
                      </td>
                    </tr>
                    <tr><td colspan="2" style="border-bottom:1px solid #E4E8EF;height:1px;padding:0;"></td></tr>
                    <tr>
                      <td style="padding:6px 0;">
                        <p style="margin:0;font-size:11px;color:#718096;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Nome</p>
                      </td>
                      <td style="padding:6px 0;">
                        <p style="margin:0;font-size:13px;font-weight:600;color:#1A2233;">${nome}</p>
                      </td>
                    </tr>
                    <tr><td colspan="2" style="border-bottom:1px solid #E4E8EF;height:1px;padding:0;"></td></tr>
                    <tr>
                      <td style="padding:6px 0;">
                        <p style="margin:0;font-size:11px;color:#718096;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Cargo</p>
                      </td>
                      <td style="padding:6px 0;">
                        <p style="margin:0;font-size:13px;font-weight:600;color:#1A2233;">${cargo}</p>
                      </td>
                    </tr>
                    <tr><td colspan="2" style="border-bottom:1px solid #E4E8EF;height:1px;padding:0;"></td></tr>
                    <tr>
                      <td style="padding:6px 0;">
                        <p style="margin:0;font-size:11px;color:#718096;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">WhatsApp</p>
                      </td>
                      <td style="padding:6px 0;">
                        <p style="margin:0;font-size:13px;font-weight:600;color:#1A2233;">${telefone || '-'}</p>
                      </td>
                    </tr>
                    <tr><td colspan="2" style="border-bottom:1px solid #E4E8EF;height:1px;padding:0;"></td></tr>
                    <tr>
                      <td style="padding:6px 0;">
                        <p style="margin:0;font-size:11px;color:#718096;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">E-mail</p>
                      </td>
                      <td style="padding:6px 0;">
                        <p style="margin:0;font-size:13px;font-weight:600;color:#1A2233;">${email}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Event info -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:12px;margin-bottom:24px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:800;color:#E8001C;text-transform:uppercase;letter-spacing:0.10em;">Informações do Evento</p>
                  <p style="margin:0;font-size:15px;font-weight:700;color:#FFFFFF;">Entrega de Selos Facilita SP</p>
                  <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.65);">
                    📅 02 de julho de 2026 &nbsp;·&nbsp; 📍 Auditório CDI USP
                  </p>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#718096;line-height:1.6;">
              Em caso de dúvidas, entre em contato pelo e-mail 
              <a href="mailto:facilitasp@sde.sp.gov.br" style="color:#E8001C;font-weight:600;">facilitasp@sde.sp.gov.br</a>
              ou pelo WhatsApp <a href="https://wa.me/5511983709053" style="color:#E8001C;font-weight:600;">(11) 98370-9053</a>.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F8F9FB;border-radius:0 0 16px 16px;padding:20px 32px;border:1px solid #E4E8EF;border-top:none;">
            <p style="margin:0;font-size:11px;color:#A0AEC0;text-align:center;line-height:1.6;">
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
      from: `"Facilita SP Municípios" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Credenciamento confirmado — ${municipio} | Facilita SP`,
      html,
    })
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    return res.status(500).json({ error: error.message })
  }
}
