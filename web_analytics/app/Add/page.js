"use client";
import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import { supabase } from "@/config/Supabase_Client";
import useUser from "@/hooks/userUser";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const router = useRouter();
  const checkDomainAddedBefore = async () => {
    let fetchedWebsites = [];
    const { data: websites, error } = await supabase
      .from("websites")
      .select("*");
    fetchedWebsites = websites;

    if (
      fetchedWebsites.filter((item) => item.website_name === website).length > 0
    ) {
      setError("Domain already exists");
    } else {
      setError("");
      addWebsite();
    }
  };

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
  useEffect(() => {
    if (
      website.trim().includes("http") ||
      website.trim().includes("https:// ") ||
      website.trim().includes("://") ||
      website.trim().includes(":") ||
      website.trim().includes("/")
    ) {
      setError("Please Enter the Domain Only");
    } else {
      setError("");
    }
  }, [website]);
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
                  Enter The Domain or Sub-Domain Without {"www"}
                </p>
              )}
            </span>
            {error == "" && (
              <button className="button" onClick={checkDomainAddedBefore}>
                {loading ? "Adding..." : "Add Website"}
              </button>
            )}
          </div>
        ) : (
          <div className="w-full items-center justify-center flex flex-col space-y-10">
            <span className="w-full lg:w-[50%]">
              <input
                type="text"
                className="input text-white/20 cursor-pointer"
                disabled
                value={`<script defer data-domain="${website}" src="https://localhost:3000/tracking-script.js"></script>`}
              />
              <p className="text-xs text-white/20 pt-20 pt-2 font light">
                Paste the Generated Snippet in the
                <b className="text-red-600">{"<header>"} </b> of the Website
              </p>
            </span>
            <button
              onClick={() => router.push(`/w/${website.trim()}`)}
              className="button"
            >
              Added
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
