import L from 'leaflet'

export const southWest = L.latLng(0, 0)
export const northEast = L.latLng(1160, 2048)
export const bounds = L.latLngBounds(southWest, northEast)

export const centerLat = (southWest.lat + northEast.lat) / 2
export const centerLng = (southWest.lng + northEast.lng) / 2

const containerWidth = 200 // Ancho del contenedor (ajustar según tu caso)
const containerHeight = 200 // Alto del contenedor (ajustar según tu caso)

const offsetX = (northEast.lng - southWest.lng) * (containerWidth / (2 * 2048)) // Ajustar el 2048 si es diferente
const offsetY = (northEast.lat - southWest.lat) * (containerHeight / (2 * 1160)) // Ajustar el 1160 si es diferente

export const maxBounds = L.latLngBounds(
  [southWest.lat - offsetY, southWest.lng - offsetX],
  [northEast.lat + offsetY, northEast.lng + offsetX]
)
