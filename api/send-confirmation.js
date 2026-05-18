import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método não permitido'
    })
  }

  try {
    const { nome, email, municipio, cargo } = req.body

    if (!nome || !email || !municipio) {
      return res.status(400).json({
        error: 'Nome, e-mail e município são obrigatórios.'
      })
    }

    const result = await resend.emails.send({
      from: 'Facilita SP Municípios <onboarding@resend.dev>',
      to: [email],
      subject: 'Confirmação de credenciamento - Facilita SP Municípios',
      html: `
        <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.5;">
          <h2>Credenciamento confirmado</h2>

          <p>Olá, <strong>${nome}</strong>.</p>

          <p>
            Seu credenciamento para o evento
            <strong>Facilita SP Municípios</strong>
            foi confirmado com sucesso.
          </p>

          <p><strong>Município:</strong> ${municipio}</p>
          <p><strong>Cargo:</strong> ${cargo || '-'}</p>

          <p>
            Guarde esta mensagem como comprovante de confirmação.
          </p>

          <br />

          <p>
            Atenciosamente,<br />
            <strong>Equipe Facilita SP Municípios</strong>
          </p>
        </div>
      `
    })

    return res.status(200).json({
      ok: true,
      result
    })

  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
}
