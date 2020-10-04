/*
 * Single bee that follows a target
 */
AFRAME.registerComponent('follower', {
	schema: {
		target: {type:'selector', default:'#camera', },
		accel: {type:'number', default:100, },
		maxvel: {type:'number', default:12, },
		noise: {type:'number', default:2, },
	},

	init: function()
	{
		// allocate the delta so that it doesn't have to
		// be re-allocated every tick
		this.delta = new THREE.Vector3(0,0,0)

		// initial velocity is zero
		this.vel = new THREE.Vector3(0,0,0)

		// noise vector for adding some randomness
		this.noise = new THREE.Vector3(0,0,0)
	},

	tick: function(time, dt)
	{
		// convert from ms to seconds
		dt /= 1000;

		var pos = this.el.object3D.position;
		if (this.data.target)
		{
			// compute the direction unit vector towards the target
			// and then multipy by the max acceleration 
			this.delta.copy(this.data.target.object3D.position);
			this.delta.sub(pos);
			this.delta.setLength(this.data.accel * dt);
		} else {
			// random walk until our target appears
			let acc = this.data.accel * dt;
			this.delta.x = (Math.random() - 0.5) * acc;
			this.delta.y = (Math.random() - 0.5) * acc;
			this.delta.z = (Math.random() - 0.5) * acc;
		}

		// update the velocity with the acceleration
		// and limit the velocty to the maximum
		this.vel.add(this.delta);
		this.vel.clampLength(0, this.data.maxvel);

		// add a little randomness
		this.vel.x += (Math.random()-0.5) * this.data.noise;
		this.vel.y += (Math.random()-0.5) * this.data.noise;
		this.vel.z += (Math.random()-0.5) * this.data.noise;

		// update the position with the velocity
		this.el.setAttribute('position', {
			x: pos.x + this.vel.x * dt,
			y: pos.y + this.vel.y * dt,
			z: pos.z + this.vel.z * dt,
		});
	},
});
