/*
 * Emergency Meeting button that summons all of the avatars
 * to a circle around the button.
 */
AFRAME.registerComponent('meeting-button', {
	schema: {
		targets: {type:'selector', default:'a-entity[player-info]', },
		cooldown: {type:'number', default:1000, },
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

		NAF.connection.subscribeToDataChannel("player_move", (sender,type,detail,target) => {
			console.log(sender,type,detail,target);
			this.el.sceneEl.emit("player_move", detail);
		});

		this.el.sceneEl.addEventListener('player_move', (evt) => {
			console.log(evt);
			const detail = evt.detail;
			if (detail.clientId != NAF.clientId)
				return;

			// Message for us: Get the avatar rig and relocate it
			const player = document.querySelectorAll("#avatar-rig")[0];

			player.object3D.position.set(detail.position.x, detail.position.y, detail.position.z);
			player.object3D.rotation.set(detail.rotation.x, detail.rotation.y, detail.rotation.z);
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
		let angle = 0;

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
						x: pos.x + r * Math.cos(player_angle),
						y: pos.y,
						z: pos.z - r * Math.sin(player_angle),
					},
					rotation: {
						x: 0,
						y: player_angle + Math.PI,
						z: 0,
					},
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
