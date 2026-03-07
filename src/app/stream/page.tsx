import { MonitorPlay, PlayCircle } from "lucide-react";
import { getStreams } from "@/lib/api";
import Link from "next/link";
import StreamPlayer from "./StreamPlayer";

export default async function StreamPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const streams = await getStreams();
    const selectedId = searchParams.id ? parseInt(searchParams.id, 10) : null;
    const selectedStream = streams.find((s) => s.id === selectedId) || streams[0];

    return (
        <div className="flex flex-col w-full max-w-6xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
                <MonitorPlay className="text-red-500 w-8 h-8" />
                <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-white">Live Stream</h1>
            </div>

            <div className="w-full aspect-video bg-black rounded-xl border border-white/10 overflow-hidden relative shadow-2xl shadow-red-500/10">
                {selectedStream ? (
                    <StreamPlayer stream={selectedStream} />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#15151E]/90 backdrop-blur-md z-10">
                        <MonitorPlay className="w-20 h-20 text-red-500 mx-auto opacity-80 mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">No Streams Available</h2>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed text-center max-w-md">
                            There are currently no live streams available for motorsports. Please check back later.
                        </p>
                    </div>
                )}
            </div>

            {streams.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Available Streams</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {streams.map((stream) => (
                            <Link
                                key={stream.id}
                                href={`/stream?id=${stream.id}`}
                                className={`group relative overflow-hidden rounded-lg aspect-video border transition-all duration-300 ${selectedStream?.id === stream.id
                                        ? "border-red-500 shadow-lg shadow-red-500/20 ring-2 ring-red-500/50"
                                        : "border-white/10 hover:border-white/30"
                                    }`}
                            >
                                <img
                                    src={stream.poster}
                                    alt={stream.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        {selectedStream?.id === stream.id ? (
                                            <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold uppercase tracking-wider bg-black/50 px-2 py-1 rounded">
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                                Playing
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-white/80 text-xs font-semibold uppercase tracking-wider bg-black/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                <PlayCircle className="w-3 h-3" />
                                                Play
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-white font-bold truncate">{stream.name}</h3>
                                    <p className="text-gray-300 text-xs truncate">{stream.tag}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
