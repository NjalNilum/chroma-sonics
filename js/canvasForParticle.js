/**
 * Configuration object for configuring the appearence and behaviior of particles. 
 */
class ConfigParticleCanvas {
    /** Dom element of type canvas to paint on particles. 
     * @type {Canvas}
    */
    DomCanvas = document.getElementById('canvasParticle');

    /** Device pixel ratio 
     * @type {number}
     */
    Dpr = window.devicePixelRatio || 1;

    /** 
     * Count of particles to paint. 
     * #default: 45
     * @type {number}
     */
    ParticleCount = 45;

    /** 
     * This value defines the backkground of the canvas. 
     * #default: 'rgba(1,1,1,0.15)'
     * 
     * The exciting thing about it is the alpha value. It indicates the opacity with which the canvas is redrawn with each loop pass. 
     * A low alpha value means that objects that have been drawn once remain visible for longer. 
     * In our case of the moving particles, it looks to the user as if the particles leave a trace on the canvas as they move through it.
     * @type {string}
     */
    GlobalFillStyle = 'rgba(1,1,1,0.15)';

    /**
     * Maximum length of connection lines between particles in pixels.
     * defaul: 400 * dpr
     * @type {number}
     */
    MaximumLinkDistances = 400 * this.Dpr;

    /**
     * This is probably the maximum number of lines a particle can have to other particles.
     * @type {number}
     */
    MaximumNumberOfLines = 4;

    /**
     * As soon as there is interaction by the user, all particles should move around a maximum orbit around the mouse cursor. 
     * This value defines this maximum orbit. At certain times, the orbit should be maximised, especially when the user has fallen asleep. 
     * This usually makes the orbit larger and results in a fuller image.
     * #default: 300;
     * @type {number}
     */
    DefaultMaximumMouseMoveOrbit = 200;

    /**
     * 1-> Colour calculation with logistic growth function. Means color changes faster from A corner to B corner for example.
     * 0-> colour calculation with normalised, linear distance function. Means a smooth transition from color in A corner to color in B corner.
     * 0.4 is a good value for a balanced colour image
         * @type {number}
     */
    FactorForUsingLogisticColorFunction = 0.4;

    /**
     * The corner colors of the canvas.
     * Corner A = [0, 190, 40];   // left top
     * Corner B = [255, 190, 0];  // right top
     * Corner C = [255, 10, 10];  // right bottom
     * Corner D = [10, 10, 255];  // left bottom
     * @type {Color[]}
     */
    Colors = [
        new Color(0, 190, 40),
        new Color(255, 190, 0),
        new Color(255, 10, 10),
        new Color(10, 10, 255)];
}

/**
 * Canvas class for painting the particles.
 */
class CanvasForParticle {

    /** 
     * These are the configuration parameters of the Canvas.
     * @type {ConfigParticleCanvas}
     */
    #config;

    /**
     * These are the original configuration parameters of the particles.
     * @type {configOrbitalParticle}
     */
    #originalParticleConfig;

    /** Dimensions of the used recangle.
     * @type {Rectangle}
     */
    #referenceRect;

    /** 
     * Paint context. Use context to piant on canvas.
     * @type {RenderingContext}
     */
    #ctx;

    /**
    * The corner colors of the canvas.
    * Corner A = [0, 190, 40];   // left top
    * Corner B = [255, 190, 0];  // right top
    * Corner C = [255, 10, 10];  // right bottom
    * Corner D = [10, 10, 255];  // left bottom
    * @type {Color[]}
    */
    #cornerColors = [
        new Color(0, 190, 40),
        new Color(255, 190, 0),
        new Color(255, 10, 10),
        new Color(10, 10, 255)];

    /** Array of particles to show on canvas 
     * @type {OrbitalParticle[]}
     */
    #particles;

    /**
     * This array contains objects for drawing a particle scatterer. When the mouse is clicked on the canvas, an object is to be added to this array. 
     * At each iteration it is then checked whether and how many scatter objects are present that need to be drawn. The number is limited.
     * @type {particleScatterEvent[]}
     */
    #scatterMovements;

    /**
     * This flag is reset with every mousedown. This is an auxiliary flag to prevent the particles from looping again.
     *  @type {boolean}
     */
    #newScatterEvent;

    /** 
     * If true, the colour of each particle is recalculated per iteration and depending on the proximity. Otherwise, the colour remains at the last value.
     * @type {boolean}
     */
    DoColorUpdates;

    /**
     * Ctor.
     * 
     * @param {ConfigParticleCanvas} config These are the configuration parameters of the Canvas.
     * @param {configOrbitalParticle} particleConfig These are the default configuration parameters of the particles.
     * @param {Rectangle} referenceRect The reference system with the basal values of the rectangle to be drawn in.
     */
    constructor(config, particleConfig, referenceRect) {
        this.#config = config;
        this.#originalParticleConfig = particleConfig;
        this.#cornerColors = config.Colors;
        this.#referenceRect = referenceRect;
        this.#ctx = this.#config.DomCanvas.getContext('2d');
        this.#ctx.globalAlpha = 1; // Probably not in use
        this.#ctx.globalFillStyle = this.#config.GlobalFillStyle;
        this.DoColorUpdates = false;
        this.#scatterMovements = [];
        this.#newScatterEvent = false;

        this.UpdateDimensions(this.#referenceRect.Width(), this.#referenceRect.Height());
        this.#setUpParticles();

        this.#config.DomCanvas.addEventListener("mousedown", (event) => {
            this.#newScatterEvent = true;
            this.#scatterMovements.push(new particleScatterEvent(
                24,
                new Point(event.clientX * this.#config.Dpr, event.clientY * this.#config.Dpr),
                this.#referenceRect,
                this.#cornerColors));
        });
    }

    /**
     * Resets the particle to their origin position.
     */
    ResetParticles() {
        this.#setUpParticles();
    }

    /**
     * 
     * @returns 
     */
    GetDomCanvas() {
        return this.#config.DomCanvas;
    }

    /**
     * Method to change the width and height of the canvas. This method must be called, for example, as soon as the size of the browser window changes. 
     * @param {number} width    Width to set the canvas width. 
     * @param {number} height        Height to set the canvas height
     */
    UpdateDimensions(width, height) {
        this.#config.DomCanvas.width = width;
        this.#config.DomCanvas.height = height;
    }

    /**
     * This method traverses all particles contained in this canvas changes the maximum value of the orbit (always x and y). 
     * If isSmallOrbit==true, then the maximum value of the orbit is set to 'DefaultMaximumMouseMoveOrbit'. 
     * If the mouse leaves the window, isSmallOrbit==false. Then all particles should move in a higher orbit around the centre of the screen.
     * 
     * This functionality may not have the effect one would expect. Movements in X and Y should be independent of each other and this can be observed. 
     * For this, however, the rotation (method Rotate and the value #theta) must be deactivated.
     * 
     * @param {boolean} isSmallOrbit If true use DefaultMaximumMouseMoveOrbit for max orbit. If false use 75% of width and height of the window.
     */
    UpdateOrbit(isSmallOrbit) {
        for (let index = 0; index < this.#particles.length; index++) {
            if (isSmallOrbit) {
                this.#particles[index].UpdateOrbit(this.#config.DefaultMaximumMouseMoveOrbit, this.#config.DefaultMaximumMouseMoveOrbit);
            }
            else {
                this.#particles[index].UpdateOrbit(this.#referenceRect.Width() * 0.35, this.#referenceRect.Height() * 0.35,);
            }
        }
    }

    /**  MustMustMustCall method
     * In order for an animation to be created, the canvas must present a progressively changing image at each iteration. 
     * The positions of the displayed elements also change with each iteration. This means that the canvas must be cleaned up before each redrawing of the current elements. 
     * Clear is intentionally not used here so that a remainder of the image can be preserved. This creates a "tail" in the moving elements.
     * */
    UpdatePerIteration() {
        this.#ctx.rect(0, 0, canvasParticle.width, canvasParticle.height);
        this.#ctx.fillStyle = this.#config.GlobalFillStyle; // 
        this.#ctx.fill();
    }

    /** MustCall method
     * Only if this method is called per iteration, the centerpoint is drawn to the canvas. 
     */
    DrawCenter() {
        if (Math.abs(rectControl.TrailingMousePosition().x - rectControl.MousePosition().x) > 3 &&
            Math.abs(rectControl.TrailingMousePosition().y - rectControl.MousePosition().y) > 3) {
            this.#ctx.fillStyle = 'rgb(' + [111, 255, 111] + ')';
            this.#ctx.beginPath();
            this.#ctx.arc(rectControl.MousePosition().x, rectControl.MousePosition().y, 2 * this.#config.Dpr, 0, PI2, false);
            this.#ctx.closePath();
            this.#ctx.fill();
        }
    }

    /** MustCall method
     * Only if this method is called per iteration, particles are drawn to the canvas. 
     */
    DrawParticles() {
        if (this.#particles.length >= 1) {
            // That's good, because so far either all the particles are in the transient or none are. At some point I'll rebuild, and then it'll all be for nothing again:-)
            if (this.#particles[0].IsInit()) {
                this.#particles.forEach(actualParticle => {
                    this.#drawParticle(actualParticle);
                    actualParticle.UpdateParameters(rectControl.MousePosition());
                });
            }
            else {
                this.#particles.forEach(actualParticle => {
                    // clean up lines, because lines must be repainted on every iteration and thats because relations may change, because of distances
                    actualParticle.Lines.clear();

                    // set opacity
                    this.#updateOpacityOfParticle(actualParticle);

                    this.#drawParticle(actualParticle);
                    actualParticle.UpdateParameters(rectControl.MousePosition());

                    if (this.DoColorUpdates) {
                        actualParticle.UpdateColor(this.#cornerColors, this.#config.FactorForUsingLogisticColorFunction);
                    }
                });

                // Paint lines only when not in init.
                if (this.#config.MaximumLinkDistances > 0) {
                    this.#doClostestStuff();
                    this.#particles.forEach(actualParticle => {
                        this.#drawLines(actualParticle);
                    });
                }
            }
            this.#newScatterEvent = false;
        }
    }

    /**
     * MustCall method.
     * Particle scatters can only be drawn if this method is called on each loop pass. If the array "this.#scatterMovements" is empty, nothing is drawn.
     */
    DrawScatters() {
        var removeMe = [];

        for (let index = 0; index < this.#scatterMovements.length; index++) {
            this.#scatterMovements[index].UpdateScatter();
            if (!this.#scatterMovements[index].IsAlive()) {
                removeMe.push(index);
            }

            this.#scatterMovements[index].GetScatterParticles().forEach(particle => {

                let bezier = this.#scatterMovements[index].GetBezier(particle.GetIndex());
                let start = bezier.GetStart();
                let cp1 = bezier.GetCp1();
                let cp2 = bezier.GetCp2();
                let end = bezier.GetEnd();
                this.#ctx.strokeStyle = particle.GetColorRgba();
                this.#ctx.lineWidth = 0.1;
                this.#ctx.beginPath();
                this.#ctx.moveTo(start.x, start.y);
                this.#ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
                this.#ctx.stroke();
            });
        }

        removeMe.forEach(item => {
            this.#scatterMovements.splice(item, 1);
        });
    }

    /**
     * 
     * @param {OrbitalParticle} particle 
     */
    #drawParticle(particle) {
        // Paints a 360° (2*PI) circle at particle position and fills it
        // So yes, this paints the particle.
        this.#ctx.fillStyle = particle.GetColorRgba();
        this.#ctx.beginPath();
        this.#ctx.arc(particle.GetPosition().x, particle.GetPosition().y, particle.GetSize() * this.#config.Dpr, 0, PI2, false);
        this.#ctx.fill();
    }

    /**
     * Private method is called automatically in DrawParticles().
     * Only if this method is called per iteration, lines are also drawn between the particles. 
     * @param {OrbitalParticle} particle The particle lines will be drawn.
     */
    #drawLines(particle) {
        this.#ctx.lineCap = 'round';

        for (const [indexOfClosest, closeParticle] of particle.Closest) {

            if (!particle.Lines.has(closeParticle.GetIndex())) {
                particle.Lines.set(closeParticle.GetIndex(), true);
                closeParticle.Lines.set(particle.GetIndex(), true);

                var gradient = this.#ctx.createLinearGradient(
                    particle.GetPosition().x,
                    particle.GetPosition().y,
                    closeParticle.GetPosition().x,
                    closeParticle.GetPosition().y);
                
                let alpha = particle.Opacities.get(indexOfClosest)*particle.GetAlpha();
                gradient.addColorStop(0, particle.GetColorRgbaRandomOpacity(alpha * 0.6));
                gradient.addColorStop(0.75, closeParticle.GetColorRgbaRandomOpacity(alpha * 0.2));
                
                this.#ctx.strokeStyle = gradient;
                this.#ctx.beginPath();
                this.#ctx.moveTo(particle.GetPosition().x, particle.GetPosition().y);
                this.#ctx.lineTo(closeParticle.GetPosition().x, closeParticle.GetPosition().y);
                this.#ctx.lineWidth = 1 //;particle.GetSize() * DPR * particle.Opacities[indexOfClosest]; // thats the shit.- if width >1 you need gpu as hell
                this.#ctx.stroke();
                this.#ctx.closePath();
            }
        }
    }


    /**
     * setUpParticles dependet to the configuration.
     * Note this method empties the particle array.
     */
    #setUpParticles() {
        this.#particles = [];
        var distanceBetweenParticles = PI2 / this.#config.ParticleCount;

        for (let index = 0; index < this.#config.ParticleCount; index++) {
            // All particles are arranged equidistantly on a circle around the centre of the canvas. The start positions of the particles are outside the 
            // visible area. This has the effect that when this spectacle is started, all particles fly towards the centre of the canvas like inverted sunbeams. 
            var factorToReduce = 0.8;
            var angle = index * distanceBetweenParticles; // This is the angle in radians
            var x = Math.cos(angle) * this.#config.DomCanvas.width * factorToReduce;
            x += this.#config.DomCanvas.width / 2;
            var y = Math.sin(angle) * this.#config.DomCanvas.height * factorToReduce;
            y += this.#config.DomCanvas.height / 2;

            var particle = new OrbitalParticle(this.#originalParticleConfig, index, this.#referenceRect, new Point(x, y), angle);
            this.#particles.push(particle);
        }
    }

    /**
     * This exciting method loops through all particles and searches for a defined number (MaximumNumberOfLines) of particles that are 
     * no further away from the iterated particle (actualParticle) than MaximumLinkDistances. If a close particle is found (innerParticle), 
     * the found particle is entered as a reference in a list (Closest) in the iterated particle. In the same way, actualParticle is entered in the list 'Closest' 
     * in 'innerParticle'. This prevents ring dependencies. 
     * In addition, a value for the opacity is calculated depending on the distance between the two particles.
     */
    #doClostestStuff() {
        for (let index = 0; index < this.#particles.length; index++) {
            var actualParticle = this.#particles[index];

            // Remove particles that are further away than the maximum distance.
            var removeMe = [];
            for (const [key, closeParticle] of actualParticle.Closest) {
                var distance = actualParticle.GetPosition().distanceTo(closeParticle.GetPosition());
                if (distance > this.#config.MaximumLinkDistances) {
                    removeMe.push(key);
                }
            }
            removeMe.forEach(indexToDelete => {
                actualParticle.Closest.delete(indexToDelete);
                actualParticle.Opacities.delete(indexToDelete);
            });

            // Start at a random particle and walk through all existing particles to find the first 
            // "MaximumNumberOfLines" particles that are closer to actualParticle than "maximumLinkDistance". 
            let randomParticleStartOfLoop = getRandom(0, this.#particles.length - 1) | 0;

            let indexOfInnerParticle = randomParticleStartOfLoop;
            do {

                // Do nothing if the maximum number of connected particles has already been reached with a certain distance.
                if (actualParticle.Closest.size >= this.#config.MaximumNumberOfLines) {
                    break;
                }

                var innerParticle = this.#particles[indexOfInnerParticle];

                if (actualParticle.GetIndex() !== innerParticle.GetIndex()) {
                    var distance = actualParticle.GetPosition().distanceTo(innerParticle.GetPosition());
                    if (distance < this.#config.MaximumLinkDistances) {

                        if ((innerParticle.Closest.size < this.#config.MaximumNumberOfLines)) {
                            var opacity = (1 - (distance / this.#config.MaximumLinkDistances));  // TODO opacity: This may not belong in this method, but actually the opacity of line start and end must be determined new at each iteration. That is still missing.
                            actualParticle.Opacities.set(innerParticle.GetIndex(), opacity);
                            innerParticle.Opacities.set(actualParticle.GetIndex(), opacity);

                            if (!(actualParticle.index in innerParticle.Closest)) {
                                actualParticle.Closest.set(innerParticle.GetIndex(), innerParticle);
                                innerParticle.Closest.set(actualParticle.GetIndex(), actualParticle);
                            }
                        }
                    }
                }
                indexOfInnerParticle = (indexOfInnerParticle + 1) % this.#particles.length;
            } while (indexOfInnerParticle != randomParticleStartOfLoop)
        }
    }

    /**
     * This function updates the opacity of the particles depending on the current value, whether they are in a special movement (init) and whether it is a new scatter event.
     * @param {OrbitalParticle} particle 
     */
    #updateOpacityOfParticle(particle) {
        if (!particle.IsInit()) {
            if (this.#newScatterEvent) {
                particle.SetAlpha(0.01);
            }
            else if (particle.GetAlpha() < 1) {
                particle.SetAlpha(particle.GetAlpha() * 1.01);
            }
        }
    }
}