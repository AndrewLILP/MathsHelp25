// File: 01frontend/src/services/geogebraService.js
// Service for handling GeoGebra API interactions

class GeoGebraService {
    constructor() {
      this.isLoaded = false;
      this.loadPromise = null;
    }
  
    // Load GeoGebra script if not already loaded
    async loadGeoGebra() {
      if (this.isLoaded) {
        return Promise.resolve();
      }
  
      if (this.loadPromise) {
        return this.loadPromise;
      }
  
      this.loadPromise = new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.GGBApplet) {
          this.isLoaded = true;
          resolve();
          return;
        }
  
        // Create script element
        const script = document.createElement('script');
        script.src = 'https://cdn.geogebra.org/apps/deployggb.js';
        script.async = true;
        
        script.onload = () => {
          this.isLoaded = true;
          console.log('✅ GeoGebra API loaded successfully');
          resolve();
        };
  
        script.onerror = () => {
          console.error('❌ Failed to load GeoGebra API');
          reject(new Error('Failed to load GeoGebra API'));
        };
  
        document.head.appendChild(script);
      });
  
      return this.loadPromise;
    }
  
    // Create GeoGebra app with default parameters
    createApp(containerId, customParams = {}) {
      if (!window.GGBApplet) {
        throw new Error('GeoGebra API not loaded');
      }
  
      const defaultParams = {
        appName: "graphing",
        width: 800,
        height: 600,
        showToolBar: true,
        showAlgebraInput: true,
        showMenuBar: false,
        showResetIcon: true,
        enableLabelDrags: false,
        enableShiftDragZoom: true,
        enableRightClick: false,
        showZoomButtons: true,
        capturingThreshold: null,
        errorDialogsActive: false,
        useBrowserForJS: false,
        ...customParams
      };
  
      return new window.GGBApplet(defaultParams, true);
    }
  
    // Pre-defined topic configurations
    getTopicConfig(topicName) {
      const name = topicName.toLowerCase();
      
      if (name.includes('quadratic')) {
        return {
          type: 'quadratic',
          title: 'Quadratic Functions Explorer',
          description: 'Explore how coefficients affect the shape and position of parabolas',
          commands: [
            'a = Slider[-5, 5, 0.1, 1, 150, false, true, false, false]',
            'b = Slider[-10, 10, 0.1, 1, 150, false, true, false, false]',
            'c = Slider[-10, 10, 0.1, 1, 150, false, true, false, false]',
            'f(x) = a * x^2 + b * x + c',
            'V = Vertex(f)'
          ],
          initialValues: { a: 1, b: 0, c: 0 },
          viewBox: [-10, 10, -10, 10],
          instructions: [
            'Adjust slider "a" to change the width and direction of the parabola',
            'Adjust slider "b" to shift the parabola horizontally',
            'Adjust slider "c" to shift the parabola vertically',
            'Watch how the vertex point V moves as you change the parameters'
          ]
        };
      }
      
      if (name.includes('linear')) {
        return {
          type: 'linear',
          title: 'Linear Functions Explorer',
          description: 'Understand slope and y-intercept in linear equations',
          commands: [
            'm = Slider[-5, 5, 0.1, 1, 150, false, true, false, false]',
            'b = Slider[-10, 10, 0.1, 1, 150, false, true, false, false]',
            'f(x) = m * x + b',
            'A = (0, b)',
            'B = (1, m + b)'
          ],
          initialValues: { m: 1, b: 0 },
          viewBox: [-10, 10, -10, 10],
          instructions: [
            'Adjust slider "m" to change the slope of the line',
            'Adjust slider "b" to change the y-intercept',
            'Point A shows the y-intercept',
            'Notice how slope affects the steepness of the line'
          ]
        };
      }
  
      if (name.includes('trigonometry') || name.includes('sine') || name.includes('cosine')) {
        return {
          type: 'trigonometric',
          title: 'Trigonometric Functions Explorer',
          description: 'Explore amplitude, frequency, and phase shifts in trig functions',
          commands: [
            'A = Slider[-3, 3, 0.1, 1, 150, false, true, false, false]',
            'B = Slider[0.1, 3, 0.1, 1, 150, false, true, false, false]',
            'C = Slider[-π, π, 0.1, 0, 150, false, true, false, false]',
            'f(x) = A * sin(B * x + C)',
            'g(x) = sin(x)'
          ],
          initialValues: { A: 1, B: 1, C: 0 },
          viewBox: [-2*Math.PI, 2*Math.PI, -3, 3],
          instructions: [
            'Adjust "A" to change the amplitude (height) of the wave',
            'Adjust "B" to change the frequency (how compressed the wave is)',
            'Adjust "C" to shift the wave horizontally (phase shift)',
            'Compare with the basic sine function g(x) = sin(x)'
          ]
        };
      }
  
      if (name.includes('circle') || name.includes('geometry')) {
        return {
          type: 'geometry',
          title: 'Circle and Geometry Explorer',
          description: 'Explore geometric relationships and properties',
          commands: [
            'r = Slider[1, 10, 0.1, 3, 150, false, true, false, false]',
            'O = (0, 0)',
            'c = Circle[O, r]',
            'A = Point[c]',
            'B = Point[c]'
          ],
          initialValues: { r: 3 },
          viewBox: [-12, 12, -12, 12],
          instructions: [
            'Adjust "r" to change the radius of the circle',
            'Drag points A and B around the circle',
            'Observe geometric relationships and properties',
            'Use tools to measure angles and distances'
          ]
        };
      }
  
      // Default configuration
      return {
        type: 'default',
        title: 'Mathematical Explorer',
        description: 'Interactive mathematical visualization tool',
        commands: [
          'a = Slider[-3, 3, 0.1, 1, 150, false, true, false, false]',
          'b = Slider[-3, 3, 0.1, 1, 150, false, true, false, false]',
          'f(x) = a * x + b'
        ],
        initialValues: { a: 1, b: 0 },
        viewBox: [-10, 10, -10, 10],
        instructions: [
          'Use the sliders to adjust parameters',
          'Explore how changes affect the mathematical relationships',
          'Try different values and observe patterns'
        ]
      };
    }
  
    // Set up a topic-specific demo
    setupTopicDemo(ggbApp, topicName) {
      const config = this.getTopicConfig(topicName);
      
      try {
        // Execute setup commands
        config.commands.forEach(command => {
          ggbApp.evalCommand(command);
        });
  
        // Set initial values
        Object.entries(config.initialValues).forEach(([variable, value]) => {
          ggbApp.setValue(variable, value);
        });
  
        // Set coordinate system
        if (config.viewBox) {
          ggbApp.setCoordSystem(...config.viewBox);
        }
  
        console.log(`✅ ${config.type} demo initialized for topic: ${topicName}`);
        return config;
      } catch (error) {
        console.error(`❌ Error setting up ${config.type} demo:`, error);
        throw error;
      }
    }
  
    // Utility methods for common GeoGebra operations
    exportToImage(ggbApp, filename = 'geogebra-export.png') {
      try {
        const dataURL = ggbApp.getPNGBase64(1, true);
        const link = document.createElement('a');
        link.download = filename;
        link.href = 'data:image/png;base64,' + dataURL;
        link.click();
      } catch (error) {
        console.error('Error exporting image:', error);
      }
    }
  
    resetToInitialState(ggbApp, topicName) {
      const config = this.getTopicConfig(topicName);
      
      try {
        // Reset to initial values
        Object.entries(config.initialValues).forEach(([variable, value]) => {
          ggbApp.setValue(variable, value);
        });
        
        // Reset view
        if (config.viewBox) {
          ggbApp.setCoordSystem(...config.viewBox);
        }
      } catch (error) {
        console.error('Error resetting to initial state:', error);
      }
    }
  
    // Get current state for saving/sharing
    getCurrentState(ggbApp) {
      try {
        return {
          xml: ggbApp.getXML(),
          base64: ggbApp.getBase64(),
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error getting current state:', error);
        return null;
      }
    }
  
    // Load a saved state
    loadState(ggbApp, stateData) {
      try {
        if (stateData.xml) {
          ggbApp.setXML(stateData.xml);
        } else if (stateData.base64) {
          ggbApp.setBase64(stateData.base64);
        }
      } catch (error) {
        console.error('Error loading state:', error);
      }
    }
  }
  
  // Export singleton instance
  export default new GeoGebraService();