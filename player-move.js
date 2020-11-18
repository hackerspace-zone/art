/*
 * Move and rotate a player to a position and heading, accounting for
 * the VR or POV so that they are in the correct location.
 */
AFRAME.registerComponent('player-move', {
	schema: {
	},

	init: function()
	{
		NAF.connection.subscribeToDataChannel("player-move", (sender,type,detail,target) => {
			//console.log(sender,type,detail,target);
			this.el.sceneEl.emit("player-move", detail);
		});

		this.pov_position = new THREE.Vector3();
		this.rig_position = new THREE.Vector3();
		this.position = new THREE.Vector3();

		this.player_move = this.player_move.bind(this);
		this.el.sceneEl.addEventListener('player-move', this.player_move);
		console.log("player-move: init");
	},

	remote_player_move: function (detail)
	{
		// if received this as a message, just discard it
		if (detail.remote)
			return;

		// this is from the local client, so get the remote id of the object
		// and send the message over the channel have the remote id
		const new_detail = {
			remote: true,
			clientId: detail.clientId,
			position: detail.position,
			rotation: detail.rotation,
		};

		console.log("player-move: ", new_detail.clientId, new_detail.position, new_detail.rotation);
		NAF.connection.broadcastDataGuaranteed("player-move", new_detail);
	},

	player_move: function (evt)
	{
		const detail = evt.detail;

		if (detail.clientId != NAF.clientId)
			return this.remote_player_move(detail);
			
		// Message for us, either local or remote
		// Get the avatar rig and relocate it
		const player = AFRAME.scenes[0].systems["hubs-systems"].characterController;

		const pov = player.avatarPOV.object3D;
		const rig = player.avatarRig.object3D;

		pov.getWorldPosition(this.pov_position);
		const rig_angle = (detail.rotation - pov.rotation.y) * 180 / Math.PI;
		console.log("pov-before=", this.pov_position, detail.rotation * 180/Math.PI, pov.rotation.y * 180/Math.PI, rig_angle);

		// for VR the POV rotation is constantly being updated
		// by the headset.  So we adjust the rig rotation opposite
		// the desired rotation, which leaves the headset facing
		// the correct angle.  For flat screens the POV might have
		// been adjusted with the q/e rotate keys, so it works here too.
		// rig.rotation.y = ... doesn't seem to update the matrices until
		// the next cycle, so use the slower set attribute here

		player.avatarRig.setAttribute("rotation", {
			x: 0,
			y: rig_angle,
			z: 0,
		});

/*
		// convert the rig and pov positions into world coordinates
		// so that the offset from the pov to the rig can be measured
		rig.getWorldPosition(this.rig_position);
		pov.getWorldPosition(this.pov_position);
		console.log("pov-after=", this.pov_position);
		this.pov_position.sub(this.rig_position);
		console.log("pov-offset=", this.pov_position);

		console.log(detail.position, pov.position, this.position, detail.rotation, rig.rotation.y);

		// subtract out the distance from the pov to the current position,
		// which will shift the desired position to be back at the
		// center of their VR space.
		// for flat screens the POV position delta is 0, so this is a NOP.
		this.position.x = detail.position.x - this.pov_position.x;
		this.position.y = detail.position.y; // y will be fixed by teleportTo()
		this.position.z = detail.position.z - this.pov_position.z;

		console.log("teleportTo: ", this.position, detail.rotation);
		//player.teleportTo(this.position);
		rig.position.x = this.position.x;
		rig.position.y = this.position.y;
		rig.position.z = this.position.z;
		rig.matrixNeedsUpdate = true;
*/
		this.position.x = detail.position.x;
		this.position.y = detail.position.y;
		this.position.z = detail.position.z;
		player.teleportTo(this.position);
	},
});

function players()
{
	const players = document.querySelectorAll("a-entity[player-info]");
	return players;
}
