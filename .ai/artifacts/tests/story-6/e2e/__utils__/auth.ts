import { Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

export async function login(page: Page) {
  // Get test user credentials from env
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error("Test user credentials not found in environment variables");
  }

  // Create Supabase client
  const supabase = createClient<Database>(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  );

  // Sign in user
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Failed to login: ${error.message}`);
  }

  // Set auth cookie
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await page.context().addCookies([
      {
        name: "sb-auth-token",
        value: session.access_token,
        domain: new URL(process.env.VITE_SUPABASE_URL!).hostname,
        path: "/",
      },
    ]);
  }
}
