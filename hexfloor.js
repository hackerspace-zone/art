/*
 * a hexagonal tiled dance floor that reacts to the players
 * floating above it.
 */
AFRAME.registerComponent('hexfloor', {
	schema: {
		radius: {type:'number', default:1, }, // radius of the hexagons
		width: {type:'number', default:8, }, // 
	},

	init: function()
	{
		// create the hexagonal tiles
		for(let x = -this.data.width/2 ; x < this.data.width/2 ; x++)
		{
			for(let y = -this.data.width/2 ; y < this.data.width/2 ; y++)
			{

				// <a-entity geometry="primitive: cylinder; segmentsRadial: 6"></a-entity>
				let div = document.createElement('a-entity');
				let sx = Math.sqrt(3) * (y/2 + x);
				let sy = 3/2 * y;
				div.setAttribute('position', {
					x: this.data.radius * sx,
					y: 0,
					z: this.data.radius * sy,
				});
				div.setAttribute('geometry', {
					primitive: 'cylinder',
					segmentsRadial: 6,
					radius: this.data.radius * 0.95,
					height: this.data.min,
				});
				div.setAttribute('hexfloor-hex', {
					min: this.data.min,
					max: this.data.max,
				});

				div.setAttribute('material', {
					color: '#a00080',
				});

				this.el.appendChild(div);
			}
		}
	},

	tick: function(time, dt)
	{
		// nothing for the floor itself
	},
});

AFRAME.registerComponent('hexfloor-hex', {
	schema: {
		min: {type:'number', default:0.1, }, // min height
		max: {type:'number', default:1.0, }, // max height
		smoothing: { type:'number', default:64, },
		max_effect: { type:'number', default:0.5, },
	},

	init: function()
	{
		// how much player effect is in place right now
		this.effect = 0;
	},
	
	tick: function(time, dt)
	{
		let pos = this.el.object3D.position;
		let effect = 0;

		// height is based on inverse distance to each player
		for(obj of document.querySelectorAll("a-entity[player-info]")) {
			let dist = pos.distanceTo(obj.object3D.position);
			if (dist == 0)
				dist = 0.1;
			effect += 1.0 / dist;
		}

		// ramp down current effect to the measured effect
		// but move up quickly
		// clamping at maximum effect
		if (this.effect > effect)
			this.effect = (this.effect * this.data.smoothing + effect)
				/ (this.data.smoothing+1);
		else
			this.effect = effect;

		// compute the new height scale factor from min to max
		let height = 1.0 + (this.data.max / this.data.min)
				* this.effect / this.data.max_effect;

		// adjust the z size based on the effect
/*
		this.el.setAttribute('animation', {
			property: 'scale',
			to: { x:1, y:height, z:1 },
			dur: 100, // this.data.speed,
			loop: 0,
		});
*/
		this.el.setAttribute('scale', { x:1, y:height, z:1 } );
		//console.log(effect, height);
	},
});
