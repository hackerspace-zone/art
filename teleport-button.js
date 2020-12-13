/*
 * Move the avatar to a new position, either relative or absolute.
 */
AFRAME.registerComponent('teleport-button', {
	schema: {
		target: { type:'string', default:"", },
		offset: { type:'vec3', default:{ x:0, y:0, z:0 } },
	},

	init: function()
	{
		this.target = new THREE.Vector3();
		this.onClick = this.onClick.bind(this);
		this.el.object3D.addEventListener('interact', this.onClick);
		console.log("teleport-button: target=", this.data.target);
	},

	onClick: function(evt)
	{
		let target = this.el;

		if (this.data.target)
		{
			const nodes = document.querySelectorAll(this.data.target);
			if (nodes.length)
				target = nodes[Math.floor(Math.random() * nodes.length)];
			else
				console.log("teleport-button: target=", this.data.target, " not found");
		}

		target.object3D.getWorldPosition(this.target);
		this.target.add(this.data.offset);

		console.log("teleport-button: ", this.target);

		teleport(this.target.x, this.target.y, this.target.z);
	},
});

function teleport(x,y,z)
{
	const player = AFRAME.scenes[0].systems["hubs-systems"].characterController;
	const target = new THREE.Vector3(x,y,z);
	player.teleportTo(target);
}
