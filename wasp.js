/*
 * Random moving object that stays within boundaries
 */
AFRAME.registerComponent('wasp', {
	schema: {
		accel: {type:'number', default:400, },
		maxvel: {type:'number', default:50, },
		range: {type:'number', default:10, },
	},

	init: function()
	{
		// allocate the delta so that it doesn't have to
		// be re-allocated every tick
		this.delta = new THREE.Vector3(0,0,0)

		// initial velocity is zero
		this.vel = new THREE.Vector3(0,0,0)
	},

	tick: function(time, dt)
	{
		// convert from ms to seconds
		dt /= 1000;

		var pos = this.el.object3D.position;
		var acc = this.data.accel * dt;

		// compute the direction unit vector towards the target
		// and then multipy by the max acceleration 
		this.delta.x = (Math.random() - 0.5) * acc;
		this.delta.y = (Math.random() - 0.5) * acc;
		this.delta.z = (Math.random() - 0.5) * acc;

		// update the velocity with the acceleration
		// and limit the velocty to the maximum
		this.vel.add(this.delta);
		this.vel.clampLength(0, this.data.maxvel);

		// if the wasp is approaching the edge, nudge back towards
		// the center of the range
		var range = this.data.range;
		var nudge = this.data.maxvel / 100;
		if (pos.x < 0)
			this.vel.x += Math.random() * nudge;
		else
			this.vel.x -= Math.random() * nudge;

		if (pos.y < 0)
			this.vel.y += Math.random() * nudge;
		else
			this.vel.y -= Math.random() * nudge;

		if (pos.z < 0)
			this.vel.z += Math.random() * nudge;
		else
			this.vel.z -= Math.random() * nudge;

		// if the wasp has hit the edge, bounce it back
		if (pos.x > range)
			this.vel.x = -Math.abs(this.vel.x);
		else
		if (pos.x < -range)
			this.vel.x = +Math.abs(this.vel.x);

		if (pos.y > range)
			this.vel.y = -Math.abs(this.vel.y);
		else
		if (pos.y < -range)
			this.vel.y = +Math.abs(this.vel.y);

		if (pos.z > range)
			this.vel.z = -Math.abs(this.vel.z);
		else
		if (pos.z < -range)
			this.vel.z = +Math.abs(this.vel.z);
		
		// update the position with the velocity
		this.el.setAttribute('position', {
			x: pos.x + this.vel.x * dt,
			y: pos.y + this.vel.y * dt,
			z: pos.z + this.vel.z * dt,
		});
	},
});
