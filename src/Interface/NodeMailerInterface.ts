type AUTH = {
  user: string;
  pass: string;
};

export type MAIL = {
  sendMail(mailData: MAILDATA, arg1: (err: any, info: any) => void): unknown;
  host: string;
  port: number;
  secure: boolean;
  requireTLS: boolean;
  auth: AUTH;
};

export type MAILDATA = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};
