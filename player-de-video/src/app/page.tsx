"use client"

import { useEffect, useRef, useState } from "react";
import { FaBackward, FaForward, FaPauseCircle, FaPlayCircle, FaStepBackward, FaStepForward, FaVolumeUp } from "react-icons/fa";

const videosData = [
  {
    nome: "video1",
    url: "https://www.pexels.com/download/video/14109231/",
    imagem: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400"
  },
  {
    nome: "video2",
    url: "https://www.pexels.com/download/video/3723676/",
    imagem: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400"
  },
  {
    nome: "video3",
    url: "https://www.pexels.com/download/video/3249516/",
    imagem: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400"
  }
];

export default function Home() {
  const [playing, isPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoIndex, setVideoIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(1);
  const [colorFilter, setColorFilter] = useState<"normal" | "grayscale" | "red" | "blue" | "green">("normal");

  useEffect(() => {
    if (playing) {
      play();
    }
    const video = videoRef.current;
    if (!video) return;
    
    video.onloadedmetadata = () => {
      setDuration(video.duration);
    }

    video.ontimeupdate = () => {
      setCurrentTime(video.currentTime);
    }

    video.onended = () => {
      configVideo(videoIndex + 1);
    }
    
    video.playbackRate = velocity;

  }, [videoIndex])

  useEffect(() => {
    configVideo(0);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.trunc(time / 60);
    const seconds = Math.trunc(time % 60);
    return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
  }

  const play = () => { videoRef.current?.play(); }
  const pause = () => { videoRef.current?.pause(); }

  const playPause = () => {
    if (playing) { pause(); } else { play(); }
    isPlaying(!playing);
  }

  const configVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = value;
    setVolume(value);
  }

  const configVideo = (index: number) => {
    let nextIndex = index;
    if (nextIndex >= videosData.length) {
      nextIndex = 0; 
    } else if (nextIndex < 0) {
      nextIndex = videosData.length - 1;
    }
    setVideoIndex(nextIndex);
    
    if (playing) {
        setTimeout(() => play(), 50);
    }
  }

  const configVelocity = () => {
    let newVelocity = velocity + 0.5;
    if (newVelocity > 2) newVelocity = 1;
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = newVelocity;
    setVelocity(newVelocity);
  }

  const configCurrentTime = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8 flex items-center justify-center font-sans">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-neutral-900 border border-neutral-800 p-6 rounded-3xl shadow-2xl w-full max-w-6xl">
        
        <div className="lg:col-span-1 space-y-4 flex flex-col max-h-[600px]">
          <h2 className="text-2xl font-bold text-white tracking-tight">Lista de Vídeos</h2>
          
          <ul className="space-y-3 overflow-y-auto pr-2 flex-grow">
            {videosData.map((video, index) => {
              const isCurrent = index === videoIndex;
              return (
                <li 
                  key={index} 
                  onClick={() => configVideo(index)} 
                  className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all duration-200 ${
                    isCurrent 
                      ? 'bg-neutral-800 border border-teal-500 shadow-md ring-1 ring-teal-900' 
                      : 'hover:bg-neutral-800 border border-transparent'
                  }`}
                >
                  <img src={video.imagem} alt={video.nome} className="w-16 h-10 object-cover rounded-md" />
                  <div className="flex flex-col truncate">
                    <h1 className={`text-sm truncate ${isCurrent ? 'font-bold text-teal-400' : 'text-neutral-200'}`}>
                      {video.nome}
                    </h1>
                    <p className="text-xs text-neutral-400">Canal Rec</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="lg:col-span-2 bg-neutral-800 p-6 rounded-2xl border border-neutral-700 flex flex-col gap-6">
          
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
            <video 
              ref={videoRef} 
              src={videosData[videoIndex].url} 
              className={`w-full h-full object-cover transition-all duration-300 ${colorFilter === 'grayscale' ? 'grayscale' : ''}`}
            />
            
            {colorFilter === 'red' && <div className="absolute inset-0 bg-red-600/30 mix-blend-color pointer-events-none" />}
            {colorFilter === 'blue' && <div className="absolute inset-0 bg-blue-600/30 mix-blend-color pointer-events-none" />}
            {colorFilter === 'green' && <div className="absolute inset-0 bg-green-600/30 mix-blend-color pointer-events-none" />}
          </div>

          <div className="flex flex-wrap gap-2 items-center justify-center bg-neutral-900/50 p-3 rounded-xl border border-neutral-700/50">
            <span className="text-xs font-semibold text-neutral-400 w-full text-center md:w-auto md:text-left mr-2">Efeitos de Cor:</span>
            <button onClick={() => setColorFilter("normal")} className={`px-3 py-1 text-xs rounded-md border font-medium transition-all ${colorFilter === 'normal' ? 'bg-white text-neutral-900 border-white' : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'}`}>Normal</button>
            <button onClick={() => setColorFilter("grayscale")} className={`px-3 py-1 text-xs rounded-md border font-medium transition-all ${colorFilter === 'grayscale' ? 'bg-white text-neutral-900 border-white' : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'}`}>Sem Cores / Cinza</button>
            <button onClick={() => setColorFilter("red")} className={`px-3 py-1 text-xs rounded-md border font-medium transition-all ${colorFilter === 'red' ? 'bg-red-600 text-white border-red-500' : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'}`}>Tom Vermelho</button>
            <button onClick={() => setColorFilter("blue")} className={`px-3 py-1 text-xs rounded-md border font-medium transition-all ${colorFilter === 'blue' ? 'bg-blue-600 text-white border-blue-500' : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'}`}>Tom Azul</button>
            <button onClick={() => setColorFilter("green")} className={`px-3 py-1 text-xs rounded-md border font-medium transition-all ${colorFilter === 'green' ? 'bg-green-600 text-white border-green-500' : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'}`}>Tom Verde</button>
          </div>

          <div className="w-full flex flex-col gap-4 mt-auto">
            
            <div className="w-full flex items-center gap-3 text-xs text-neutral-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <input 
                type="range" min={0} step={0.001} max={duration || 1} value={currentTime}
                onChange={(e) => configCurrentTime(Number(e.target.value))}
                className="flex-grow h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button onClick={() => configCurrentTime(currentTime - 10)} className="text-lg text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-700"><FaBackward /></button>
              <button onClick={() => configVideo(videoIndex - 1)} className="text-xl text-neutral-300 hover:text-white p-2 rounded-full hover:bg-neutral-700"><FaStepBackward /></button>
              
              <button onClick={playPause} className="bg-white text-neutral-950 rounded-full hover:scale-105 transition-transform text-5xl">
                {playing ? <FaPauseCircle /> : <FaPlayCircle />}
              </button>

              <button onClick={() => configVideo(videoIndex + 1)} className="text-xl text-neutral-300 hover:text-white p-2 rounded-full hover:bg-neutral-700"><FaStepForward /></button>
              <button onClick={() => configCurrentTime(currentTime + 10)} className="text-lg text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-700"><FaForward /></button>
            </div>

            <div className="flex items-center gap-6 border-t border-neutral-700 pt-4">
              <div className="flex items-center gap-3 text-neutral-400 flex-grow max-w-xs">
                <FaVolumeUp className="text-sm"/>
                <input type="range" min={0} max={1} step={0.001} value={volume}
                  onChange={(e) => configVolume(Number(e.target.value))}
                  className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-neutral-300"
                />
              </div>

              <h1 className="text-lg font-bold text-white mx-auto truncate max-w-[200px]">
                {videosData[videoIndex].nome}
              </h1>

              <button onClick={configVelocity} className="text-xs font-mono font-bold bg-teal-600/20 text-teal-300 border border-teal-500/30 rounded-full h-8 w-8 flex items-center justify-center hover:bg-teal-600/40 transition-all">
                {velocity}x
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
