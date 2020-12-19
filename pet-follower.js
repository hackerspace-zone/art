/*
 * Follow an player using a direct path
 */
AFRAME.GLTFModelPlus.registerComponent("pet", "pet", el => {
	// the GLTF is nested as:
	// a-entity -> AvatarRoot -> AvatarNodes -> node
	// so we have to attach the follower attribute to the
	// third parent.
	el.parentEl.parentEl.parentEl.setAttribute("pet-follower", { });
});

AFRAME.registerComponent('pet-follower', {
	schema: {
		target: {type:'selector', default:'#avatar-rig', },
		offset: {type:'vec3', default: { x:0, y:0.5, z:0 } },
		maxvel: {type:'number', default: 0.5 },
		accel: {type:'number', default: 0.2 },
		noise: {type:'number', default: 0.05 },
	},

	init: function()
	{
		// allocate the target so that it doesn't have to
		// be re-allocated every tick
		this.target = new THREE.Vector3(0,0,0)
		this.pos = new THREE.Vector3(0,0,0)
		this.vel = new THREE.Vector3(0,0,0)
		this.delta = new THREE.Vector3(0,0,0)

		console.log("pet-follower: el=", this.el, " following ", this.data.target, "gltf=", this.data.gltf);
	},

	tick: function(time, dt)
	{
		if (!this.data.target)
			return;

		// only the owner should update it
		if (NAF.utils.getNetworkOwner(this.el) != NAF.clientId)
			return;

		const target = this.data.target.object3D;
		this.el.object3D.getWorldPosition(this.pos);
		target.getWorldPosition(this.target);
		this.delta.copy(this.target);
		this.delta.sub(this.pos);
		this.delta.y = 0; // only act in the horizontal
		
		if (0)
		{
			// rotate the offset so that it is constant relative
			// to the player's heading
			const cpsi = Math.cos(target.rotation.y);
			const spsi = Math.sin(target.rotation.y);

			this.delta.x += +spsi * this.data.offset.z + cpsi * this.data.offset.x; 
			this.delta.y += this.data.offset.y;
			this.delta.z += -cpsi * this.data.offset.z + spsi * this.data.offset.x; 

			// align the object towards the target
			this.el.object3D.rotation.y = Math.atan2(this.delta.x, this.delta.z);

			// move the position 1% towards the target
			this.delta.multiplyScalar(0.01);
			this.pos.add(this.delta);

			//console.log("pet-follower:", this.pos, this.target, this.delta);
		} else {
			// "fly" towards the target
			this.delta.setLength(this.data.accel * dt / 1000);

			this.vel.add(this.delta);
			this.vel.clampLength(0, this.data.maxvel);
			this.vel.x += (Math.random() - 0.5) * this.data.noise;
			this.vel.y += (Math.random() - 0.5) * this.data.noise;
			this.vel.z += (Math.random() - 0.5) * this.data.noise;

			// integrate the velocity to compute the new position
			this.delta.copy(this.vel);
			this.delta.multiplyScalar(dt / 1000.0);
			this.pos.add(this.delta);
			this.pos.y = this.target.y + this.data.offset.y;

			// align the object in the velocity direction
			this.el.object3D.rotation.y = Math.atan2(this.vel.x, this.vel.z);
		}

		// update the position
		this.el.object3D.position.copy(this.pos);
	},
});
