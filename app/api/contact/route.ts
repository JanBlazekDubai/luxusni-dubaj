import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, phone, email, message } = await req.json()

    if (!firstName || !lastName || !phone || !email) {
      return NextResponse.json({ error: 'Chybí povinná pole' }, { status: 400 })
    }

    // Insert into Supabase
    const { error: dbError } = await supabase.from('clients').insert({
      name: firstName,
      last_name: lastName,
      email,
      phone,
      stage: 'lead',
      source: 'Web',
      notes: message
        ? `Zpráva z luxusnidubaj.cz: ${message}`
        : 'Lead z luxusnidubaj.cz',
    })

    if (dbError) {
      console.error('Supabase error:', dbError)
      // Don't block the response — still send email
    }

    // Send email via Resend
    const bodyLines = [
      `Jméno: ${firstName}`,
      `Příjmení: ${lastName}`,
      `Telefon: ${phone}`,
      `Email: ${email}`,
      ...(message ? [`\nZpráva:\n${message}`] : []),
    ]

    await resend.emails.send({
      from: 'luxusnidubaj.cz <onboarding@resend.dev>',
      to: 'jan@realtydmc.com',
      subject: `Nová poptávka z luxusnidubaj.cz: ${firstName} ${lastName}`,
      text: bodyLines.join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; padding: 32px;">
          <h2 style="color: #C9A84C; margin-bottom: 24px;">Nová poptávka z luxusnidubaj.cz</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #aaa; width: 120px;">Jméno</td><td style="padding: 8px 0; color: #fff;">${firstName}</td></tr>
            <tr><td style="padding: 8px 0; color: #aaa;">Příjmení</td><td style="padding: 8px 0; color: #fff;">${lastName}</td></tr>
            <tr><td style="padding: 8px 0; color: #aaa;">Telefon</td><td style="padding: 8px 0; color: #fff;"><a href="tel:${phone}" style="color: #C9A84C;">${phone}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #aaa;">Email</td><td style="padding: 8px 0; color: #fff;"><a href="mailto:${email}" style="color: #C9A84C;">${email}</a></td></tr>
            ${message ? `<tr><td style="padding: 8px 0; color: #aaa; vertical-align: top;">Zpráva</td><td style="padding: 8px 0; color: #fff;">${message.replace(/\n/g, '<br>')}</td></tr>` : ''}
          </table>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Interní chyba serveru' }, { status: 500 })
  }
}
