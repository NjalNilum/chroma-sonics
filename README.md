# chroma-sonics

https://njalnilum.github.io/chroma-sonics/

Introducing **chroma-sonics: interactive particles and spatial sound**. This endeavour brings together the enchanting dance of particles and the mesmerising power of sound in a harmonious symphony of interaction. As the particles traverse the realm, their vibrant hues change gracefully according to their surroundings, captivating the viewer's senses. Activate MouseTracking to watch the particles gracefully orbit the cursor, creating a captivating ballet of colour.

But the experience goes beyond sight. Immerse yourself in a dynamic auditory journey where the music evolves in response to your exploration. Four distinct trunks intertwine, their crescendos and decrescendos orchestrated by the cursor's placement. Your every movement creates an intricate sonic tapestry, forging a profound connection between your visual engagement and sonic experience.

Welcome to 'chroma-sonics', an artistic expedition where the visual and auditory realms intertwine, offering a multi-sensory journey that is as captivating as it is immersive.

*I would certainly have thought of a text with so much pathos myself, but never to describe my own work. That would be too pretentious and intrusive. But hey, if the text was written by a good acquaintance, that's fine. So thank you ChatGPT;-)*

### Usage
- click [here](https://njalnilum.github.io/chroma-sonics/)
- **press play button**
- activate *mouse tracking*
- press mouse left
- move mouse
- or deactivate *mouse tracking* and just relax in *full screen*


## Documentation

### audioPlayer.js
The code initialises several audio elements representing different sounds and sets their initial volumes. It also defines an event handler function called InitiCompleted.

It defines a class called AudioPlayer, which manages four audio streams, one for each corner of a web browser window. The volume of each stream can be adjusted based on the position of the mouse. The aim is to make the audio from each corner louder when the mouse pointer is near that corner.

The AudioPlayer class contains methods for adjusting volume, playing and pausing audio streams, and applying a compressor-like effect. The compressor-like effect is implemented using the #updateVolume and #updateVolumeAdjust methods. This effect reduces the volume of a track by 50% and then gradually increases it back to 100% over a short period of time (creating a pumping or sidechain-like effect). This effect is applied to the beat audio track.

The PlayImpact method is used to trigger the compressor-like effect when certain conditions are met (specifically, when the Audio_A track is not paused).

In summary, this code sets up an audio player for a web application, manages audio streams for different corners of the window, and implements a compressor-like effect to dynamically manipulate the volume of one of the audio tracks.

### bezier.js
The Bezier class is designed to handle Bezier curves used in graphical applications. It provides functionality for defining control points and updating the curve for smooth transitions. The class contains several private properties, including the start and end points of the curve, control points, and parameters for adjusting the shape of the curve.

#### Key components:

* _Start_ and _End_: These are the start and end points of the Bezier curve.
* _cp1_ and _cp2_: These are absolute control points used to define the shape of the Bezier curve.
* _cubicCp1_ and _cubicCp_: These are cubic control points that can adapt to new positions for smoother transitions.
* _newCubicCp1_ and _newCubicCp2_: These are new positions for the cubic control points.
* _Adaption_ and _VariableAdaption_: These parameters control the amount and speed of the control point adaptation.

#### Methods

_Update(start, end)_: This method updates the Bezier curve with new start and end points. It also adjusts the control points to create smooth transitions in the curve.

_UpdateAbsoluteControlPoints()_: This private method calculates and updates the absolute control points based on the start, end and cubic control points.

_GetStart(), GetEnd(), GetCp1(), GetCp2()_: These methods allow you to retrieve the start point, end point and control points.

_General functionality_: The Bezier class serves as a tool for managing and adapting Bezier curves in a graphical context, allowing smooth transitions between different curve shapes.

In summary, this code defines a Bezier class with methods and properties for handling and adapting Bezier curves, making it useful for various graphical applications.

### canvasForParticle

Certainly, I'll explain what the `CanvasForParticle` class does and the significance of its main methods without going into specific implementation details:

The `CanvasForParticle` class is responsible for creating and controlling an HTML canvas for particle visualization. Here's what it does:

1. **Constructor (`constructor(config, particleConfig, referenceRect)`)**: The constructor initializes an instance of the `CanvasForParticle` class. It takes three key parameters:
   - `config`: An object of the `ConfigParticleCanvas` class that defines configuration settings for the canvas.
   - `particleConfig`: The original configuration settings for the particles.
   - `referenceRect`: A rectangle specifying the dimensions of the area to be drawn on the canvas.

2. **`ResetParticles()`**: This method resets the particles to their original positions. It's typically called to initiate a reordering of particles.

3. **`UpdateDimensions(width, height)`**: This method updates the dimensions of the canvas to ensure it can match the current size of the browser window.

4. **`ClearScatterEvents()`**: It removes all ongoing particle scatter events. This can be useful, for example, to pause an animation.

5. **`UpdateOrbit(isSmallOrbit)`**: This method is used to update the orbits of the particles. The `isSmallOrbit` parameter controls whether the particles should have a small or large orbit around the mouse pointer.

6. **`UpdatePerIteration()`**: This method is called to clear the canvas before each new frame. It ensures that the previous positions of particles disappear, creating the illusion of motion.

7. **`DrawCenter()` and `DrawParticles()`**: These two methods are responsible for drawing particles on the canvas. `DrawCenter()` draws the center point when a specific mouse movement is detected, and `DrawParticles()` draws the particles themselves. This method is called in each frame to update and draw the particles.

8. **`DrawScatters()`**: This method draws particle scatter events on the canvas. These events occur when the user clicks on the canvas, generating additional motion and lines.

9. **`setUpParticles()`**: This method initializes the particles based on the configuration settings. It sets the initial positions and properties of the particles.

10. **`#doClostestStuff()`**: This private method calculates the closest neighbors of each particle and stores this information. It determines which other particles are at a certain distance from a given particle.

11. **`#updateOpacityOfParticle(particle)`**: A private method that updates the opacity of particles based on specific conditions. This affects how particles react to user interactions.

In summary, the `CanvasForParticle` class is responsible for managing the animation and visualization of particles on a canvas, enabling various effects and interactions based on configuration settings. It also controls how particles interact with each other and respond to user actions.

### color.js
This code contains a set of JavaScript functions and a Color class for working with colors. Here's a concise explanation of what each part of the code does:

1. `rgbToHsv` Function:
   - Converts an RGB color value to HSV (Hue, Saturation, Value) color space.
   - Takes three arguments: `r` (red), `g` (green), and `b` (blue) in the range [0, 255].
   - Returns an array `[h, s, v]` representing the HSV color values in the range [0, 1].

2. `hsvToRgb` Function:
   - Converts an HSV color value back to RGB color space.
   - Takes three arguments: `h` (hue), `s` (saturation), and `v` (value) in the range [0, 1].
   - Returns an array `[r, g, b]` representing the RGB color values in the range [0, 255].

3. `getColor` Function:
   - Calculates a resulting color based on proximity values to corner points and corner colors.
   - `cornerColors` is an array of colors within the 4 colors of the rectangle.
   - `proximityArray` is an array of proximities to each corner of the rectangle.
   - `useLogisticGrowthInPercent` is a value between 0 and 1 for using a logistic growth function.
   - Returns a new Color object representing the calculated color.

4. `getWeightetColor` Function:
   - Calculates and returns a new weighted color by multiplying each component of a color by a weight.

5. `Color` Class:
   - Represents a color with `R` (red), `G` (green), `B` (blue), and `A` (alpha) properties.
   - Provides methods for working with color values and formats, such as `Get_Rgb_String`, `Get_Rgba_String`, and more.
   - Includes methods for resetting the color, creating a deep copy, setting saturation to the maximum, and generating a randomized color.

This code is used for color conversion and manipulation, making it useful for tasks involving color processing in JavaScript.


### main.js

This JavaScript code consists of a series of functions and configurations used for various purposes. Here's a brief explanation of each part:

1. **Text Animation**: This section selects HTML elements with the class "letter" and defines a function (`showLetters`) to display these letters one by one with a slight delay, creating a text animation effect.

2. **Internal Helper Variables**:
   - `hasStarted`: A boolean variable used to track whether a certain action has started.
   - `audioPlayer`: An instance of an AudioPlayer, which is presumably used for audio playback.
   - `dpr`: A variable to store the device pixel ratio.
   - `refercenSystem`: An instance of a Rectangle representing a reference system.

3. **Canvas Configuration**:
   - Several configurations related to a particle canvas are set using `configCanvas` and `particleConfig`.
   - These configurations define settings such as particle count, color, speed, and more for a particle-based animation.

4. **Canvas and RectangleControl Instances**:
   - `particleCanvas`: An instance of a CanvasForParticle, presumably used for rendering particles on the canvas.
   - `rectControl`: An instance of RectangleControl, used for controlling the particles' behavior.

5. **Event Handling Functions**:
   - Several functions handle events such as clicking on buttons or checkboxes. These functions control actions like starting/stopping animations, changing settings, and toggling fullscreen mode.

6. **Commented Messages**:
   - There are some comments throughout the code, some of which appear to be internal notes or reminders, and others are explanatory comments for future developers.

Overall, this code seems to be part of a web-based animation or interactive application that involves text animations, particle animations, audio playback, and user interface interactions. It's designed to create visually appealing and interactive content on a web page.

### math.js

This JavaScript code defines several constants, classes, and functions related to point calculations, rectangles, and other mathematical operations. Here's a breakdown of each part:

1. **Constants**:
   - `PI2`: Represents 2 times the value of π (pi).
   - `HALF_PI`: Represents half of π (pi).
   - `EPS`: A very small epsilon value, likely used for numerical comparisons.

2. **Point Class**:
   - Defines a `Point` class for working with 2D points, typically used for position calculations.
   - It has methods for copying, adding, multiplying, finding differences, calculating distances, checking equality, and more.

3. **Rectangle Class**:
   - Defines a `Rectangle` class representing a rectangle in a 2D space.
   - It stores information about the rectangle's dimensions and corner points.
   - Provides methods to update and retrieve information about the rectangle.

4. **Proximity Class**:
   - Defines a `Proximity` class used for calculating the proximity of a point to the corners of a rectangle.
   - It normalizes and stores the proximity values for each corner point.
   - Provides methods to update and retrieve proximity values.

5. **Helper Functions**:
   - `getRandom(min, max)`: Generates a random floating-point number within the specified range.
   - `changeSignRandom()`: Returns either 1 or -1 randomly.
   - `Rotate(center, pointToRotate, angle)`: Rotates a point around a center point by a given angle.
   - `getCornerPointValue(width, height, cornerPoint, pointOfInterest)`: Calculates the influence of a corner point on a point of interest within a rectangle.
   - `getCornerpointMaxLine(width, height, cornerPoint, pointOfInterest)`: Calculates the length of the distance resulting from a corner point, point of interest, and the edge of the rectangle.
   - `getNormalizedGravity(cornerPoint, pointOfInterest, maxLength)`: Calculates the normalized gravity of a corner point on a point of interest.
   - `makeLogisticGrowthFunction(originalValue, usageOfThisInPercent)`: Calculates a y-value on a growth curve given an original value and a percentage of the new value.

This code appears to be a utility library for handling geometric calculations, particularly involving rectangles and points, and includes some mathematical functions for various purposes.


### orbitalParticle.js

The provided code defines two classes, `ConfigOrbitalParticle` and `OrbitalParticle`, which appear to be part of a particle animation system. These classes handle the configuration and behavior of individual particles. Below is a summary of the code:

1. `ConfigOrbitalParticle` Class:
   - This class is used to configure the default values for particles.

   Properties:
   - `Speed`: Angular velocity of a particle.
   - `Size`: Particle size in pixels.
   - `OrbitX`: X orbit of particle in pixels.
   - `OrbitY`: Y orbit of particle in pixels.
   - `Theta`: Rotation of the orbital ellipse of a particle.
   - `OrbitalCenterAdaption`: Adaption factor for a new orbital center position.
   - `Color`: Default color for particles.

2. `OrbitalParticle` Class:
   - This class is responsible for generating and updating individual particles.

   Properties:
   - Various properties to store particle attributes such as position, size, color, and orbital parameters.
   - Maps (`Closest`, `Opacities`, `Lines`) to manage information about nearby particles.
   - `#config`: Configuration object for the particle.
   - `#index`: Index of the particle in an array.
   - `#referenceSystem`: The reference system in which the particle moves.
   - `#color`: Color of the particle.
   - `#proximity`: Proximity of the particle to the corners of the rectangle.
   - `#position`: True position of the particle in the reference frame.
   - `#orbitalCenter`: Orbital center around which the particle moves.
   - `#angle`: Mathematical angular position of the particle.
   - `#speed`: Angular velocity of the particle.
   - `#size`: Size of the particle in pixels.
   - `#orbitX` and `#orbitY`: Orbital parameters for the X and Y axes.
   - `#theta`: Rotation of the ellipse.
   - `#diretionOfRotation`: Direction of rotation of the particle.
   - `#init`: A flag indicating whether the particle is in the transient process.

   Methods:
   - `GetPosition()`: Returns the position of the particle.
   - `GetSize()`: Returns the current size of the particle.
   - `GetColorRgbaRandomOpacity()`: Returns the particle color with a random opacity.
   - `GetColorRgb()`: Returns the RGB color of the particle.
   - `GetColorRgba()`: Returns the RGBA color of the particle.
   - `SetColor(newColor)`: Sets a new color for the particle.
   - `GetAlpha()`: Returns the alpha value of the particle color.
   - `SetAlpha(alpha)`: Sets the alpha value of the particle color.
   - `GetIndex()`: Returns the index of the particle in an array.
   - `IsInit()`: Returns `true` if the particle is in the transient process.
   - `UpdateOrbit(xmaX, maxY)`: Updates the maximum values of orbital range.
   - `UpdateParameters(newOrbitalCenter)`: Updates the parameters of the particle.
   - `UpdateColor(cornerColors, factorForUsingLogisticColorFunction)`: Updates the color of the particle based on its position.
   - `UpdateAlpha(alpha)`: Updates the alpha value of the particle color.

Overall, this code defines a flexible system for creating and managing particles with various properties for animation or simulation purposes.

_Für die tapferen Seelen, die bis hierher durchgehalten haben, tut es mir wirklich Leid: es hat sich vermutlich nicht gelohnt. Allen tl;dr-lern sei gratuliert: es gibt auf dieser Welt kaum noch Dinge, für die es sich lohnt, mehr als ein paar Minuten seiner Lebenszeit zu opfern. Und ganz bestimmt nicht hierfür. Ich habs nur wegen der Proximity-Berechnung und der Koordinatentransformation gemacht und weil ich nirgends was gefunden hab, was mir zusagt. Und dann haben wir noch die Bewegungsparameter für jedes einzelne Partikel. Die sind beinahe zufällig, also dieses richtige "zufällig". Ach ja, und die Idee für den ganzen Mist habe ich irgendwo auf CodePen aufgegabelt. Um ehrlich zu sein, habe ich längst vergessen, wonach ich eigentlich gesucht habe. Das Beispiel auf CodePen war sowieso voller mathematischer Fehler, aber hier sollte hoffentlich nicht allzu viel schiefgegangen sein. Ein bisschen aber schon._