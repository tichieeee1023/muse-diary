# STEP 7-B1A — Scene Atmosphere Pass

This patch intentionally touches only lightweight visual atmosphere.

## Added ambient effects
- rain
- snow
- dust
- sparkle
- petals
- autumn leaves
- mist
- bokeh

## Scene mapping
- Rain: rain + light mist
- Snow: snow + light mist
- Night: soft bokeh, with restrained sparkle on rooftop/night market
- Aquarium: water-like sparkle + blue bokeh
- Old street at night: bokeh/mist atmosphere
- Day/interior fallback: subtle dust

## Seasonal event mapping
- Spring: moving petals + soft bokeh
- Summer: bokeh + small sparkles
- Autumn: drifting leaves + dust motes
- Winter: snow + mist

## Mobile/performance rules
- Canvas DPR capped lower on small screens.
- Particle counts reduced on screens <= 520px.
- Animation paint rate is capped around 30fps.
- At most two lightweight canvases are layered per hero/banner.
- Pauses while the document is hidden.
- All ambient animation is removed for `prefers-reduced-motion: reduce`.

No title/reset/day-transition logic is changed in this step.
