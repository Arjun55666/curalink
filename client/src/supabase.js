import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kqbieknaykuaacnxlohv.supabase.co";
const supabaseKey = "sb_publishable_K7ey80T_WeDif1I7LcKxNQ_v4x8mUSB";

export const supabase = createClient(supabaseUrl, supabaseKey);