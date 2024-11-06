import { supabase } from "@/config/Supabase_Client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

export async function POST(req) {
  try {
    const authHeader = headers().get("Authorization");
    const { name, domain, description } = await req.json();

    if (authHeader && authHeader.startsWith("Bearer")) {
      const apiKey = authHeader.split("Bearer ")[1].trim();

      const { data, error } = await supabase
        .from("user")
        .select()
        .eq("api", apiKey);

      if (data && data.length > 0) {
        if (name.trim() === "" || domain.trim() === "") {
          return NextResponse.json(
            {
              error: "Name or Domain fields must not be empty"
            },
            {
              status: 400,
              headers: corsHeaders
            }
          );
        } else {
          const { data: events, error: errorMessage } = await supabase
            .from("events")
            .insert([
              {
                event_name: name.toLowerCase(),
                website_id: domain,
                message: description
              }
            ]);

          if (errorMessage) {
            return NextResponse.json(
              {
                error: "Error inserting event"
              },
              {
                status: 500,
                headers: corsHeaders
              }
            );
          }

          return NextResponse.json(
            {
              success: true,
              message: "Event added successfully"
            },
            {
              status: 200,
              headers: corsHeaders
            }
          );
        }
      }
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error"
      },
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
