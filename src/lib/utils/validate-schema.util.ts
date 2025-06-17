import { ZodObject } from "zod";

export const validSchema = (schema: ZodObject<any>, object: any) => {

  return schema.safeParse(object);
}