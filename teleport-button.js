/*
 * Move the avatar to a new position, either relative or absolute.
 */
AFRAME.registerComponent('teleport-button', {
	schema: {
		target: { type:'selector', default:null, },
		offset: { type:'vec3', default:{ x:0, y:0, z:0 } },
	},

	init: function()
	{
		this.target = new THREE.Vector3();
		this.onClick = this.onClick.bind(this);
		this.el.object3D.addEventListener('interact', this.onClick);
	},

	onClick: function(evt)
	{
		const target = this.data.target || this.el;

		const player = AFRAME.scenes[0].systems["hubs-systems"].characterController;

		target.object3D.getWorldPosition(this.target);
		this.target.add(this.data.offset);

		console.log("teleport-button: ", this.target);
		player.teleportTo(this.target);
	},
});
