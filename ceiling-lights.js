/*
 * A door that irises open when an avatar approaches it
 */
AFRAME.registerComponent('ceilinglights', {
	schema: {
        lights_row: {type:'number', default:5, }, // number of lights to draw row
        lights_col: {type:'number', default:2, }, // number of lights to draw column 
        width: {type:'number', default:.1, }, // width of each light
        height: {type:'number', default:.7, }, // height of each light
        depth: {type:'number', default:.1, }, // depth of each light
		range: {type:'number', default:5, }, // m at which the person can trigger animation
        speed: {type:'number', default:1000, }, // ms to open the door
        theta: {type:'number', default:0, }
	},

	init: function()
	{
        console.log("CREATING LIGHTS");
        var counter = 0;

		// create rows and columns of lights
        for(let j = 0 ; j < this.data.lights_col ; j++)
            for(let i = 0 ; i < this.data.lights_row ; i++){
            {
                let div = document.createElement('a-entity');
                div.setAttribute('position', {
                    x: i/2,
                    y: - Math.sin(counter) / 2,
                    z: j,
                });
                let light = document.createElement('a-box');
                light.setAttribute('position', {
                    x: 0,
                    y: 0,
                    z: 0,
                });

                light.setAttribute('width', this.data.width);
                light.setAttribute('height', this.data.height);
                light.setAttribute('depth', this.data.depth);
                if (i % 3 == 0) {
                    light.setAttribute('material', { // hot pink
                        color: '#ff69b4',
                    });
                }
                if (i % 3 == 1) {
                    light.setAttribute('material', { //deep purple
                        color: '#6800E7',
                    });
                }
                if (i % 3 == 2) {
                    light.setAttribute('material', {
                        color: '#05B9EC', // teal
                    });
                }

                div.appendChild(light);
                this.el.appendChild(div);
            }
            counter += 2 * Math.PI / this.data.lights_row;
        }
    },

	tick: function(time, dt)
	{
        var counter = 0;
        theta = this.data.theta;
        diff = dt/10000;
        theta += diff; //0.1;
        
        // Annimate the wave, columns are in sync
        var lights = this.el.children;
        for (var i = 0; i < lights.length; i++) {
            var i_u = i / this.data.lights_row; //col
            var i_v = i % this.data.lights_row; // row
            var light = lights[i];
            
            pos_x = light.getAttribute('position').x;
            pos_y = light.getAttribute('position').y;
            pos_z = light.getAttribute('position').z;
            light.setAttribute('position', {
                x: pos_x, 
                y: Math.sin(2 * Math.PI / this.data.lights_row * i_v + theta),
                z: pos_z});
        }
        this.data.theta = theta;
	},
});
