/*
 * 3D snake routine
 */
AFRAME.registerComponent('snake', {
	schema: {
		dim: {type:'number', default:10, },
		speed: {type:'number', default:0.5, },
	},

	init: function()
	{
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

		this.pos = new THREE.Vector3(0,0,0);
		this.last_add = 0;
	},

	tick: function(time, dt)
	{
		// convert from ms to seconds
		dt /= 1000;

		if (time - this.last_add)
		{
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

		// this location is free
		let cube = document.createElement('a-box');
		cube.setAttribute('position', {
			x: nx,
			y: ny,
			z: nz,
		});
		cube.setAttribute('material', {
			src: '#snake-texture',
			color: '#c00080',
		});

		console.log("new cube ", nx, ny, nz);
		this.el.appendChild(cube);
		this.used[nx][ny][nz] = cube;
		this.pos.x = nx;
		this.pos.y = ny;
		this.pos.z = nz;
		return true;
	},

	add: function()
	{
		for(let i=0 ; i < 20 ; i++)
		{
			if (this.trial_add())
				break;
		}
	}
});
