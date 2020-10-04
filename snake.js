/*
 * 3D snake routine
 */
AFRAME.registerComponent('snake', {
	schema: {
		dim: {type:'number', default:10, },
		speed: {type:'number', default:500, },
		latest: {type:'selector', default:null, },
	},

	init: function()
	{
		console.log("creating snake");

		// allocate the array of used locations
		let dim = this.data.dim;
		this.used = []
		for(let x=-dim ; x <= dim ; x++)
		{
			this.used[x] = [];
			for(let y=-dim ; y <= dim ; y++)
			{
				this.used[x][y] = [];
				for(let z=-dim ; z <= dim ; z++)
					this.used[x][y][z] = 0;
			}
		}

		if (!this.pos)
			this.pos = new THREE.Vector3(0,0,0);

		this.last_add = 0;
		this.reinit = false;

		// delete any children that we might still have
		while(this.el.firstChild)
			this.el.removeChild(this.el.firstChild);
	},

	tick: function(time, dt)
	{
		// convert from ms to seconds
		dt /= 1000;

		if (time - this.last_add > this.data.speed)
		{
			if (this.reinit)
				this.init();

			//console.log("time=", time);
			this.last_add = time;
			this.add();
		}
	},

	trial_add: function()
	{
		// try to find a direction to go
		let nx = this.pos.x;
		let ny = this.pos.y;
		let nz = this.pos.z;

		let dir = Math.floor(Math.random() * 9);
		if (dir == 0) nx--; else
		if (dir == 1) nx++; else
		if (dir == 2) ny--; else
		if (dir == 3) ny++; else
		if (dir == 4) nz--; else
		if (dir == 5) nz++; else
		if (dir == 6) { if (nx > 0) nx--; else nx++; } else
		if (dir == 7) { if (ny > 0) ny--; else ny++; } else
		if (dir == 8) { if (nz > 0) nz--; else nz++; } else
		{
			// should never reach here
		}

		let dim = this.data.dim;
		if (nx == this.pos.x && ny == this.pos.y && nz == this.pos.z)
			return false;

		if (nx < -dim || dim < nx
		||  ny < -dim || dim < ny
		||  nz < -dim || dim < nz
		||  this.used[nx][ny][nz])
			return false;

		// this location is free; add two cubes from
		// the previous position to this one
		//console.log("new cube ", nx, ny, nz);
		this.add_cube(0.5, (this.pos.x + nx) / 2, (this.pos.y + ny) / 2, (this.pos.z + nz) / 2);
		this.add_cube(0.5, nx, ny, nz);

		this.used[nx][ny][nz] = true;
		this.pos.x = nx;
		this.pos.y = ny;
		this.pos.z = nz;
		return true;
	},

	add_cube: function(size,nx,ny,nz)
	{
		let cube = document.createElement('a-box');
		cube.setAttribute('position', {
			x: nx,
			y: ny,
			z: nz,
		});
		cube.setAttribute('width', size);
		cube.setAttribute('height', size);
		cube.setAttribute('depth', size);
		cube.setAttribute('material', {
			//src: '#snake-texture',
			color: '#c00080',
			transparent: true,
			opacity: 0.0,
		});
		cube.setAttribute('animation', {
			property: "material.opacity",
			from: 0.0,
			to: 1.0,
			dur: this.data.speed * 2,
			loop: 0,
		});

		this.el.appendChild(cube);

		if (this.data.latest)
			this.data.latest.setAttribute('position', {
				x: nx,
				y: ny,
				z: nz,
			});
	},

	add: function()
	{
		for(let i=0 ; i < 20 ; i++)
		{
			if (this.trial_add())
				return true;
		}

		// all done; flag that we need to re-init
		for(let child of this.el.children)
		{
			child.setAttribute('animation', {
				property: 'material.opacity',
				from: 1.0,
				to: 0.0,
				dur: this.data.speed * 10,
				loop: 0,
			});
		}

		// ensure that we won't reinit until the fade has happened
		this.last_add += this.data.speed * 15;
		this.reinit = true;

		return false;
	}
});
