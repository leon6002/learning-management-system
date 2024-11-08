'use server';

import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import { CodeEmail } from './email-template';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendCodeEmail = async (code: string, toEmail: string) => {
  const emailHtml = await render(<CodeEmail code={code} />);

  const options = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'Audesse - 验证你的邮箱',
    html: emailHtml,
  };

  await transporter.sendMail(options);
};
