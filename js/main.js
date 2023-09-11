/* NTS 
 * In no universe would you ever have come through a PR. By the way, that applies to many parts of this project. 
 * And if you ever have a lot of time, be so good as to clean up here and everywhere else.
 */

// Text animation
// Buchstaben auswählen
const letters = document.querySelectorAll('.letter');

// Funktion, um die Buchstaben nacheinander anzuzeigen
function showLetters(index) {
  if (index < letters.length) {
    letters[index].classList.add('show');
    setTimeout(() => {
      showLetters(index + 1);
    }, 100); // 1000 Millisekunden (1 Sekunde) Verzögerung zwischen den Buchstaben
  }
}

// Animation starten
showLetters(0);


/** Internal helper. Reasons. 
     * @type {boolean}*/
let hasStarted = false;

let audioPlayer = new AudioPlayer();
const dpr = window.devicePixelRatio || 1;
let refercenSystem = new Rectangle(window.innerWidth * dpr, window.innerHeight * dpr)

let configCanvas = new ConfigParticleCanvas();
configCanvas.DomCanvas = document.getElementById('canvasParticle');
configCanvas.Dpr = window.devicePixelRatio || 1;
configCanvas.ParticleCount = 45;
configCanvas.GlobalFillStyle = 'rgba(1,1,1,0.15)';
configCanvas.TrailingMousePositionAdaption = 0.03;
configCanvas.MaximumLinkDistances = 450 * dpr;
configCanvas.MaximumNumberOfLines = 3;
configCanvas.DefaultMaximumMouseMoveOrbit = 100;
configCanvas.FactorForUsingLogisticColorFunction = 0.2;

// The default values for the configuration of the particles can be found in the particleParameter class.
let particleConfig = new ConfigOrbitalParticle();
particleConfig.Speed = new particleParameter(0.004, 0.01, 0.00001, 0.004);
particleConfig.Size = new particleParameter(0.5, 3, 0.003, 0.8);
particleConfig.OrbitX = new particleParameter(10, 300, 0.4, 1);
particleConfig.OrbitY = new particleParameter( 10,300, 0.4, 1);
particleConfig.Theta = new particleParameter( 0,359.9, 0.1, 0);
particleConfig.OrbitalCenterAdaption = 0.03;
particleConfig.Color = new Color(255, 255, 255);

let particleCanvas = new CanvasForParticle(configCanvas, particleConfig, refercenSystem);

let configRectControl = new ConfigRectangleControl();
configRectControl.TrailingMousePositionAdaption = 0.03;
let rectControl = new RectangleControl(configRectControl, refercenSystem, particleCanvas, audioPlayer);

// Config
particleCanvas.DoColorUpdates = true;
document.getElementById("colours").checked = true;

/** Click on stop button */
function PressStop() {
    audioPlayer.Stop();
    rectControl.Reset();
    particleCanvas.ClearScatterEvents();
    hasStarted = false;
}

/** Click on PLay button */
function PressPlay() {
    if (!hasStarted) {
        rectControl.Start();
        audioPlayer.Play();
        hasStarted = true;
    }

    // fade in the title and my name
    const header = document.getElementById('header');
    header.classList.add('fadeInAnimation');
}

/** Click event mouse tracking */
function PressMouseTracking() {
    var checkBox = document.getElementById("mouseTracking");
    rectControl.SetMouseTracking(checkBox.checked);
}

/** Click event for color adaption */
function PressColours() {
    var checkBox = document.getElementById("colours");
    particleCanvas.DoColorUpdates = checkBox.checked;
}

/** Click event full screen */
function PressFullScreen() {
    let elem = document.body;
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    particleCanvas.UpdateDimensions();
}

/** Click event for hiding all elements. Fuck you, if you do this :-) */
function PressHideNjal() {
    let footer = document.getElementById("footer");
    let header = document.getElementById("header");
    let containerLeft = document.getElementById("containerLeft");
    let containerRight = document.getElementById("containerRight");
    
    if (footer.style.display == '') {
        footer.style.display = 'none';
        header.style.display = 'none';
        containerLeft.style.display = 'none';
        containerRight.style.display = 'none';
    }
    else {
        footer.style.display = '';
        header.style.display = '';
        containerLeft.style.display = '';
        containerRight.style.display = '';
    }
    
}