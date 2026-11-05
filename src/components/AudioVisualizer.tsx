import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isRecording: boolean;
  isPaused: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  analyser,
  isRecording,
  isPaused,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!analyser || !isRecording || isPaused) {
      // Draw idle flat line / gentle idle wave
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.lineWidth = 2;
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / 40) - 2;
      let x = 0;

      for (let i = 0; i < 40; i++) {
        // Sample frequency values smoothly
        const sampleIndex = Math.floor((i / 40) * (bufferLength / 2));
        const rawValue = dataArray[sampleIndex] || 0;
        const normalized = rawValue / 255;
        const barHeight = Math.max(4, normalized * (canvas.height - 8));

        const y = (canvas.height - barHeight) / 2;

        // Gradient for active bars
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#6366f1'); // Indigo 500
        gradient.addColorStop(1, '#818cf8'); // Indigo 400

        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Rounded bars
        ctx.roundRect(x, y, Math.max(2, barWidth), barHeight, 3);
        ctx.fill();

        x += barWidth + 2;
      }
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, isRecording, isPaused]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-slate-900/90 p-4 shadow-inner border border-slate-800">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <span className="font-mono">MIC INPUT FREQUENCY SPECTRUM</span>
        <span className="font-mono tabular-nums">
          {isRecording && !isPaused ? 'LIVE AUDIO ACTIVE' : isPaused ? 'PAUSED' : 'STANDBY'}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={560}
        height={80}
        className="w-full h-20 block"
      />
    </div>
  );
};
