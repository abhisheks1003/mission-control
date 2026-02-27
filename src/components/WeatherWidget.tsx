// Mock data — replace with real weather API (e.g. Open-Meteo) when ready

type WeatherData = {
  condition: string;
  icon: string;
  tempC: number;
  feelsLikeC: number;
  highC: number;
  lowC: number;
  humidity: number;
  location: string;
};

const mockWeather: WeatherData = {
  condition: "Partly Cloudy",
  icon: "⛅",
  tempC: 18,
  feelsLikeC: 16,
  highC: 21,
  lowC: 13,
  humidity: 62,
  location: "London, UK",
};

export default function WeatherWidget() {
  const w = mockWeather;

  return (
    <section className="glass-panel rounded-3xl p-5">
      <p className="widget-header">Weather</p>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none" role="img" aria-label={w.condition}>
            {w.icon}
          </span>
          <div>
            <p className="text-3xl font-light tracking-tight text-slate-50">
              {w.tempC}°<span className="text-lg text-slate-400">C</span>
            </p>
            <p className="text-sm text-slate-400">{w.condition}</p>
          </div>
        </div>
        <div className="text-right text-xs text-slate-400 space-y-1">
          <p>Feels like {w.feelsLikeC}°C</p>
          <p>
            H: <span className="text-slate-300">{w.highC}°</span> · L:{" "}
            <span className="text-slate-300">{w.lowC}°</span>
          </p>
          <p>Humidity {w.humidity}%</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{w.location} · Mock data</p>
    </section>
  );
}
