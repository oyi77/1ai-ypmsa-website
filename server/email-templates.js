/* ============================================================
   Email Templates — 1AI × YPSMA
   HTML email templates for registration system
   ============================================================ */

// --- Welcome Email ---
function getWelcomeEmail(data, lang = 'en') {
  const t = lang === 'id' ? {
    subject: 'Selamat Datang di 1AI × YPSMA!',
    greeting: `Halo ${data.name},`,
    body: 'Selamat datang di komunitas 1AI × YPSMA! Anda telah berhasil mendaftar sebagai anggota.',
    features: 'Sebagai anggota, Anda akan mendapatkan:',
    featureList: [
      'Akses ke program pelatihan AI',
      'Workshop dan seminar eksklusif',
      'Sertifikat resmi',
      'Jaringan profesional',
      'Mentorship dari pakar industri'
    ],
    cta: 'Mulai Perjalanan Anda',
    footer: 'Tim 1AI × YPSMA'
  } : {
    subject: 'Welcome to 1AI × YPSMA!',
    greeting: `Hello ${data.name},`,
    body: 'Welcome to the 1AI × YPSMA community! You have successfully registered as a member.',
    features: 'As a member, you will receive:',
    featureList: [
      'Access to AI training programs',
      'Exclusive workshops and seminars',
      'Official certification',
      'Professional networking',
      'Industry expert mentorship'
    ],
    cta: 'Start Your Journey',
    footer: 'The 1AI × YPSMA Team'
  };
  
  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 40px 20px; text-align: center; }
    .logo { font-size: 24px; font-weight: 700; margin-bottom: 10px; }
    .content { padding: 40px 20px; background: #ffffff; }
    .greeting { font-size: 18px; color: #1a1a2e; margin-bottom: 20px; }
    .body-text { font-size: 16px; color: #666; margin-bottom: 30px; }
    .features { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .features h3 { color: #1a1a2e; margin-bottom: 15px; }
    .features ul { list-style: none; padding: 0; }
    .features li { padding: 8px 0; padding-left: 25px; position: relative; }
    .features li:before { content: "✓"; color: #e94560; position: absolute; left: 0; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #e94560 0%, #0f3460 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">1AI × YPSMA</div>
    </div>
    <div class="content">
      <p class="greeting">${t.greeting}</p>
      <p class="body-text">${t.body}</p>
      <div class="features">
        <h3>${t.features}</h3>
        <ul>
          ${t.featureList.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
      <a href="${process.env.APP_URL || 'https://ypsa-1ai.vercel.app'}" class="cta-button">${t.cta}</a>
    </div>
    <div class="footer">
      <p>${t.footer}</p>
      <p>© 2025 1AI × YPSMA. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

// --- Registration Confirmation Email ---
function getRegistrationEmail(data, lang = 'en') {
  const t = lang === 'id' ? {
    subject: 'Konfirmasi Pendaftaran 1AI × YPSMA',
    greeting: `Halo ${data.name},`,
    body: 'Terima kasih telah mendaftar di program 1AI × YPSMA. Pendaftaran Anda sedang diproses.',
    details: 'Detail Pendaftaran:',
    name: 'Nama',
    email: 'Email',
    phone: 'Telepon',
    role: 'Peran',
    status: 'Status',
    pending: 'Menunggu Verifikasi',
    cta: 'Lihat Status Pendaftaran',
    footer: 'Tim 1AI × YPSMA'
  } : {
    subject: '1AI × YPSMA Registration Confirmation',
    greeting: `Hello ${data.name},`,
    body: 'Thank you for registering for the 1AI × YPSMA program. Your registration is being processed.',
    details: 'Registration Details:',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    role: 'Role',
    status: 'Status',
    pending: 'Pending Verification',
    cta: 'View Registration Status',
    footer: 'The 1AI × YPSMA Team'
  };
  
  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 40px 20px; text-align: center; }
    .logo { font-size: 24px; font-weight: 700; margin-bottom: 10px; }
    .content { padding: 40px 20px; background: #ffffff; }
    .greeting { font-size: 18px; color: #1a1a2e; margin-bottom: 20px; }
    .body-text { font-size: 16px; color: #666; margin-bottom: 30px; }
    .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .details h3 { color: #1a1a2e; margin-bottom: 15px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .detail-label { font-weight: 600; color: #1a1a2e; }
    .detail-value { color: #666; }
    .status-badge { display: inline-block; background: #ffc107; color: #000; padding: 5px 15px; border-radius: 15px; font-size: 14px; font-weight: 600; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #e94560 0%, #0f3460 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">1AI × YPSMA</div>
    </div>
    <div class="content">
      <p class="greeting">${t.greeting}</p>
      <p class="body-text">${t.body}</p>
      <div class="details">
        <h3>${t.details}</h3>
        <div class="detail-row">
          <span class="detail-label">${t.name}:</span>
          <span class="detail-value">${data.name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${t.email}:</span>
          <span class="detail-value">${data.email}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${t.phone}:</span>
          <span class="detail-value">${data.phone || '-'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${t.role}:</span>
          <span class="detail-value">${data.role || 'Member'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${t.status}:</span>
          <span class="detail-value"><span class="status-badge">${t.pending}</span></span>
        </div>
      </div>
      <a href="${process.env.APP_URL || 'https://ypsa-1ai.vercel.app'}/#registration" class="cta-button">${t.cta}</a>
    </div>
    <div class="footer">
      <p>${t.footer}</p>
      <p>© 2025 1AI × YPSMA. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

// --- Event Registration Email ---
function getEventEmail(data, lang = 'en') {
  const t = lang === 'id' ? {
    subject: `Konfirmasi Pendaftaran: ${data.eventName}`,
    greeting: `Halo ${data.name},`,
    body: `Anda telah berhasil mendaftar untuk acara "${data.eventName}".`,
    details: 'Detail Acara:',
    event: 'Acara',
    date: 'Tanggal',
    time: 'Waktu',
    location: 'Lokasi',
    cta: 'Lihat Detail Acara',
    footer: 'Tim 1AI × YPSMA'
  } : {
    subject: `Event Registration Confirmation: ${data.eventName}`,
    greeting: `Hello ${data.name},`,
    body: `You have successfully registered for the event "${data.eventName}".`,
    details: 'Event Details:',
    event: 'Event',
    date: 'Date',
    time: 'Time',
    location: 'Location',
    cta: 'View Event Details',
    footer: 'The 1AI × YPSMA Team'
  };
  
  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #e94560 0%, #0f3460 100%); color: white; padding: 40px 20px; text-align: center; }
    .logo { font-size: 24px; font-weight: 700; margin-bottom: 10px; }
    .content { padding: 40px 20px; background: #ffffff; }
    .greeting { font-size: 18px; color: #1a1a2e; margin-bottom: 20px; }
    .body-text { font-size: 16px; color: #666; margin-bottom: 30px; }
    .event-card { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .event-card h3 { color: #e94560; margin-bottom: 15px; }
    .event-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .event-label { font-weight: 600; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #e94560 0%, #0f3460 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">1AI × YPSMA</div>
    </div>
    <div class="content">
      <p class="greeting">${t.greeting}</p>
      <p class="body-text">${t.body}</p>
      <div class="event-card">
        <h3>${t.details}</h3>
        <div class="event-row">
          <span class="event-label">${t.event}:</span>
          <span>${data.eventName}</span>
        </div>
        <div class="event-row">
          <span class="event-label">${t.date}:</span>
          <span>${data.eventDate || 'TBD'}</span>
        </div>
        <div class="event-row">
          <span class="event-label">${t.time}:</span>
          <span>${data.eventTime || 'TBD'}</span>
        </div>
        <div class="event-row">
          <span class="event-label">${t.location}:</span>
          <span>${data.eventLocation || 'Online'}</span>
        </div>
      </div>
      <a href="${process.env.APP_URL || 'https://ypsa-1ai.vercel.app'}/#events" class="cta-button">${t.cta}</a>
    </div>
    <div class="footer">
      <p>${t.footer}</p>
      <p>© 2025 1AI × YPSMA. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

module.exports = {
  getWelcomeEmail,
  getRegistrationEmail,
  getEventEmail
};
