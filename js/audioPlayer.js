/* Ouch --> Clean up man */
Audio_Whistle = document.getElementById("whistle");
Audio_Whistle.volume = 0.7;
Audio_A = document.getElementById("audio_a");
Audio_B = document.getElementById("audio_b");
Audio_C = document.getElementById("audio_c");
Audio_D = document.getElementById("audio_d");
Audio_Beat = document.getElementById("beat");

function InitiCompleted() {
    audioPlayer.PlayImpact();  
    Audio_Whistle.pause();
    Audio_Whistle.currentTime = 0;

}

/**
 * Class for playing four audio streams, one per corner of the browser window.
 * The volume of the audio stream depends on the mouse position. 
 * I.g. stream A should be loudest, when mouse pointer is near corner A of the rectangle (top left).
 */
class AudioPlayer {
    #volumeAdjust = 1;
    #volumeArray = [0, 0, 0, 0];
    #intervalId = -1;

    constructor() {
        this.#internSetVolume(Audio_Beat, 1);
        document.addEventListener('initIsOverEvent', InitiCompleted);
    }



    /**
     * Internal function to set the volume of the given audio stream.
     * @param {Audio} audio The audio stream to set the volume.
     * @param {number} value The float value [0.0, 1.0] of the volume.
     */
    #internSetVolume(audio, value) {
        if (value > 1) value = 1;
        audio.volume = value;
    }

    /**
     * This audio player uses for audio streams, one for each corner of the rectangle represented by the browser window.
     * This function provides setting the volume of every corner separatly. 
     * I.g. stream A should be loudest, when mouse pointer is near corner A of the rectangle (top left).
     * @param {number[]} array Array within float values to set the volume of the four audio streams. 
     */
    SetVolume(array) {
        for (let i = 0; i < 4; i++) {
            this.#volumeArray[i] = array[i];
        }
        
        this.#setVolumeFromArray(this.#volumeAdjust);
    }

    #setVolumeFromArray(factor)
    {
        this.#internSetVolume(Audio_A, this.#volumeArray[0]*factor);
        this.#internSetVolume(Audio_B, this.#volumeArray[1]*factor);
        this.#internSetVolume(Audio_C, this.#volumeArray[2]*factor);
        this.#internSetVolume(Audio_D, this.#volumeArray[3]*factor);
    }

    /**
     * Play the four audio streams. 
     */
    Play() {
        Audio_Beat.pause();
        Audio_Beat.currentTime = 0;
        Audio_Whistle.play();

        Audio_A.play();
        Audio_B.play();
        Audio_C.play();
        Audio_D.play();
    }

    /**
    * Pause the four audio streams. 
    */
    Stop() {
        Audio_A.pause();
        Audio_B.pause();
        Audio_C.pause();
        Audio_D.pause();

        Audio_A.currentTime = 0;
        Audio_B.currentTime = 0;
        Audio_C.currentTime = 0;
        Audio_D.currentTime = 0;
        
        Audio_Whistle.pause();
        Audio_Whistle.currentTime=0;
    }

    /* 
    The following code is an incredibly bumbling attempt to recreate a compressor with sidechain. 
    #updateVolume reduces the volume of the track by 50% and then starts an interval 
    (or more precisely a loop that runs every 100ms) to increase the volume of the track back to 100%. 
    This is what happens here:
        this.#volumeAdjust = this.#volumeAdjust * 1.08;
    All this is done because otherwise the very soft sound effect "beat" cannot assert itself.
    */
    #updateVolume() {
        if (this.#intervalId != -1) {
            clearInterval(this.#intervalId);
            this.#intervalId = -1;
        }

        this.#volumeAdjust = 0.5;
        this.#intervalId = setInterval( () => {
            this.#updateVolumeAdjust();
        }, 100);
    }

    #updateVolumeAdjust() {
        if (this.#volumeAdjust < 1) {
            this.#volumeAdjust = this.#volumeAdjust * 1.08;
          if (this.#volumeAdjust >= 0.999) {
            this.#volumeAdjust = 1;
            clearInterval(this.#intervalId);
            this.#intervalId = -1;
          }
        }
        this.#setVolumeFromArray(this.#volumeAdjust);
    }

    PlayImpact() {
        if (!Audio_A.paused)
        {
            this.#updateVolume();
            this.#internSetVolume(Audio_Beat, 0);
            Audio_Beat.pause();
            Audio_Beat.currentTime=0;
            this.#internSetVolume(Audio_Beat, 1);
            Audio_Beat.play();
        }
    }
}