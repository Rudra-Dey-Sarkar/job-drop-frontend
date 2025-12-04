"use server"

import { SignedURLResponse } from "@/types/uploads/http";
import { supabase } from "../configs/supabase-config";

export const getSignedURL = async (path: string): Promise<SignedURLResponse  | Error> => {

  const { data, error } = await supabase
    .storage
    .from(path.split("/")[0])
    .createSignedUrl("/"+path.split("/")[1]+"/"+path.split("/")[2], 60)
  if (error) {
    return error as Error;
  } else {
    return data;
  }
}