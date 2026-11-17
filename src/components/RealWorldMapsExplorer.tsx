/// <reference types="google.maps" />
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  Bike,
  Car,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Footprints,
  LocateFixed,
  MapPin,
  Navigation,
  RefreshCw,
  Star,
} from 'lucide-react';
import {VILLAGE_CONTACT} from '../data/lerengAsriData';
import {
  LatLngPoint,
  decodeEncodedPolyline,
  formatDistanceId,
  formatDurationId,
} from '../utils/polyline';

const LERENG_ASRI_COORDS: LatLngPoint = {
  lat: -7.6248,
  lng: 111.1324,
};

interface NearbyPlace {
  id: string;
  displayName?: {text?: string; languageCode?: string};
  formattedAddress?: string;
  shortFormattedAddress?: string;
  location?: {latitude?: number; longitude?: number};
  primaryType?: string;
  primaryTypeDisplayName?: {text?: string};
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  currentOpeningHours?: {openNow?: boolean};
}

interface RouteStep {
  distanceMeters?: number;
  staticDuration?: string;
  navigationInstruction?: {
    maneuver?: string;
    instructions?: string;
  };
}

interface ComputedRoute {
  duration?: string;
  distanceMeters?: number;
  polyline?: {encodedPolyline?: string};
  legs?: Array<{steps?: RouteStep[]}>;
}

interface OriginPreset {
  id: string;
  label: string;
  coords: LatLngPoint;
}

const ORIGIN_PRESETS: OriginPreset[] = [
  {id: 'karanganyar', label: 'Karanganyar Kota', coords: {lat: -7.5961, lng: 110.9507}},
  {id: 'solo', label: 'Solo (Stasiun Balapan)', coords: {lat: -7.5567, lng: 110.8214}},
  {id: 'yogyakarta', label: 'Yogyakarta (Tugu)', coords: {lat: -7.7829, lng: 110.3671}},
  {id: 'semarang', label: 'Semarang (Simpang Lima)', coords: {lat: -6.9904, lng: 110.4229}},
];

interface PlaceCategoryOption {
  id: string;
  label: string;
  types: string[];
}

const PLACE_CATEGORIES: PlaceCategoryOption[] = [
  {
    id: 'wisata',
    label: 'Wisata Sekitar',
    types: ['tourist_attraction', 'park', 'national_park'],
  },
  {
    id: 'kuliner',
    label: 'Kuliner & Kafe',
    types: ['restaurant', 'cafe'],
  },
  {
    id: 'penginapan',
    label: 'Penginapan',
    types: ['lodging', 'campground'],
  },
  {
    id: 'masjid',
    label: 'Masjid',
    types: ['mosque'],
  },
  {
    id: 'spbu',
    label: 'SPBU & ATM',
    types: ['gas_station', 'atm'],
  },
];

type ExplorerPanelTab = 'places' | 'route';
type TravelModeOption = 'DRIVE' | 'TWO_WHEELER' | 'WALK';

function RoutePolylineOverlay({
  encodedPolyline,
  originCoords,
  destinationCoords,
}: {
  encodedPolyline: string | null;
  originCoords: LatLngPoint | null;
  destinationCoords: LatLngPoint;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !encodedPolyline || typeof google === 'undefined') return;

    const decodedPath = decodeEncodedPolyline(encodedPolyline);
    if (decodedPath.length === 0) return;

    const line = new google.maps.Polyline({
      path: decodedPath,
      geodesic: true,
      strokeColor: '#1E4D38',
      strokeOpacity: 0.92,
      strokeWeight: 5,
      map,
    });

    const bounds = new google.maps.LatLngBounds();
    decodedPath.forEach((pt) => bounds.extend(pt));
    if (originCoords) bounds.extend(originCoords);
    bounds.extend(destinationCoords);
    map.fitBounds(bounds, 48);

    return () => {
      line.setMap(null);
    };
  }, [map, encodedPolyline, originCoords, destinationCoords]);

  return null;
}

function MapCameraFocus({target}: {target: LatLngPoint | null}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !target) return;
    map.panTo(target);
    const currentZoom = map.getZoom() ?? 13;
    if (currentZoom < 14) {
      map.setZoom(14);
    }
  }, [map, target]);

  return null;
}

function NearbyPlaceMarker({
  place,
  isSelected,
  onSelect,
  onClear,
  onComputeRouteToPlace,
}: {
  place: NearbyPlace;
  isSelected: boolean;
  onSelect: () => void;
  onClear: () => void;
  onComputeRouteToPlace: (place: NearbyPlace) => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const lat = place.location?.latitude;
  const lng = place.location?.longitude;

  if (typeof lat !== 'number' || typeof lng !== 'number') return null;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{lat, lng}}
        title={place.displayName?.text || 'Tempat terdekat'}
        onClick={onSelect}
      >
        <Pin
          background={isSelected ? '#D97706' : '#2E7D52'}
          borderColor={isSelected ? '#92400E' : '#0E3823'}
          glyphColor="#FFFFFF"
          scale={isSelected ? 1.2 : 1.0}
        />
      </AdvancedMarker>

      {isSelected && marker && (
        <InfoWindow anchor={marker} maxWidth={260} onCloseClick={onClear}>
          <div className="p-1 text-[#19221C] font-sans">
            <p className="font-display text-sm font-bold leading-snug">
              {place.displayName?.text || 'Lokasi Sekitar'}
            </p>
            {place.primaryTypeDisplayName?.text && (
              <p className="text-xs text-[#2E7D52] font-semibold mt-0.5">
                {place.primaryTypeDisplayName.text}
              </p>
            )}
            {typeof place.rating === 'number' && (
              <p className="text-xs text-[#435248] mt-1 inline-flex items-center gap-1 tabular-nums">
                <Star className="w-3.5 h-3.5 text-[#D97706] fill-[#D97706]" aria-hidden="true" />
                <span className="font-semibold text-[#19221C]">{place.rating.toFixed(1)}</span>
                {typeof place.userRatingCount === 'number' && (
                  <span>({place.userRatingCount} ulasan)</span>
                )}
              </p>
            )}
            {place.shortFormattedAddress && (
              <p className="text-xs text-[#435248] mt-1 leading-snug">
                {place.shortFormattedAddress}
              </p>
            )}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onComputeRouteToPlace(place)}
                className="px-2.5 py-1.5 rounded-lg bg-[#1E4D38] text-white text-xs font-semibold hover:bg-[#0E3823] transition-colors"
              >
                Rute ke Sini
              </button>
              {place.googleMapsUri && (
                <a
                  href={place.googleMapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg border border-[#D1DDD5] text-[#19221C] text-xs font-semibold hover:bg-[#EEF3EF] transition-colors inline-flex items-center gap-1"
                >
                  <span>Maps</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function MainVillageMarker({
  isSelected,
  onSelect,
  onClear,
}: {
  isSelected: boolean;
  onSelect: () => void;
  onClear: () => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={LERENG_ASRI_COORDS}
        title={VILLAGE_CONTACT.brandName}
        onClick={onSelect}
      >
        <Pin
          background="#1E4D38"
          borderColor="#0E3823"
          glyphColor="#FFFFFF"
          scale={1.25}
        />
      </AdvancedMarker>

      {isSelected && marker && (
        <InfoWindow anchor={marker} maxWidth={260} onCloseClick={onClear}>
          <div className="p-1 text-[#19221C] font-sans">
            <p className="font-display text-sm font-bold">{VILLAGE_CONTACT.brandName}</p>
            <p className="text-xs text-[#2E7D52] font-semibold mt-0.5">
              Gerbang Utama &amp; Pusat Informasi
            </p>
            <p className="text-xs text-[#435248] mt-1 leading-snug">
              {VILLAGE_CONTACT.address}
            </p>
            <a
              href={VILLAGE_CONTACT.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#1E4D38] hover:underline"
            >
              <span>Buka di Google Maps</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function RealWorldMapsExplorer() {
  const [apiKey, setApiKey] = useState<string>(
    (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || ''
  );
  const [configLoaded, setConfigLoaded] = useState(false);

  const [activeTab, setActiveTab] = useState<ExplorerPanelTab>('places');
  const [categoryId, setCategoryId] = useState<string>(PLACE_CATEGORIES[0].id);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState<string | null>(null);

  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>('lereng-asri-main');
  const [cameraTarget, setCameraTarget] = useState<LatLngPoint | null>(null);

  const [selectedOriginId, setSelectedOriginId] = useState<string>(ORIGIN_PRESETS[0].id);
  const [customGpsOrigin, setCustomGpsOrigin] = useState<LatLngPoint | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  const [routeDestination, setRouteDestination] = useState<{
    name: string;
    coords: LatLngPoint;
  }>({
    name: VILLAGE_CONTACT.brandName,
    coords: LERENG_ASRI_COORDS,
  });

  const [travelMode, setTravelMode] = useState<TravelModeOption>('DRIVE');
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [computedRoute, setComputedRoute] = useState<ComputedRoute | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/maps-config', {cache: 'no-store'})
      .then((res) => res.json())
      .then((data: {apiKey?: string}) => {
        if (!active) return;
        if (data.apiKey) {
          setApiKey(data.apiKey);
        }
      })
      .catch(() => {
        // Ignore; fallback to VITE_GOOGLE_MAPS_API_KEY if set
      })
      .finally(() => {
        if (active) setConfigLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const fetchNearbyPlaces = useCallback(async (selectedCategoryId: string) => {
    const category =
      PLACE_CATEGORIES.find((c) => c.id === selectedCategoryId) || PLACE_CATEGORIES[0];

    setPlacesLoading(true);
    setPlacesError(null);

    try {
      const response = await fetch('/api/places/nearby', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          includedTypes: category.types,
          radiusMeters: 6000,
          maxResultCount: 8,
          latitude: LERENG_ASRI_COORDS.lat,
          longitude: LERENG_ASRI_COORDS.lng,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        available?: boolean;
        quotaExceeded?: boolean;
        reason?: string;
        places?: NearbyPlace[];
      } | null;

      if (response.status === 429 || data?.quotaExceeded) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        setPlacesError('Batas kuota harian Google Maps Platform tercapai.');
        setPlaces([]);
        return;
      }

      if (!data?.available) {
        setPlacesError(
          data?.reason === 'missing_key'
            ? 'Kunci Google Maps Platform belum tersedia di lingkungan server.'
            : 'Data tempat sekitar belum dapat dimuat saat ini.'
        );
        setPlaces([]);
        return;
      }

      setPlaces(Array.isArray(data.places) ? data.places : []);
    } catch {
      setPlacesError('Gagal terhubung ke layanan tempat terdekat.');
      setPlaces([]);
    } finally {
      setPlacesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!configLoaded) return;
    void fetchNearbyPlaces(categoryId);
  }, [configLoaded, categoryId, fetchNearbyPlaces]);

  const activeOriginCoords = useMemo<LatLngPoint>(() => {
    if (selectedOriginId === 'gps' && customGpsOrigin) {
      return customGpsOrigin;
    }
    const preset =
      ORIGIN_PRESETS.find((item) => item.id === selectedOriginId) || ORIGIN_PRESETS[0];
    return preset.coords;
  }, [selectedOriginId, customGpsOrigin]);

  const activeOriginLabel = useMemo(() => {
    if (selectedOriginId === 'gps' && customGpsOrigin) {
      return 'Lokasi GPS Anda';
    }
    return (
      ORIGIN_PRESETS.find((item) => item.id === selectedOriginId)?.label ||
      ORIGIN_PRESETS[0].label
    );
  }, [selectedOriginId, customGpsOrigin]);

  const calculateRoute = useCallback(
    async (
      origin: LatLngPoint,
      destination: LatLngPoint,
      mode: TravelModeOption,
      noTolls: boolean
    ) => {
      setRouteLoading(true);
      setRouteError(null);

      try {
        const response = await fetch('/api/routes/compute', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            origin,
            destination,
            travelMode: mode,
            avoidTolls: noTolls,
          }),
        });

        const data = (await response.json().catch(() => null)) as {
          available?: boolean;
          quotaExceeded?: boolean;
          reason?: string;
          route?: ComputedRoute | null;
        } | null;

        if (response.status === 429 || data?.quotaExceeded) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
          setRouteError('Batas kuota harian Google Maps Platform tercapai.');
          setComputedRoute(null);
          return;
        }

        if (!data?.available || !data.route) {
          setRouteError('Rute tidak dapat dihitung untuk titik pilihan ini.');
          setComputedRoute(null);
          return;
        }

        setComputedRoute(data.route);
      } catch {
        setRouteError('Gagal menghubungi layanan rute perjalanan.');
        setComputedRoute(null);
      } finally {
        setRouteLoading(false);
      }
    },
    []
  );

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Perangkat ini tidak mendukung fitur GPS browser.');
      return;
    }

    setGpsStatus('Mencari lokasi Anda...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCustomGpsOrigin(coords);
        setSelectedOriginId('gps');
        setGpsStatus('Lokasi Anda ditemukan.');
        void calculateRoute(coords, routeDestination.coords, travelMode, avoidTolls);
      },
      () => {
        setGpsStatus('Izin lokasi ditolak atau tidak tersedia.');
      },
      {enableHighAccuracy: false, timeout: 8000}
    );
  };

  const handleRouteToPlace = (place: NearbyPlace) => {
    const lat = place.location?.latitude;
    const lng = place.location?.longitude;
    if (typeof lat !== 'number' || typeof lng !== 'number') return;

    const nextDest = {
      name: place.displayName?.text || 'Tujuan Pilihan',
      coords: {lat, lng},
    };
    setRouteDestination(nextDest);
    setActiveTab('route');
    void calculateRoute(activeOriginCoords, nextDest.coords, travelMode, avoidTolls);
  };

  const googleMapsDirectionsUrl = useMemo(() => {
    const modeMap: Record<TravelModeOption, string> = {
      DRIVE: 'driving',
      TWO_WHEELER: 'driving',
      WALK: 'walking',
    };
    return `https://www.google.com/maps/dir/?api=1&origin=${activeOriginCoords.lat},${activeOriginCoords.lng}&destination=${routeDestination.coords.lat},${routeDestination.coords.lng}&travelmode=${modeMap[travelMode]}`;
  }, [activeOriginCoords, routeDestination, travelMode]);

  const routeSteps = computedRoute?.legs?.[0]?.steps ?? [];
  const encodedPolyline = computedRoute?.polyline?.encodedPolyline || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left: Real-World Interactive Google Map */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-[#D1DDD5] p-3 sm:p-4 flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#19221C]">
            <MapPin className="w-4 h-4 text-[#1E4D38]" aria-hidden="true" />
            <span>Peta Google Maps · Ngargoyoso, Karanganyar</span>
          </div>
          <span className="text-xs text-[#435248] tabular-nums">
            {LERENG_ASRI_COORDS.lat.toFixed(4)}, {LERENG_ASRI_COORDS.lng.toFixed(4)}
          </span>
        </div>

        <div className="w-full h-[380px] sm:h-[460px] rounded-xl overflow-hidden border border-[#E4EDE6] bg-[#E8F5E9] relative">
          {!configLoaded ? (
            <div className="w-full h-full flex items-center justify-center text-sm text-[#435248]">
              Menyiapkan peta interaktif Google Maps...
            </div>
          ) : !apiKey ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#EEF3EF]">
              <MapPin className="w-8 h-8 text-[#1E4D38] mb-2" aria-hidden="true" />
              <p className="font-display text-base font-bold text-[#19221C]">
                Peta Google Maps Belum Aktif
              </p>
              <p className="text-sm text-[#435248] mt-1 max-w-md">
                Tambahkan kunci Google Maps Platform atau buka langsung koordinat Desa Wisata Lereng Asri di aplikasi Google Maps.
              </p>
              <a
                href={VILLAGE_CONTACT.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E4D38] text-white font-display text-sm font-semibold"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          ) : (
            <APIProvider apiKey={apiKey} libraries={['marker']} language="id" region="ID">
              <GoogleMap
                mapId="DEMO_MAP_ID"
                defaultCenter={LERENG_ASRI_COORDS}
                defaultZoom={13}
                gestureHandling="greedy"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                className="w-full h-full"
              >
                <MapCameraFocus target={cameraTarget} />

                <MainVillageMarker
                  isSelected={selectedPlaceId === 'lereng-asri-main'}
                  onSelect={() => setSelectedPlaceId('lereng-asri-main')}
                  onClear={() => setSelectedPlaceId(null)}
                />

                {places.map((place) => (
                  <NearbyPlaceMarker
                    key={place.id}
                    place={place}
                    isSelected={selectedPlaceId === place.id}
                    onSelect={() => setSelectedPlaceId(place.id)}
                    onClear={() => setSelectedPlaceId(null)}
                    onComputeRouteToPlace={handleRouteToPlace}
                  />
                ))}

                {encodedPolyline && (
                  <>
                    <AdvancedMarker
                      position={activeOriginCoords}
                      title={`Asal: ${activeOriginLabel}`}
                    >
                      <Pin
                        background="#D97706"
                        borderColor="#92400E"
                        glyphColor="#FFFFFF"
                        scale={1.05}
                      />
                    </AdvancedMarker>
                    <RoutePolylineOverlay
                      encodedPolyline={encodedPolyline}
                      originCoords={activeOriginCoords}
                      destinationCoords={routeDestination.coords}
                    />
                  </>
                )}
              </GoogleMap>
            </APIProvider>
          )}
        </div>
      </div>

      {/* Right: Places Around Ngargoyoso & Real-Time Route Calculator */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-[#D1DDD5] p-4 sm:p-5 flex flex-col">
        {/* Segmented Control Tabs */}
        <div
          role="tablist"
          aria-label="Fitur Peta Dunia Nyata"
          className="grid grid-cols-2 gap-1.5 p-1 bg-[#EEF3EF] rounded-xl mb-4"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'places'}
            onClick={() => setActiveTab('places')}
            className={`min-h-[44px] px-3 py-2 rounded-lg font-display text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'places'
                ? 'bg-white text-[#1E4D38] shadow-xs'
                : 'text-[#435248] hover:text-[#19221C]'
            }`}
          >
            Tempat Sekitar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'route'}
            onClick={() => setActiveTab('route')}
            className={`min-h-[44px] px-3 py-2 rounded-lg font-display text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'route'
                ? 'bg-white text-[#1E4D38] shadow-xs'
                : 'text-[#435248] hover:text-[#19221C]'
            }`}
          >
            Hitung Rute
          </button>
        </div>

        {activeTab === 'places' ? (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {PLACE_CATEGORIES.map((cat) => {
                const active = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    aria-pressed={active}
                    className={`min-h-[38px] px-3 py-1.5 rounded-lg font-display text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#1E4D38] text-white border-[#1E4D38]'
                        : 'bg-[#F8FAF8] text-[#19221C] border-[#D1DDD5] hover:bg-[#EEF3EF]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {placesLoading ? (
              <div className="space-y-3 py-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-20 rounded-xl bg-[#EEF3EF] animate-pulse"
                  />
                ))}
              </div>
            ) : placesError ? (
              <div className="rounded-xl bg-[#F8FAF8] border border-[#E4EDE6] p-4 text-sm text-[#435248]">
                <p>{placesError}</p>
                <button
                  type="button"
                  onClick={() => void fetchNearbyPlaces(categoryId)}
                  className="mt-3 min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E4D38] text-white font-display text-xs font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Coba Lagi</span>
                </button>
              </div>
            ) : places.length === 0 ? (
              <div className="rounded-xl bg-[#F8FAF8] border border-[#E4EDE6] p-4 text-sm text-[#435248]">
                Tidak ada lokasi pada kategori ini dalam radius 6 km dari Ngargoyoso.
              </div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto max-h-[360px] pr-1">
                {places.map((place) => {
                  const isSelected = selectedPlaceId === place.id;
                  const lat = place.location?.latitude;
                  const lng = place.location?.longitude;

                  return (
                    <div
                      key={place.id}
                      className={`rounded-xl border p-3.5 transition-colors ${
                        isSelected
                          ? 'bg-[#E8F5E9]/70 border-[#1E4D38]'
                          : 'bg-[#F8FAF8] border-[#E4EDE6] hover:bg-[#EEF3EF]/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-display text-sm font-bold text-[#19221C] truncate">
                            {place.displayName?.text || 'Lokasi Sekitar'}
                          </h4>
                          <p className="text-xs text-[#2E7D52] font-semibold mt-0.5">
                            {place.primaryTypeDisplayName?.text || 'Tempat Umum'}
                            {typeof place.currentOpeningHours?.openNow === 'boolean' && (
                              <>
                                <span aria-hidden="true" className="mx-1.5">·</span>
                                <span
                                  className={
                                    place.currentOpeningHours.openNow
                                      ? 'text-[#1E4D38]'
                                      : 'text-[#B45309]'
                                  }
                                >
                                  {place.currentOpeningHours.openNow ? 'Buka' : 'Tutup'}
                                </span>
                              </>
                            )}
                          </p>
                        </div>

                        {typeof place.rating === 'number' && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#19221C] tabular-nums shrink-0">
                            <Star
                              className="w-3.5 h-3.5 text-[#D97706] fill-[#D97706]"
                              aria-hidden="true"
                            />
                            {place.rating.toFixed(1)}
                          </span>
                        )}
                      </div>

                      {(place.shortFormattedAddress || place.formattedAddress) && (
                        <p className="text-xs text-[#435248] mt-1.5 line-clamp-2 leading-relaxed">
                          {place.shortFormattedAddress || place.formattedAddress}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {typeof lat === 'number' && typeof lng === 'number' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPlaceId(place.id);
                              setCameraTarget({lat, lng});
                            }}
                            className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white border border-[#D1DDD5] hover:bg-[#EEF3EF] text-xs font-display font-semibold text-[#19221C] transition-colors"
                          >
                            Lihat di Peta
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRouteToPlace(place)}
                          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#1E4D38] hover:bg-[#0E3823] text-xs font-display font-semibold text-white transition-colors"
                        >
                          Rute ke Sini
                        </button>
                        {place.googleMapsUri && (
                          <a
                            href={place.googleMapsUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#1E4D38] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Google Maps</span>
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-4">
            <div>
              <label
                htmlFor="route-origin-select"
                className="block font-display text-xs font-semibold text-[#19221C] mb-1.5"
              >
                Titik Keberangkatan
              </label>
              <div className="flex gap-2">
                <select
                  id="route-origin-select"
                  value={selectedOriginId}
                  onChange={(e) => setSelectedOriginId(e.target.value)}
                  className="flex-1 min-h-[44px] px-3 py-2 rounded-xl border border-[#D1DDD5] bg-[#F8FAF8] text-sm text-[#19221C] focus:border-[#1E4D38] focus:outline-none"
                >
                  {ORIGIN_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label}
                    </option>
                  ))}
                  {customGpsOrigin && (
                    <option value="gps">Lokasi GPS Anda Saat Ini</option>
                  )}
                </select>

                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  title="Gunakan lokasi GPS saat ini"
                  aria-label="Gunakan lokasi GPS saat ini"
                  className="min-w-[44px] min-h-[44px] px-3 rounded-xl border border-[#D1DDD5] bg-[#F8FAF8] hover:bg-[#EEF3EF] text-[#1E4D38] flex items-center justify-center transition-colors shrink-0"
                >
                  <LocateFixed className="w-4 h-4" />
                </button>
              </div>
              {gpsStatus && (
                <p className="text-xs text-[#435248] mt-1">{gpsStatus}</p>
              )}
            </div>

            <div className="rounded-xl bg-[#F8FAF8] border border-[#E4EDE6] p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-[#435248]">Tujuan Rute</p>
                  <p className="font-display font-bold text-[#19221C]">
                    {routeDestination.name}
                  </p>
                </div>
                {routeDestination.name !== VILLAGE_CONTACT.brandName && (
                  <button
                    type="button"
                    onClick={() =>
                      setRouteDestination({
                        name: VILLAGE_CONTACT.brandName,
                        coords: LERENG_ASRI_COORDS,
                      })
                    }
                    className="text-xs font-semibold text-[#1E4D38] hover:underline whitespace-nowrap"
                  >
                    Reset ke Desa
                  </button>
                )}
              </div>
            </div>

            <div>
              <span className="block font-display text-xs font-semibold text-[#19221C] mb-1.5">
                Moda Transportasi
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {id: 'DRIVE' as const, label: 'Mobil', Icon: Car},
                  {id: 'TWO_WHEELER' as const, label: 'Motor', Icon: Bike},
                  {id: 'WALK' as const, label: 'Jalan Kaki', Icon: Footprints},
                ].map(({id, label, Icon}) => {
                  const active = travelMode === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTravelMode(id)}
                      aria-pressed={active}
                      className={`min-h-[44px] px-2.5 py-2 rounded-xl border text-xs font-display font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                        active
                          ? 'bg-[#1E4D38] text-white border-[#1E4D38]'
                          : 'bg-[#F8FAF8] text-[#19221C] border-[#D1DDD5] hover:bg-[#EEF3EF]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

              {travelMode !== 'WALK' && (
                <label className="mt-2.5 inline-flex items-center gap-2 text-xs text-[#435248] cursor-pointer min-h-[32px]">
                  <input
                    type="checkbox"
                    checked={avoidTolls}
                    onChange={(e) => setAvoidTolls(e.target.checked)}
                    className="w-4 h-4 accent-[#1E4D38] rounded"
                  />
                  <span>Hindari jalan tol (jalur non-tol)</span>
                </label>
              )}
            </div>

            <button
              type="button"
              disabled={routeLoading}
              onClick={() =>
                void calculateRoute(
                  activeOriginCoords,
                  routeDestination.coords,
                  travelMode,
                  avoidTolls
                )
              }
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E4D38] hover:bg-[#0E3823] disabled:opacity-60 text-white font-display text-sm font-semibold transition-colors"
            >
              <Navigation className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{routeLoading ? 'Menghitung Rute...' : 'Tampilkan Rute di Peta'}</span>
            </button>

            {routeError && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                {routeError}
              </div>
            )}

            {computedRoute && (
              <div className="rounded-xl bg-[#E8F5E9] border border-[#D1DDD5] p-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#0E3823]">Estimasi Waktu Tempuh</p>
                    <p className="font-display text-lg font-bold text-[#1E4D38] tabular-nums">
                      {formatDurationId(computedRoute.duration)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#0E3823]">Jarak Total</p>
                    <p className="font-display text-lg font-bold text-[#19221C] tabular-nums">
                      {formatDistanceId(computedRoute.distanceMeters)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#D1DDD5]">
                  {routeSteps.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowSteps((prev) => !prev)}
                      className="inline-flex items-center gap-1 text-xs font-display font-semibold text-[#0E3823] hover:underline"
                    >
                      <span>{showSteps ? 'Sembunyikan Petunjuk' : `Lihat ${routeSteps.length} Langkah Rute`}</span>
                      {showSteps ? (
                        <ChevronUp className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  )}

                  <a
                    href={googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-display font-semibold text-[#1E4D38] hover:underline"
                  >
                    <span>Navigasi Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>

                {showSteps && routeSteps.length > 0 && (
                  <ol className="space-y-2 max-h-44 overflow-y-auto pt-2 border-t border-[#D1DDD5] text-xs text-[#19221C]">
                    {routeSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start justify-between gap-2">
                        <span>
                          <strong className="tabular-nums mr-1">{idx + 1}.</strong>
                          {step.navigationInstruction?.instructions || 'Lanjutkan perjalanan'}
                        </span>
                        <span className="text-[#435248] tabular-nums whitespace-nowrap shrink-0">
                          {formatDistanceId(step.distanceMeters)}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
