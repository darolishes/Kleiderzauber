import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export async function createTestItem(
  data: Partial<Database["public"]["Tables"]["clothing_items"]["Insert"]>
) {
  const defaultData = {
    name: "Test Item",
    category: "tops",
    seasons: ["summer"],
    colors: ["blue"],
    image_url: "https://test.com/image.jpg",
    thumbnail_url: "https://test.com/thumb.jpg",
  };

  const { error } = await supabase
    .from("clothing_items")
    .insert({ ...defaultData, ...data });

  if (error) {
    throw new Error(`Failed to create test item: ${error.message}`);
  }
}

export async function cleanupTestItems() {
  const { error } = await supabase
    .from("clothing_items")
    .delete()
    .like("name", "Test%");

  if (error) {
    console.error("Failed to cleanup test items:", error);
  }
}
