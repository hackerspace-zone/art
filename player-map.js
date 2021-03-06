/*
 * Draw a map of all of the players in 3D.
 */
AFRAME.registerComponent('player-map', {
	schema: {
		query: {type:'string', default:"a-entity[player-info]"},
	},

	init: function()
	{
		this.players = {};

	},

	tick: function(time, dt)
	{
		const all_players = document.querySelectorAll(this.data.query);
		let player_map = {};

		// update the position of all of the children
		for(const player of all_players)
		{
			const id = player.id;
			const is_self = id == "avatar-rig";
			const pos = player.object3D.position;
			const rot = player.object3D.rotation;
			player_map[player.id] = player;

			if (id in this.players)
			{
				// update the minimap version of the player
				let mini = this.players[id];
				mini.setAttribute("position", pos);
				if (is_self)
					continue;

				// get the camera world coordinates
				let camera = player.children[0];
				camera.object3D.getWorldQuaternion(mini.object3D.quaternion);
				continue;
			}

			// new player, create a child for it
			let div = document.createElement('a-entity');
			div.setAttribute('position', pos);

			let cone = document.createElement('a-cone');
			cone.setAttribute('height', 2.5);
			cone.setAttribute('radius-top', 0.1);
			cone.setAttribute('radius-bottom', 2);
			cone.setAttribute('segments-radial', 5);
			if (is_self)
			{
				cone.setAttribute('material', "color: #00FF00");
			} else {
				cone.setAttribute('material', "color: #800080");
				cone.setAttribute('rotation', {
					"x": -90,
					"y": 0,
					"z": 0,
				});
				cone.setAttribute('tags', 'singleActionButton:true');
				cone.setAttribute('is-remote-hover-target', "");
				cone.setAttribute('teleport-button', {
					"target": "#" + id,
					"offset": "1 0 0",
				});
				cone.setAttribute('class', "interactable");
			}

			// add the name above it?

			// add it as a child of this element
			div.appendChild(cone);
			this.el.appendChild(div);
			this.players[id] = div;
			console.log("player-map: creating", player, div);
		}

		// delete any players who no longer exist
		for (let id in this.players)
		{
			if (id in player_map)
				continue;

			// player no longer exists; remove it from
			// our player list and delete the elements
			console.log("player-map: removing", this.players[id]);
			this.players[id].remove();
			delete this.players[id];
		}
	},
});

