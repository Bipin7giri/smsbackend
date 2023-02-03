const bcrypt = require("bcrypt");
const saltRounds = 10;
export async function generateHashPassword(password: any): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
export async function comparePassword(
  dbpassword: string,
  reqpassword: string
): Promise<Boolean> {
  const status: boolean = await bcrypt.compare(reqpassword, dbpassword);
  return status;
}
