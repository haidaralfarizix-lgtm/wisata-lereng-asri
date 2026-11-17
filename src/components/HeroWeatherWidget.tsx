import {useCallback, useEffect, useState} from 'react';
import {Cloud, CloudRain, CloudSun, Droplets, RefreshCw, Sun, Wind} from 'lucide-react';

interface WeatherConditionPayload {
  iconBaseUri?: string;
  description?: {
    text?: string;
    languageCode?: string;
  };
  type?: string;
}

interface WeatherApiData {
  isDaytime?: boolean;
  weatherCondition?: WeatherConditionPayload;
  temperature?: {
    degrees?: number;
    unit?: string;
  };
  feelsLikeTemperature?: {
    degrees?: number;
    unit?: string;
  };
  relativeHumidity?: number;
  precipitation?: {
    probability?: {
      percent?: number;
    };
  };
  wind?: {
    speed?: {
      value?: number;
    };
  };
}

interface WeatherApiProxyResponse {
  available: boolean;
  quotaExceeded?: boolean;
  reason?: string;
  data?: WeatherApiData;
}

const CONDITION_LABELS_ID: Record<string, string> = {
  CLEAR: 'Cerah',
  MOSTLY_CLEAR: 'Cerah Berawan',
  PARTLY_CLOUDY: 'Berawan Sebagian',
  MOSTLY_CLOUDY: 'Berawan Tebal',
  CLOUDY: 'Berawan',
  WINDY: 'Berangin',
  WIND_AND_RAIN: 'Hujan Berangin',
  LIGHT_RAIN_SHOWERS: 'Hujan Ringan',
  CHANCE_OF_SHOWERS: 'Berpotensi Hujan',
  SCATTERED_SHOWERS: 'Hujan Lokal',
  RAIN_SHOWERS: 'Hujan Sedang',
  HEAVY_RAIN_SHOWERS: 'Hujan Deras',
  LIGHT_TO_MODERATE_RAIN: 'Hujan Ringan',
  MODERATE_TO_HEAVY_RAIN: 'Hujan Deras',
  RAIN: 'Hujan',
  LIGHT_RAIN: 'Hujan Ringan',
  HEAVY_RAIN: 'Hujan Lebat',
  THUNDERSTORM: 'Hujan Petir',
  THUNDERSHOWER: 'Hujan Petir',
  LIGHT_THUNDERSTORM_RAIN: 'Gerimis Petir',
  SCATTERED_THUNDERSTORMS: 'Potensi Petir',
  HEAVY_THUNDERSTORM: 'Badai Petir',
  FOG: 'Berkabut',
  MIST: 'Berkabut Tipis',
  HAZE: 'Kabut Tipis',
};

function getIndonesianCondition(condition?: WeatherConditionPayload): string {
  if (!condition) return 'Sejuk Pegunungan';
  if (condition.type && CONDITION_LABELS_ID[condition.type]) {
    return CONDITION_LABELS_ID[condition.type];
  }
  return condition.description?.text || 'Sejuk Pegunungan';
}

function getPreparationTip(data: WeatherApiData): string {
  const temp = data.temperature?.degrees;
  const rainChance = data.precipitation?.probability?.percent ?? 0;
  const type = data.weatherCondition?.type || '';

  if (rainChance >= 50 || type.includes('RAIN') || type.includes('SHOWER') || type.includes('THUNDER')) {
    return 'Siapkan payung atau jas hujan ringan';
  }
  if (typeof temp === 'number' && temp <= 20) {
    return 'Udara sejuk, disarankan bawa jaket';
  }
  return 'Cuaca nyaman untuk jalan santai & foto';
}

function WeatherFallbackIcon({type}: {type?: string}) {
  if (!type) return <CloudSun className="w-6 h-6 text-[#FDE68A]" aria-hidden="true" />;
  if (type.includes('RAIN') || type.includes('SHOWER') || type.includes('THUNDER')) {
    return <CloudRain className="w-6 h-6 text-[#BAE6FD]" aria-hidden="true" />;
  }
  if (type === 'CLEAR' || type === 'MOSTLY_CLEAR') {
    return <Sun className="w-6 h-6 text-[#FDE68A]" aria-hidden="true" />;
  }
  if (type === 'CLOUDY' || type === 'MOSTLY_CLOUDY' || type === 'FOG' || type === 'MIST') {
    return <Cloud className="w-6 h-6 text-white/90" aria-hidden="true" />;
  }
  return <CloudSun className="w-6 h-6 text-[#FDE68A]" aria-hidden="true" />;
}

export function HeroWeatherWidget() {
  const [weather, setWeather] = useState<WeatherApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [iconFailed, setIconFailed] = useState(false);

  const loadWeather = useCallback(async () => {
    setLoading(true);
    setUnavailable(false);
    setIconFailed(false);

    try {
      const response = await fetch('/api/weather', {
        method: 'GET',
        cache: 'no-store',
      });

      const json = (await response.json().catch(() => null)) as WeatherApiProxyResponse | null;

      if (response.status === 429 || json?.quotaExceeded) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        setUnavailable(true);
        setWeather(null);
        return;
      }

      if (json?.available && json.data) {
        setWeather(json.data);
        return;
      }

      // Optional client-side fallback if only VITE_GOOGLE_MAPS_API_KEY was injected on the client
      const clientKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
      if (json?.reason === 'missing_key' && clientKey) {
        const directUrl = new URL('https://weather.googleapis.com/v1/currentConditions:lookup');
        directUrl.searchParams.append('key', clientKey);
        directUrl.searchParams.append('location.latitude', '-7.6248');
        directUrl.searchParams.append('location.longitude', '111.1324');
        directUrl.searchParams.append('unitsSystem', 'METRIC');

        const directRes = await fetch(directUrl.toString(), {
          method: 'GET',
          headers: {
            'X-Goog-Maps-Solution-ID': 'gmp_mcp_codeassist_v1_aistudio',
          },
        });
        const directPayload = (await directRes.json().catch(() => null)) as
          | (WeatherApiData & {error?: {status?: string}})
          | null;

        if (
          directRes.status === 429 ||
          directPayload?.error?.status === 'RESOURCE_EXHAUSTED'
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
          setUnavailable(true);
          setWeather(null);
          return;
        }

        if (directRes.ok && directPayload && directPayload.temperature) {
          setWeather(directPayload);
          return;
        }
      }

      setUnavailable(true);
    } catch {
      setUnavailable(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWeather();
  }, [loadWeather]);

  if (loading) {
    return (
      <div
        aria-label="Memuat informasi cuaca Ngargoyoso"
        className="mt-6 inline-flex items-center gap-3 rounded-xl bg-black/45 backdrop-blur-md border border-white/20 px-4 py-3 text-white max-w-md"
      >
        <div className="w-8 h-8 rounded-lg bg-white/15 animate-pulse shrink-0" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-36 rounded bg-white/20 animate-pulse" />
          <div className="h-3 w-48 rounded bg-white/15 animate-pulse" />
        </div>
      </div>
    );
  }

  if (unavailable || !weather || typeof weather.temperature?.degrees !== 'number') {
    return (
      <div className="mt-6 inline-flex flex-wrap items-center justify-between gap-3 rounded-xl bg-black/45 backdrop-blur-md border border-white/20 px-4 py-3 text-white max-w-md">
        <div className="flex items-center gap-3">
          <CloudSun className="w-6 h-6 text-[#FDE68A] shrink-0" aria-hidden="true" />
          <div>
            <p className="font-display text-sm font-semibold">
              Cuaca Ngargoyoso · Rata-rata 18–24 °C
            </p>
            <p className="text-xs text-white/80">
              Sejuk pegunungan, siapkan jaket hangat untuk pagi &amp; sore
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void loadWeather()}
          aria-label="Muat ulang data cuaca Ngargoyoso"
          className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const tempRounded = Math.round(weather.temperature.degrees);
  const conditionLabel = getIndonesianCondition(weather.weatherCondition);
  const iconUri = weather.weatherCondition?.iconBaseUri
    ? `${weather.weatherCondition.iconBaseUri}.svg`
    : null;
  const humidity = weather.relativeHumidity;
  const windSpeed = weather.wind?.speed?.value;
  const tip = getPreparationTip(weather);

  return (
    <div
      aria-label={`Cuaca saat ini di Ngargoyoso: ${tempRounded} derajat Celsius, ${conditionLabel}`}
      className="mt-6 inline-flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 px-4 py-3 text-white max-w-xl"
    >
      <div className="flex items-center gap-3">
        {iconUri && !iconFailed ? (
          <img
            src={iconUri}
            alt={conditionLabel}
            referrerPolicy="no-referrer"
            onError={() => setIconFailed(true)}
            className="w-8 h-8 shrink-0"
          />
        ) : (
          <WeatherFallbackIcon type={weather.weatherCondition?.type} />
        )}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold tabular-nums">
              {tempRounded}°C
            </span>
            <span className="font-display text-sm font-semibold text-white/95">
              {conditionLabel}
            </span>
          </div>
          <p className="text-xs text-white/80">
            Ngargoyoso saat ini · {tip}
          </p>
        </div>
      </div>

      {(typeof humidity === 'number' || typeof windSpeed === 'number') && (
        <div className="flex items-center gap-3 sm:pl-4 sm:border-l sm:border-white/20 text-xs text-white/85 tabular-nums">
          {typeof humidity === 'number' && (
            <span className="inline-flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-[#A5ECC0]" aria-hidden="true" />
              {humidity}%
            </span>
          )}
          {typeof windSpeed === 'number' && (
            <span className="inline-flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-[#A5ECC0]" aria-hidden="true" />
              {Math.round(windSpeed)} km/j
            </span>
          )}
        </div>
      )}
    </div>
  );
}
