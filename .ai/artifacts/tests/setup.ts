import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Extend matchers
expect.extend({});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
vi.mock("process.env", () => ({
  VITE_SUPABASE_URL: "https://test.supabase.co",
  VITE_SUPABASE_ANON_KEY: "test-key",
  TEST_USER_EMAIL: "test@example.com",
  TEST_USER_PASSWORD: "test-password",
}));

// Mock Supabase client
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(),
      getSession: vi.fn(() => ({
        data: {
          session: {
            access_token: "test-token",
          },
        },
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
      like: vi.fn(),
    })),
  })),
}));

// Mock file handling
global.File = vi.fn();
global.FileReader = vi.fn(() => ({
  readAsDataURL: vi.fn(),
  onload: null,
  result: "data:image/jpeg;base64,test",
}));
