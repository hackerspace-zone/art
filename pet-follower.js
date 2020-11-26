/*
 * Follow an player using the path finding
 */
AFRAME.registerComponent('pet-follower', {
	schema: {
		target: {type:'selector', default:'#avatar-rig', },
		offset: {type:'vec3', default: { x:0, y:0.5, z:1 } },
	},

	init: function()
	{
		// allocate the target so that it doesn't have to
		// be re-allocated every tick
		this.target = new THREE.Vector3(0,0,0)
		this.pos = new THREE.Vector3(0,0,0)
		this.delta = new THREE.Vector3(0,0,0)

		console.log("pet-follower: following ", this.data.target);
	},

	tick: function(time, dt)
	{
		if (!this.data.target)
			return;

		const target = this.data.target.object3D;
		this.el.object3D.getWorldPosition(this.pos);
		target.getWorldPosition(this.target);
		this.delta.copy(this.target);
		this.delta.sub(this.pos);
		
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

		// this assumes the follower is not in a separate reference frame
		// it also will clip through things in its pursuit
		this.el.object3D.position.copy(this.pos);
	},
});
