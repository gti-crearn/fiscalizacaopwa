export function obterLocalizacao(options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }) {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        return reject(new Error('Geolocalização não suportada neste dispositivo.'))
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          resolve({ lat: latitude, lng: longitude })
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Permissão de localização negada.'))
              break
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Posição indisponível.'))
              break
            case error.TIMEOUT:
              reject(new Error('Tempo excedido ao obter localização.'))
              break
            default:
              reject(new Error('Erro desconhecido ao obter localização.'))
              break
          }
        },
        options
      )
    })
  }
  