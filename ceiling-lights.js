/*
 * A door that irises open when an avatar approaches it
 */
AFRAME.registerComponent('ceilinglights', {
	schema: {
        lights_row: {type:'number', default:30, }, // number of lights to draw row
        lights_col: {type:'number', default:10, }, // number of lights to draw column 
        width: {type:'number', default:.05, }, // width of each light
        height: {type:'number', default:.5, }, // height of each light
        depth: {type:'number', default:.05, }, // depth of each light
		range: {type:'number', default:5, }, // m at which the person can trigger animation
		speed: {type:'number', default:1000, }, // ms to open the door
	},

	init: function()
	{
        console.log("CREATING LIGHTS");
		// initial position is closed
		this.open = 0;

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
                    y: 0,
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
        }
    },

	tick: function(time, dt)
	{
		// convert from ms to seconds
        dt /= 1000;
        console.log("TIME")
        console.log(dt)

		var pos = this.el.object3D.position;
        var min_dist = 10000;

        // start an animation to open the door
        this.open = true;
        // for(let light of this.el.children)
        // {
        this.el.setAttribute('position', {
            x:-2, y: 3 - dt, z:-12.5 });

/*
		// find the closest interactable object
		for(obj of document.querySelectorAll('.interactable'))
		{
			let dist = pos.distanceTo(obj.object3D.position);
			if (min_dist > dist)
				min_dist = dist;
		}
*/

		// find the closest player
		for(obj of document.querySelectorAll("a-entity[player-info]")) {
            let dist = pos.distanceTo(obj.object3D.position);
            // console.log("POS");
            // console.log(dist);
			if (min_dist > dist)
				min_dist = dist;
		}

		// if distance is less than the range, open the door
		// if (min_dist < this.data.range && !this.open)
		// {
		// 	// start an animation to open the door
		// 	this.open = true;
		// 	console.log("OPENING");
		// 	// for(let light of this.el.children)
		// 	// {
        //     this.el.setAttribute('animation', {
        //         property: 'position',
        //         to: { x:0, y: 1, z:-6 },
        //         dur: this.data.speed,
        //         loop: 0,
        //     });
		// 	// }
		// } else
		// if (min_dist > this.data.range && this.open)
		// {
		// 	// start the animation to close the door
		// 	this.open = true;
        //     console.log("CLOSING");
		// 	// for(let light of this.el.children)
		// 	// {
        //     this.el.setAttribute('animation', {
        //         property: 'position',
        //         to: { x:0, y: 3, z:-6 },
        //         dur: this.data.speed,
        //         loop: 0,
        //     });
		// 	// }
		// }
	},
});
