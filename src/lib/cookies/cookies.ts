"use server";
import { cookies as nextCookies } from "next/headers";

export const setAuthToken = async (token: string): Promise<void> => {
  const cookies = nextCookies();
  (await cookies).set("_jobdrop_jwt", token, {
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: true,
    sameSite: "strict"
  });
};

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookies = nextCookies();
  const token = (await cookies).get("_jobdrop_jwt")?.value;

  if (!token) {
    return {};
  }

  return { Authorization: `Bearer ${token}` };
};

export const removeAuthToken = async () => {
  const cookies = await nextCookies();
  cookies.set("_jobdrop_jwt", "", {
    maxAge: -1,
  });
};
