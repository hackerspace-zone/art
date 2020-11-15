/*
 * Emergency Meeting button that summons all of the avatars
 * to a circle around the button.
 */
AFRAME.registerComponent('meeting-button', {
	schema: {
		targets: {type:'selector', default:'a-entity[player-info]', },
		cooldown: {type:'number', default:5000, },
		radius: {type:'number', default:2.0, },
	},

	init: function()
	{
		this.time = 0;
		this.clicktime = 0;
		this.available = 1;
		this.was_available = 0;
		this.onClick = this.onClick.bind(this);
		this.el.object3D.addEventListener('interact', this.onClick);
		this.position = new THREE.Vector3();
		this.rig_position = new THREE.Vector3();

		NAF.connection.subscribeToDataChannel("player_move", (sender,type,detail,target) => {
			//console.log(sender,type,detail,target);
			this.el.sceneEl.emit("player_move", detail);
		});

		this.el.sceneEl.addEventListener('player_move', (evt) => {
			const detail = evt.detail;
			if (detail.clientId != NAF.clientId)
				return;

			// Message for us: Get the avatar rig and relocate it
			const player = AFRAME.scenes[0].systems["hubs-systems"].characterController;
			const pov = player.avatarPOV.object3D;
			const rig = player.avatarRig.object3D;

			// for VR the POV rotation is constantly being updated
			// by the headset.  So we adjust the rig rotation opposite
			// the desired rotation, which leaves the headset facing
			// the correct angle.  For flat screens the POV might have
			// been adjusted with the q/e rotate keys, so it works here too.
			// rig.rotation.y = ... doesn't seem to update the matrices until
			// the next cycle, so use the slower set attribute here
			player.avatarRig.setAttribute("rotation", {
				x: 0,
				y: (detail.rotation - pov.rotation.y) * 180 / Math.PI ,
				z: 0,
			});

			// convert the rig and pov positions into world coordinates
			// so that the offset from the pov to the rig can be measured
			rig.getWorldPosition(this.rig_position);
			pov.getWorldPosition(this.position);
			this.position.sub(this.rig_position);

			console.log(detail.position, pov.position, this.position, detail.rotation, rig.rotation.y);

			// subtract out the distance from the pov to the current position,
			// which will shift the desired position to be back at the
			// center of their VR space.
			// for flat screens the POV position delta is 0, so this is a NOP.
			this.position.x = detail.position.x - this.position.x;
			this.position.y = detail.position.y; // y will be fixed by teleportTo()
			this.position.z = detail.position.z - this.position.z;

			player.teleportTo(this.position);

		});

		console.log("meeting button init!")
	},

	onClick: function(evt)
	{
		console.log("CLICKED");
		if (!this.available)
			return;

		this.clicktime = this.time;
		this.available = false;

		console.log("activated");
		this.el.emit("activated");
/*
		this.el.setAttribute("animation", {
			property: 'material.opacity',
			from: 1.0,
			to: 0.0,
			dur: 100,
			loop: 0,
		});
*/
		this.el.setAttribute("animation", {
			property: 'material.opacity',
			from: 0.0,
			to: 1.0,
			dur: this.data.cooldown,
			loop: 0,
		});

		// move everyone to a circle around it
		this.meeting();
	},

	tick: function(time, dt)
	{
		this.time = time;
		if (this.available)
			return;

		const next_available = time - this.clicktime > this.data.cooldown;
		if (!next_available)
			return;

		// the cooldown timer has expired, mark it as available again
		this.available = true;
		this.el.emit("available");
	},

	/*
	 * Relocate all of the players to be in a circle around the button
	 */
	meeting: function()
	{
		// this perhaps should be done in world coords, but then
		// the player also has to be transformed and then it gets weird
		let pos = new THREE.Vector3();
		this.el.object3D.getWorldPosition(pos);
		//let pos = this.el.object3D.position;

		const players = document.querySelectorAll("a-entity[player-info]");
		const num = players.length;
		if (num == 0)
			return;

		const r = this.data.radius;
		let step = Math.PI * 2 / num;
		let angle = Math.random() * Math.PI * 2;

		for(p of players)
		{
			// circle around the position of the box,
			// looking at the box, up is the y axis
			const player_angle = angle;
			angle += step;

			NAF.utils.getNetworkedEntity(p).then(player => {
				const clientId = NAF.utils.getNetworkOwner(player);
				console.log(clientId);
				const detail = {
					clientId: clientId,
					position: {
						x: pos.x - r * Math.cos(player_angle),
						y: pos.y,
						z: pos.z + r * Math.sin(player_angle),
					},
					rotation: player_angle - Math.PI/2,
				};

				if (clientId == NAF.clientId)
					this.el.sceneEl.emit("player_move", detail);
				else
					NAF.connection.broadcastDataGuaranteed("player_move", detail);
			});

		}
	},
});

function players()
{
	const players = document.querySelectorAll("a-entity[player-info]");
	return players;
}

function meeting()
{
	document.querySelectorAll("#button1")[0].components["meeting-button"].meeting()
}
