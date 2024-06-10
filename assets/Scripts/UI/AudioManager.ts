import {_decorator, AudioClip, AudioSource, Component} from 'cc'
import EventManager from 'db://assets/Runtime/EventManager'
import {EVENT_ENUM} from 'db://assets/Enums'

const {ccclass, property} = _decorator

interface IAudioMap {
  [name: string]: AudioClip
}


@ccclass('AudioManager')
export class AudioManager extends Component {
  @property([AudioClip])
  public audioList: AudioClip[] = []

  private _dict: IAudioMap = {}
  private _audioSource: AudioSource = null

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.PLAY_AUDIO, this.play, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAY_AUDIO, this.play)
  }


  start() {
    this.audioList.forEach(item => {
      this._dict[item.name] = item
    })

    this._audioSource = this.node.getComponent(AudioSource)
  }


  public play(name: string) {
    const audioClip = this._dict[name]
    if (audioClip) {
      this._audioSource.playOneShot(audioClip)
    }
  }

}


