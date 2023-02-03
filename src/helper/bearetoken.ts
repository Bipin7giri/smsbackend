export async function sliceBearerToken(t:string):Promise<string> {
  var token: any = t.split(" ")[1];
  return token;
    
}