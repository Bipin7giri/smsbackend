export async function sliceBearerToken(t:string):Promise<string> {
  return t.split(" ")[1];
    
}