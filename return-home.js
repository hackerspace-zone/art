/*
 * Move an object back to its home position after a timeout or
 * when it receives a "return-home" event.
 */
AFRAME.registerComponent('return-home', {
	schema: {
		delay: { type:'number', default:10000 },
		travelTime: { type:'number', default:1000 },
	},

	init: function()
	{
		this.position = new THREE.Vector3();
		this.time = 0;
		this.lastTime = 0;
		this.returnHome = this.returnHome.bind(this);
		this.el.object3D.addEventListener('return-home', this.returnHome);
		this.el.object3D.addEventListener('interact', this.resetTimer);
	},

	tick: function(time,dt)
	{
		const delta = time - this.lastTime;
		this.time = time;

		if (delta > this.delay)
			this.travelHome();
	},

	resetTimer: function()
	{
		this.lastTime = time;
		console.log("return-home: resetTimer ", this.el);
	},

	returnHome: function(evt)
	{
		console.log("return-home: ", this.el, this.position );
		this.lastTime = this.time;

		this.el.setAttribute('animation', {
			property: 'position',
			to: this.position,
			dur: this.data.travelTime,
			loop: 0,
		});
	},
});
