import { useMemo, useState } from 'react'
import type { TimeOfDay, Weather } from '../types/game'
import { PlaceIcon } from './PlaceIcon'
import { AmbientCanvas } from './AmbientCanvas'

interface SceneBannerProps {
  placeId: string
  placeName: string
  timeOfDay: TimeOfDay
  weather: Weather
  routeId?: string
  routeTitle?: string
}

const slugByPlace: Record<string, string> = {
  subway: 'subway',
  library: 'library',
  bookstore: 'bookstore',
  convenience: 'convenience',
  aquarium: 'aquarium',
  rooftop: 'rooftop',
  'night-market': 'night-market',
  cafe: 'cafe',
  mall: 'mall',
  riverside: 'riverside',
  museum: 'museum',
  'old-street': 'old-street',
  bar: 'bar',
}

const routeAssetByKey: Record<string, string> = {
  'library:history-floor': 'history.webp',
  'bookstore:backroom': 'backroom.webp',
  'mall:popup-floor': 'exhibition.webp',
  'museum:special-exhibit': 'exhibition.webp',
  'bar:back-seat': 'seating.webp',
}

export function SceneBanner({ placeId, placeName, timeOfDay, weather, routeId, routeTitle }: SceneBannerProps) {
  const candidates = useMemo(() => {
    const slug = slugByPlace[placeId] ?? placeId
    const list: string[] = []
    const push = (filename: string) => {
      const path = `/assets/backgrounds/${slug}/${filename}`
      if (!list.includes(path)) list.push(path)
    }

    if (routeId) {
      const routeAsset = routeAssetByKey[`${placeId}:${routeId}`]
      if (routeAsset) push(routeAsset)
    }

    if (placeId === 'convenience') push('main.webp')
    if (placeId === 'aquarium') push('main.webp')
    if (placeId === 'night-market') push('night.webp')
    if (placeId === 'old-street' && weather === '비' && timeOfDay === '밤') push('night-rain.webp')
    if (placeId === 'riverside' && weather === '흐림') push('cloudy.webp')
    if (weather === '비') push('rain.webp')
    if (weather === '눈') push('snow.webp')
    push(timeOfDay === '밤' ? 'night.webp' : 'day.webp')
    push('main.webp')

    return list
  }, [placeId, routeId, timeOfDay, weather])

  const [candidateIndex, setCandidateIndex] = useState(0)
  const [imageUnavailable, setImageUnavailable] = useState(false)
  const activeAsset = candidates[candidateIndex] ?? ''
  const atmosphere = activeAsset.includes('rain') ? 'rain' : activeAsset.includes('snow') ? 'snow' : activeAsset.includes('night') ? 'sparkle' : 'dust'

  const handleImageError = () => {
    if (candidateIndex < candidates.length - 1) setCandidateIndex((index) => index + 1)
    else setImageUnavailable(true)
  }

  return (
    <figure className={`scene-banner scene-${placeId}`}>
      {!imageUnavailable && (
        <img
          key={candidates[candidateIndex]}
          src={candidates[candidateIndex]}
          alt=""
          onError={handleImageError}
        />
      )}
      <div className="scene-banner-fallback" aria-hidden={!imageUnavailable} />
      <AmbientCanvas effect={atmosphere} density={atmosphere === 'rain' ? 'medium' : 'low'} />
      <figcaption>
        <span className="scene-place-icon"><PlaceIcon placeId={placeId} size={19} /></span>
        <span className="scene-caption-copy">
          <strong>{placeName}</strong>
          {routeTitle && <small>{routeTitle}</small>}
        </span>
        <span className="scene-weather">{weather} · {timeOfDay}</span>
      </figcaption>
    </figure>
  )
}
