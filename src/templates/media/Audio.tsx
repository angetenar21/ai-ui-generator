import React, { useState, useRef, useEffect } from 'react';

interface AudioProps {
  src: string;
  title?: string;
  artist?: string;
  album?: string;
  coverArt?: string;
  autoPlay?: boolean;
  loop?: boolean;
  variant?: 'default' | 'compact' | 'full';
  showWaveform?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}

const Audio: React.FC<AudioProps> = ({
  src,
  title = 'Untitled',
  artist,
  album,
  coverArt,
  autoPlay = false,
  loop = false,
  variant = 'default',
  showWaveform = false,
  className = '',
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (onTimeUpdate) onTimeUpdate(audio.currentTime);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [onTimeUpdate]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        if (onPause) onPause();
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        if (onPlay) onPlay();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted) {
        setVolume(0);
      } else {
        setVolume(1);
        audioRef.current.volume = 1;
      }
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100 || 0;

  if (variant === 'compact') {
    return (
      <div className={`glass-dark border border-gray-700/50 rounded-xl p-4 max-w-md ${className}`}>
        <audio
          ref={audioRef}
          src={src}
          autoPlay={autoPlay}
          loop={loop}
          onEnded={() => {
            setIsPlaying(false);
            if (onEnded) onEnded();
          }}
        />

        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="flex-shrink-0 w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="text-white font-medium text-sm truncate">{title}</div>
            {artist && <div className="text-gray-400 text-xs truncate">{artist}</div>}
            <div className="mt-1">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                disabled={isLoading}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #374151 ${progress}%, #374151 100%)`,
                }}
              />
            </div>
          </div>

          <div className="flex-shrink-0 text-xs text-gray-400">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-dark border border-gray-700/50 rounded-2xl p-6 max-w-2xl ${className}`}>
      <audio
        ref={audioRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
      />

      {variant === 'full' && (
        <div className="flex gap-6 mb-6">
          {/* Cover Art */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden">
              {coverArt ? (
                <img src={coverArt} alt={title} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              )}
            </div>
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white text-xl font-bold mb-1 truncate">{title}</h3>
            {artist && <p className="text-gray-400 text-sm mb-1 truncate">{artist}</p>}
            {album && <p className="text-gray-500 text-xs truncate">{album}</p>}
          </div>
        </div>
      )}

      {/* Waveform Visualization */}
      {showWaveform && (
        <div className="mb-4 h-16 bg-gray-900/50 rounded-lg overflow-hidden flex items-center justify-center gap-1 px-2">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-150 ${
                i < progress / 2 ? 'bg-blue-500' : 'bg-gray-700'
              }`}
              style={{
                height: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          disabled={isLoading}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #374151 ${progress}%, #374151 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Volume Control */}
          <div
            className="relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              {isMuted || volume === 0 ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : volume < 0.5 ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
              )}
            </button>
            {showVolumeSlider && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-800 rounded-lg shadow-xl">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="h-20 w-2 appearance-none bg-gray-700 rounded-lg cursor-pointer vertical-slider"
                  style={{ writingMode: 'vertical-lr' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => skip(-10)}
            disabled={isLoading}
            className="text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors shadow-lg"
          >
            {isLoading ? (
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => skip(10)}
            disabled={isLoading}
            className="text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.loop = !loop;
              }
            }}
            className={`text-gray-400 hover:text-white transition-colors p-2 ${loop ? 'text-blue-500' : ''}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Audio;

export const metadata = {
  name: 'audio',
  category: 'media' as const,
  component: Audio,
  description: 'Audio player component with playback controls, seek functionality, volume control, waveform visualization, and multiple display variants including compact and full modes with cover art.',
  tags: ['ui', 'media', 'audio', 'player', 'music', 'controls'],
};
