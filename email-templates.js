/* ============================================================
   Email Templates — 1AI × YPSMA
   ============================================================ */

const getWelcomeEmail = (data, lang = 'en') => {
  const content = {
    en: {
      title: 'Welcome to 1AI × YPSMA',
      greeting: `Hello ${data.name},`,
      body: `
        <p>Welcome to the 1AI × Youth Professional Society of AI (YPSMA) community!</p>
        <p>We're excited to have you join our mission to democratize AI education for youth across Indonesia.</p>
        <p>Here's what you can expect:</p>
        <ul>
          <li>Access to AI learning resources and workshops</li>
          <li>Networking opportunities with industry professionals</li>
          <li>Hands-on project collaborations</li>
          <li>Mentorship from AI experts</li>
        </ul>
        <p>Stay tuned for upcoming events and announcements!</p>
      `,
      closing: 'Best regards,<br>The 1AI × YPSMA Team'
    },
    id: {
      title: 'Selamat Datang di 1AI × YPSMA',
      greeting: `Halo ${data.name},`,
      body: `
        <p>Selamat datang di komunitas 1AI × Youth Professional Society of AI (YPSMA)!</p>
        <p>Kami sangat senang Anda bergabung dengan misi kami untuk mendemokratisasi pendidikan AI bagi pemuda di seluruh Indonesia.</p>
        <p>Berikut yang dapat Anda harapkan:</p>
        <ul>
          <li>Akses ke sumber belajar AI dan workshop</li>
          <li>Peluang networking dengan profesional industri</li>
          <li>Kolaborasi proyek hands-on</li>
          <li>Mentor dari ahli AI</li>
        </ul>
        <p>Nantikan event dan pengumuman mendatang!</p>
      `,
      closing: 'Salam,<br>Tim 1AI × YPSMA'
    }
  };

  const t = content[lang] || content.en;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.title}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00d4ff, #7b2ff7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
        ul { color: #4a5568; }
        li { margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>1AI × YPSMA</h1>
      </div>
      <div class="content">
        <h2>${t.greeting}</h2>
        ${t.body}
        <p>${t.closing}</p>
      </div>
      <div class="footer">
        <p>© 2025 1AI × Youth Professional Society of AI. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

const getRegistrationEmail = (data, lang = 'en') => {
  const roleNames = {
    en: { student: 'Student', teacher: 'Teacher', professional: 'Professional', other: 'Other' },
    id: { student: 'Siswa', teacher: 'Guru', professional: 'Profesional', other: 'Lainnya' }
  };

  const content = {
    en: {
      title: 'Registration Confirmation',
      greeting: `Hello ${data.name},`,
      body: `
        <p>Thank you for registering with 1AI × YPSMA!</p>
        <p>Here are your registration details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.name}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.email}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.phone || 'Not provided'}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Role:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${roleNames.en[data.role] || data.role}</td></tr>
        </table>
        <p>We will review your registration and get back to you soon.</p>
      `,
      closing: 'Best regards,<br>The 1AI × YPSMA Team'
    },
    id: {
      title: 'Konfirmasi Pendaftaran',
      greeting: `Halo ${data.name},`,
      body: `
        <p>Terima kasih telah mendaftar di 1AI × YPSMA!</p>
        <p>Berikut detail pendaftaran Anda:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Nama:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.name}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.email}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Telepon:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.phone || 'Tidak disediakan'}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Peran:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${roleNames.id[data.role] || data.role}</td></tr>
        </table>
        <p>Kami akan meninjau pendaftaran Anda dan segera menghubungi Anda.</p>
      `,
      closing: 'Salam,<br>Tim 1AI × YPSMA'
    }
  };

  const t = content[lang] || content.en;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.title}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00d4ff, #7b2ff7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>1AI × YPSMA</h1>
      </div>
      <div class="content">
        <h2>${t.greeting}</h2>
        ${t.body}
        <p>${t.closing}</p>
      </div>
      <div class="footer">
        <p>© 2025 1AI × Youth Professional Society of AI. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

const getEventEmail = (data, lang = 'en') => {
  const content = {
    en: {
      title: 'Event Registration Confirmation',
      greeting: `Hello ${data.name},`,
      body: `
        <p>Thank you for registering for <strong>${data.eventName}</strong>!</p>
        <p>Here are the event details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Event:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.eventName}</td></tr>
          ${data.eventDate ? `<tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Date:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.eventDate}</td></tr>` : ''}
          ${data.eventTime ? `<tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Time:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.eventTime}</td></tr>` : ''}
          ${data.eventLocation ? `<tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Location:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.eventLocation}</td></tr>` : ''}
        </table>
        <p>Please save this confirmation. We look forward to seeing you at the event!</p>
      `,
      closing: 'Best regards,<br>The 1AI × YPSMA Team'
    },
    id: {
      title: 'Konfirmasi Pendaftaran Event',
      greeting: `Halo ${data.name},`,
      body: `
        <p>Terima kasih telah mendaftar untuk <strong>${data.eventName}</strong>!</p>
        <p>Berikut detail event:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Event:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.eventName}</td></tr>
          ${data.eventDate ? `<tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Tanggal:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.eventDate}</td></tr>` : ''}
          ${data.eventTime ? `<tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Waktu:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.eventTime}</td></tr>` : ''}
          ${data.eventLocation ? `<tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Lokasi:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.eventLocation}</td></tr>` : ''}
        </table>
        <p>Simpan konfirmasi ini. Kami tunggu kehadiran Anda di event!</p>
      `,
      closing: 'Salam,<br>Tim 1AI × YPSMA'
    }
  };

  const t = content[lang] || content.en;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.title}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00d4ff, #7b2ff7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>1AI × YPSMA</h1>
      </div>
      <div class="content">
        <h2>${t.greeting}</h2>
        ${t.body}
        <p>${t.closing}</p>
      </div>
      <div class="footer">
        <p>© 2025 1AI × Youth Professional Society of AI. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

module.exports = { getWelcomeEmail, getRegistrationEmail, getEventEmail };
