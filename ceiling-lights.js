/*
 * A door that irises open when an avatar approaches it
 */
AFRAME.registerComponent('ceilinglights', {
	schema: {
        lights_row: {type:'number', default:5, }, // number of lights to draw row
        lights_col: {type:'number', default:2, }, // number of lights to draw column 
        width: {type:'number', default:.05, }, // width of each light
        height: {type:'number', default:.5, }, // height of each light
        depth: {type:'number', default:.05, }, // depth of each light
		range: {type:'number', default:5, }, // m at which the person can trigger animation
        speed: {type:'number', default:1000, }, // ms to open the door
        theta: {type:'number', default:0, }
	},

	init: function()
	{
        console.log("CREATING LIGHTS");
		// initial position is closed
        this.open = 0;
        var counter = 0;

		// create the blades
        for(let i = 0 ; i < this.data.lights_row ; i++){
            for(let j = 0 ; j < this.data.lights_col ; j++)
            {
                let div = document.createElement('a-entity');
                // let angle = i * 360 / this.data.blades;
                // let height = this.data.radius * 2 * Math.PI / this.data.blades;
                div.home = {
                    x: 0,
                    y: 0,
                    z: 0,
                };
                div.setAttribute('position', {
                    x: i/2,
                    y: - Math.sin(counter) / 2,
                    z: j/3,
                });
                // div.setAttribute('rotation', {
                // 	x: 0,
                // 	y: 0,
                // 	z: angle,
                // });

                let light = document.createElement('a-box');
                light.setAttribute('position', {
                    x: 0,
                    y: 0,
                    z: 0,
                });
                // blade.setAttribute('rotation', {
                // 	x: -5,
                // 	y: 0,
                // 	z: 0,
                // });

                light.setAttribute('width', this.data.width);
                light.setAttribute('height', this.data.height);
                light.setAttribute('depth', this.data.depth);
                if (i % 3 == 0) {
                    light.setAttribute('material', {
                        color: '#B239FF',
                    });
                }
                if (i % 3 == 1) {
                    light.setAttribute('material', {
                        color: '#6800E7',
                    });
                }
                if (i % 3 == 2) {
                    light.setAttribute('material', {
                        color: '#05B9EC',
                    });
                }

                div.appendChild(light);
                this.el.appendChild(div);
            }
            counter += i/this.data.lights_row;
        }
    },

	tick: function(time, dt)
	{
		// // convert from ms to seconds
        // dt /= 1000;
        // // console.log("TIME")
        // // console.log(dt)

        // var counter = 0;
        // theta = this.data.theta;
        // theta += 0.1;
        
        // // console.log(theta);
        // var lights = this.el.children;
        // // console.log(lights.length)
        // for (var i = 0; i < lights.length; i++) {
        //     var i_u = i / this.data.lights_row; //row
        //     var i_v = i % this.data.lights_row; // column
        //     // counter = i_u / this.data.lights_row;
        //     var light = lights[i];
            
        //     pos_x = light.getAttribute('position').x;
        //     pos_y = light.getAttribute('position').y;
        //     pos_z = light.getAttribute('position').z;
        //     this.el.setAttribute('position', {
        //         x: pos_x, 
        //         y: Math.sin(i_u + theta) / 2 + 0.5,
        //         z: pos_z});
        // }
        // this.data.theta = theta;
	
	},
});
