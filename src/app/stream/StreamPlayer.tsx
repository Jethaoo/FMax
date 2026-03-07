"use client";

import { useState } from "react";
import { MonitorPlay } from "lucide-react";
import { StreamObj } from "@/lib/types";

export default function StreamPlayer({ stream }: { stream: StreamObj }) {
    const [isLoaded, setIsLoaded] = useState(false);

    const iframeSrc = stream.iframe || "";

    if (!iframeSrc) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center text-white bg-[#15151E]">
                <MonitorPlay className="w-16 h-16 text-yellow-500 mb-4 opacity-80" />
                <h2 className="text-xl font-bold mb-2">Stream Source Unavailable</h2>
                <p className="text-gray-400">The stream provider did not provide an iframe URL.</p>
            </div>
        );
    }

    return (
        <>
            <iframe
                id="player"
                className={`absolute inset-0 w-full h-full z-20 transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                src={iframeSrc}
                title={stream.name}
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={(e) => {
                    if (e.currentTarget.src && e.currentTarget.src !== window.location.href) {
                        setIsLoaded(true);
                    }
                }}
            ></iframe>

            {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#15151E]/90 backdrop-blur-md z-10 w-full h-full">
                    <div className="relative inline-block mb-6">
                        <MonitorPlay className="w-20 h-20 text-red-500 mx-auto opacity-80" />
                        <div className="absolute flex top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-[#15151E] animate-pulse"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3 tracking-wide text-center">Loading Stream...</h2>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed text-center">
                        Connecting to {stream.name}. Please wait.
                    </p>
                </div>
            )}
        </>
    );
}
