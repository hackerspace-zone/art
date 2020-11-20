/*
 * Emergency Meeting button that summons all of the avatars
 * to a circle around the button.  The actual motion is handled
 * by a player-move component.
 */
AFRAME.registerComponent('meeting-button', {
	schema: {
		targets: {type:'selector', default:'a-entity[player-info]', },
		cooldown: {type:'number', default:5000, },
		radius: {type:'number', default:2.0, },
		message: {type:'string', default:"EMERGENCY MEETING!" },
	},

	init: function()
	{
		this.time = 0;
		this.clicktime = 0;
		this.available = 1;
		this.was_available = 0;
		this.pos = new THREE.Vector3();
		this.onClick = this.onClick.bind(this);
		this.el.object3D.addEventListener('interact', this.onClick);

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

		this.el.setAttribute("opacity", 0 );

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
		this.el.setAttribute("opacity", 1 );
	},

	/*
	 * Relocate all of the players to be in a circle around the button
	 */
	meeting: function()
	{
		const players = document.querySelectorAll("a-entity[player-info]");
		const num = players.length;
		if (num == 0)
			return;

		const r = this.data.radius;
		let step = Math.PI * 2 / num;

		// start at the current angle of the first player, which should
		// be the local player.  that way they don't feel like they move.
		let angle = players[0].object3D.rotation.y;

		// this should be done in world coords, since the players are in world coords,
		// but the item that initiats the meeting might be in a nested group
		this.el.object3D.getWorldPosition(this.pos);

		for(player of players)
		{
			// circle around the position of the box,
			// looking at the box, up is the positive y axis.
			// heading 0 is negative z axis, heading 90 is negative x axis
			//  0 => z=+1, x=0
			// 90 => z=0, x=+1
			this.el.sceneEl.emit("player-move", {
				clientId: NAF.utils.getNetworkOwner(player),
				position: {
					x: this.pos.x + r * Math.sin(angle),
					y: this.pos.y,
					z: this.pos.z + r * Math.cos(angle),
				},
				rotation: angle, // radians
			});

			angle += step;
		}

		window.APP.hubChannel.sendMessage(this.data.message, "chat");
	},
});

function meeting()
{
	document.querySelectorAll("#button1")[0].components["meeting-button"].meeting()
}
