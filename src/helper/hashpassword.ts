const bcrypt = require("bcrypt");
const saltRounds = 10;
export async function generateHashPassword(password: any): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
export async function comparePassword(
  dbPassword: string,
  reqPassword: string
): Promise<Boolean> {
  return await bcrypt.compare(reqPassword, dbPassword);
}
