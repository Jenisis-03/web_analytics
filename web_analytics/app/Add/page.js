"use client";
import { useState } from "react";
import Logo from "../components/Logo";
import { supabase } from "@/config/Supabase_Client";
import useUser from "@/hooks/userUser";

export default function AddPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const addWebsite = async () => {
    if (website.trim() == "" || loading) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("websites")
      .insert([{ website_name: website.trim(), user_id: user.id }])
      .select(); 
    setLoading(false);
    setStep(2);
  };
  return (
    <div className="w-full min-h-screen bg-black items-center justify-center flex flex-col">
      <Logo size="lg" />
      <div className="items-center justify-center p-12 flex flex-col w-full z-0 border-y border-white/5 bg-black text-white">
        {step == 1 ? (
          <div className="w-full items-center justify-center flex flex-col space-y-10">
            <span className="w-full lg:w-[50%] group">
              <p className="text-white/40 pb-4 group-hover:text-white smooth">
                Domain
              </p>
              <input
                value={website}
                onChange={(e) =>
                  setWebsite(e.target.value.trim().toLowerCase())
                }
                className="input"
              />
              {error ? (
                <p className="text-xs pt-2 font-light text-red-400">{error}</p>
              ) : (
                <p className="text-xs pt-2 font-light text-white/40">
                  Enter The Domain or SubDomain WIthout {"www"}
                </p>
              )}
            </span>
            {error == "" && (
              <button className="button" onClick={addWebsite}>
                {loading ? "Adding..." : "Add Website"}
              </button>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
