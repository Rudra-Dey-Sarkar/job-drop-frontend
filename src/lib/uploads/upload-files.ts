"use server"

import { UploadResponse } from "@/types/uploads/http";
import { supabase } from "../configs/supabase-config";

export const uploadFiles = async (bucket:string, path: string, file: File):Promise<UploadResponse | Error> => {

  const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    return error as Error;
  } else {
    return data;
  }
}