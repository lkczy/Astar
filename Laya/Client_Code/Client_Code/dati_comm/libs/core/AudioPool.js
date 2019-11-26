import AudioSource from "./AudioSource"
let audioSources = {} 

function GetAudio(url)
{
  var audio = audioSources[url]
  if (audio) 
  { 
    audio.release()
  }

  audio = new AudioSource(
    {
      src: url
    }
  )
  audioSources[url] = audio

  return audio
}

function PlayAudio(url)
{
  var audio = GetAudio(url)
  audio.replay()
}

function StopAudio(url) {
  var audio = GetAudio(url)
  if (audio==null) return
  audio.stop()
}

export { PlayAudio, StopAudio, GetAudio}