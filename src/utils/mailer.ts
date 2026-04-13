import nodemailer from 'nodemailer';

export const enviarCodigo = async (correoDestino: string, codigo: string) => {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;

    if (!gmailUser || !gmailPass) {
        throw new Error('GMAIL_USER o GMAIL_PASS no están configurados en el .env');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: gmailPass,
        },
    });

    try {
        await transporter.sendMail({
            from: `"BLUX" <${gmailUser}>`,
            to: correoDestino,
            subject: '🔐 Código de recuperación BLUX',
            html: `
                <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:30px;border-radius:10px;background:#111;color:#fff">
                    <h2 style="color:#a855f7">BLUX</h2>
                    <p>Tu código de recuperación es:</p>
                    <h1 style="letter-spacing:8px;color:#a855f7">${codigo}</h1>
                    <p style="color:#999;font-size:12px">Expira en 10 minutos.</p>
                </div>
            `,
        });
        console.log(`✅ Código enviado a ${correoDestino}`);
    } catch (error) {
        console.error('❌ Error al enviar correo:', error);
        throw new Error('No se pudo enviar el correo. Verifica las credenciales de Gmail.');
    }
};