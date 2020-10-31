/*
 * A door that irises open when an avatar approaches it
 */
AFRAME.registerComponent('irisdoor', {
	schema: {
		blades: {type:'number', default:11, }, // number of blades to draw
		radius: {type:'number', default:2, }, // radius of the door blades
		range: {type:'number', default:4, }, // m at which the door starts to open
		speed: {type:'number', default:1000, }, // ms to open the door
	},

	init: function()
	{
		// initial position is closed
		this.open = 0;

		// create the blades
		for(let i = 0 ; i < this.data.blades ; i++)
		{
			let div = document.createElement('a-entity');
			let angle = i * 360 / this.data.blades;
 			let height = this.data.radius * 2 * Math.PI / this.data.blades;
			div.home = {
				x: -Math.cos(angle*Math.PI/180) * this.data.radius,
				y: -Math.sin(angle*Math.PI/180) * this.data.radius,
				z: 0,
			};
			div.setAttribute('position', {
				x: 0,
				y: 0,
				z: 0,
			});
			div.setAttribute('rotation', {
				x: 0,
				y: 0,
				z: angle,
			});

			let blade = document.createElement('a-box');
			blade.setAttribute('position', {
				x: -this.data.radius/2,
				y: height/2,
				z: 0,
			});
			blade.setAttribute('rotation', {
				x: -5,
				y: 0,
				z: 0,
			});

			blade.setAttribute('width', this.data.radius);
			blade.setAttribute('height', height);
			blade.setAttribute('depth', 0.01);
			blade.setAttribute('material', {
				color: '#808080',
			});

			div.appendChild(blade);
			this.el.appendChild(div);
		}
	},

	tick: function(time, dt)
	{
		// convert from ms to seconds
		dt /= 1000;

		var pos = this.el.object3D.position;
		var min_dist = 10000;

		// find the closest interactable object
		for(obj of document.querySelectorAll('.interactable'))
		{
			let dist = pos.distanceTo(obj.object3D.position);
			if (min_dist > dist)
				min_dist = dist;
		}

		// find the closest player
		for(obj of document.querySelectorAll("a-entity[player-info]")) {
			let dist = pos.distanceTo(obj.object3D.position);
			if (min_dist > dist)
				min_dist = dist;
		}

		// if distance is less than the range, open the door
		if (min_dist < this.data.range && !this.open)
		{
			// start an animation to open the door
			this.open = true;
			console.log("OPENING");
			for(let blade of this.el.children)
			{
				blade.setAttribute('animation', {
					property: 'position',
					to: blade.home,
					dur: this.data.speed,
					loop: 0,
				});
			}
		} else
		if (min_dist > this.data.range && this.open)
		{
			// start the animation to close the door
			this.open = false;
			console.log("CLOSING");
			for(let blade of this.el.children)
			{
				blade.setAttribute('animation', {
					property: 'position',
					to: { x:0, y:0, z:0 },
					dur: this.data.speed,
					loop: 0,
				});
			}
		}
	},
});
