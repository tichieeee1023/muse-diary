import { useEffect, useMemo, useState } from 'react'
import type { TimeOfDay, Weather } from '../types/game'
import { getSceneBackgroundCandidates, type StoryEpisodeKind } from '../data/backgroundAssets'
import { PlaceIcon } from './PlaceIcon'
import { AmbientCanvas } from './AmbientCanvas'

interface SceneBannerProps {
  placeId: string
  placeName: string
  timeOfDay: TimeOfDay
  weather: Weather
  routeId?: string
  routeTitle?: string
  characterId?: string
  episodeKind?: StoryEpisodeKind
}

export function SceneBanner({
  placeId,
  placeName,
  timeOfDay,
  weather,
  routeId,
  routeTitle,
  characterId,
  episodeKind,
}: SceneBannerProps) {
  const candidates = useMemo(() => getSceneBackgroundCandidates({
    placeId,
    routeId,
    timeOfDay,
    weather,
    characterId,
    episodeKind,
  }), [placeId, routeId, timeOfDay, weather, characterId, episodeKind])

  const [candidateIndex, setCandidateIndex] = useState(0)
  const [imageUnavailable, setImageUnavailable] = useState(false)

  useEffect(() => {
    setCandidateIndex(0)
    setImageUnavailable(false)
  }, [candidates])

  const activeAsset = candidates[candidateIndex] ?? ''
  const atmosphere = activeAsset.includes('rain') ? 'rain' : activeAsset.includes('snow') || activeAsset.includes('winter') ? 'snow' : activeAsset.includes('night') ? 'sparkle' : 'dust'

  const handleImageError = () => {
    if (candidateIndex < candidates.length - 1) setCandidateIndex((index) => index + 1)
    else setImageUnavailable(true)
  }

  return (
    <figure className={`scene-banner scene-${placeId}`}>
      {!imageUnavailable && (
        <img
          key={activeAsset}
          src={activeAsset}
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
