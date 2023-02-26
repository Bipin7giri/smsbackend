export type DATA = {
  to: any|  string[];
  sound: string;
  title: string;
  body?: string;
  data?: any;
};
export type STATUS = {
  status: string;
  id: string;
};

export type NotificationResult = {
  data: STATUS;
};
