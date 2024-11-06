"use client";
import useUser from "@/hooks/userUser";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { supabase } from "@/config/Supabase_Client";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [user] = useUser();

  useEffect(() => {
    if (!user) return;
    if (user === "no user") redirect("/Signin");
  }, [user]);

  const generateApiKey = async () => {
    setLoading(true);
    if (loading || !user) return;
    const randomString =
      Math.random().toString(36).substring(2, 300) +
      Math.random().toString(36).substring(2, 300);

    const { data, error } = await supabase
      .from("users")
      .insert([{ api: randomString, user_id: user.id }])
      .select();
    if (error) console.log(error);
    setApiKey(randomString);
    setLoading(false);
  };

  const getUserAPIs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("user_id", user.id);
    if (data.length > 0) {
      setApiKey(data[0].api);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (!supabase || !user) return;
    getUserAPIs();
  }, [user, supabase]);

  if (user === "no user") {
    return (
      <div>
        <Header />
        <div className="min-h-screen items-center justify-center flex flex-col w-full z-40 text-white">
          Redirecting......
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black items-center justify-center flex flex-col">
      <Header />
      <div className="min-h-screen items-center justify-center flex flex-col w-full z-40 text-white">
        {!apiKey && !loading && (
          <button className="button" onClick={generateApiKey}>
            Generate API Key
          </button>
        )}
        {apiKey && (
          <div className="mt-12 border-white/5 border bg-black space-y-12 py-12 w-full md:w-3/4">
            <div className="space-y-12 px-4">
                <p>YOUR API KEY IS:</p>
                <input disabled className="input-disabled"></input>
            </div>
          </div>
        )}
        {apiKey && <div className="text-white">Your API Key: {apiKey}</div>}
        {loading && <p className="text-white">Loading...</p>}
      </div>
    </div>
  );
}
