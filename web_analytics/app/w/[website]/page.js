"use client";

import Header from "@/app/components/Header";
import { supabase } from "@/config/Supabase_Client";
import useUser from "@/hooks/userUser";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function WebsitePage() {
  const [user] = useUser();
  const { website } = useParams();
  const [loading, setLoading] = useState(false);
  const [groupedPages, setGroupedPages] = useState([]);
  const [groupedPageSources, setGroupedPageSources] = useState([]); // Added this line
  const [totalVisits, setTotalVisits] = useState([]);
  const [pageViews, setPageViews] = useState([]);

  const groupPageviews = (pageViews) => {
    const groupedPageViews = {};
    pageViews.forEach((element) => {
      const path = element.path.replace(/^(?:https?:\/\/[^/]+)?/, "");
      groupedPageViews[path] = (groupedPageViews[path] || 0) + 1;
    });

    return Object.keys(groupedPageViews).map((page) => ({
      page: page,
      views: groupedPageViews[page],
    }));
  };

  const abbreviateNumber = (number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(2) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(2) + "K";
    } else {
      return number.toString();
    }
  };

  useEffect(() => {
    if (!user || !user.id) return;
    if (user.role !== "authenticated") redirect("/Signin");

    const checkWebsiteCurrentUser = async () => {
      const { data, error } = await supabase
        .from("website")
        .select()
        .eq("website_name", website)
        .eq("user_id", user.id);
      if (data.length === 0) {
        redirect("/dashboard");
      } else {
        setTimeout(() => {
          fetchViews();
        }, 500);
      }
    };
    checkWebsiteCurrentUser();
  }, [user]);

  const fetchViews = async () => {
    setLoading(true);
    try {
      const [viewsResponse, visitsResponse] = await Promise.all([
        supabase.from("page_views").select().eq("domain", website),
        supabase.from("visits").select().eq("website_id", website),
      ]);
      const views = viewsResponse.data;
      const visits = visitsResponse.data;

      setPageViews(views);
      setTotalVisits(visits);
      setGroupedPages(groupPageviews(views));
      // Assume you have a similar function to group page sources
      // setGroupedPageSources(groupPageSources(views));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen w-full items-start justify-start flex flex-col">
        <Header />
        <div className="min-h-screen w-full items-center justify-center flex text-white relative">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen w-full items-start justify-start flex flex-col">
      <Header />
      {pageViews?.length === 0 && !loading ? (
        <div className="w-full items-center justify-center flex flex-col space-y-6 z-40 relative min-h-screen px-4">
          <div className="z-40 w-full lg:w-2/3 bg-black border border-white/5 py-12 px-8 items-center justify-center flex flex-col text-white space-y-4" />
          <p className="bg-green-700 rounded-full p-4 animate-pulse" />
          <p className="animate-pulse">Waiting for the First Page View</p>
          <button className="button" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      ) : (
        <div className="z-40 w-[95%] md:w-3/4 lg:w-2/3 min-h-screen py-6 border-x border-white/5 items-center justify-start flex flex-col">
          <div className="w-full justify-center flex items-center">
            <Tabs
              defaultValue="General"
              className="w-full items-center justify-center flex flex-col"
            >
              <TabsList className="w-full bg-transparent mb-4 items-start justify-center flex">
                <TabsTrigger value="General">General</TabsTrigger>
                <TabsTrigger value="Custom Event">Custom Events</TabsTrigger>
              </TabsList>
              <TabsContent value="General">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 px-4 gap-6">
                  <div className="bg-black border-white/5 border text-white text-center">
                    <p className="text-white/70 font-medium py-8 w-full text-center border-b border-white/5">
                      Total Visits
                    </p>
                    <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                      {abbreviateNumber(totalVisits?.length)}
                    </p>
                  </div>
                  <div className="bg-black border-white/5 border text-white text-center">
                    <p className="text-white/70 font-medium py-8 w-full text-center border-b border-white/5">
                      PAGE VIEWS
                    </p>
                    <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                      {abbreviateNumber(pageViews?.length)}
                    </p>
                  </div>
                </div>
                <div className="items-center justify grid grid-col-1 bg-black lg:grid-cols-2 mt-12 w-full border-y border-white/5">
                  {/* TOP PAGES */}
                  <div className="flex flex-col bg-black z-40 h-full w-full">
                    <h1 className="label">Top Pages</h1>
                    {groupedPages.map((view) => (
                      <div
                        key={view.page}
                        className="text-white w-full items-center justify-between px-6 py-4 border-b border-white/5 flex"
                      >
                        <p>/{view.page}</p>
                        <p>{abbreviateNumber(view.views)}</p>
                      </div>
                    ))}
                  </div>
                  {/* Top Sources */}
                  <div className="flex flex-col bg-black z-40 h-full w-full lg:border-l border-t lg:border-t-0 border-white/5">
                    <h1 className="label relative">
                      Top Visit Sources
                      <p className="absolute bottom-2 right-2 text-[10px] italic font-light">
                        add ?utm={"source"} to track
                      </p>
                    </h1>
                  {/*  {groupedPageSources.map((pageSource) => (
                      <div
                        key={pageSource.source}
                        className="text-white w-full items-center justify-between px-6 py-4 border-b border-white/5 flex"
                      >
                        <p className="text-white/70 font-light">
                          /{pageSource.source}
                        </p>
                        <p>{abbreviateNumber(pageSource.visits)}</p>
                      </div>
                    ))}*/}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="Custom Event">
                Change your password here.
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
