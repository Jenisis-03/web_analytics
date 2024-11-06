import { supabase } from "@/config/Supabase_Client";
import { NextResponse } from "next/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
  const data = await req.json();
  const { domain, url, event, source } = data;

  if (!url.includes(domain)) {
    return NextResponse.json(
      { error: "Make sure domain matches" },
      { headers: corsHeaders }
    );
  }

  if (event === "session_start") {
    await supabase
      .from("visit")
      .insert([{ website_id: domain, source: source ??"Direct"}])
      .select();
  }

  if (event === "pageview") {
    await supabase.from("page_views").insert([{ domain, page: url }]);
  }

  return NextResponse.json({ res }, { headers: corsHeaders });
}
