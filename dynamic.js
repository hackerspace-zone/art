/*
 * Dynamic a-frame component loader based on the Hubs room name
 * or a query string with a room name.  Supports both localhost
 * loading for testing as well as 
 */
AFRAME.registerComponent('dynamic', {
	schema: {
		host: {type:'string', default:"", },
	},

	init: function()
	{
		let url = new URL(document.location);

		let host = url.searchParams.get('host');
		if (host)
			host = host + "/";
		else
		if (this.data.host != "")
			host = this.data.host + "/";
		else
			host = url.protocol + "//" + url.host + "/";

		// default to allowing the query string room to
		// override the hub id.
		let room = url.searchParams.get('room');

		// no specified room, check for a hub id
		if (!room)
			room = url.searchParams.get('hub_id');

		// try to use the first part of the URL as
		// a hub_id (assuming this is running under hubs)
		if (!room)
			room = url.pathname.split('/')[1];

		let html_src = host + room + ".html";
		console.log("loading dynamic content: ", html_src);

		// attempt to load the remote HTML and replace
		// the entity that created this with the new file.
		fetch(html_src).then((response) => {
			if (!response.ok)
				throw new Error("fetch("+html_src+") failed");
			return response.text();
		}).then((html) => {
			// look for any script tags and hoist them to the head,
			// fixing up the URL to add a host name
			let re = /^include "(.*?.js)";?$/mg;
			let match;
			let count = 0;
			while(match = re.exec(html))
			{
				let s = this.dynamic_js(host + match[1])
				count++;

				// when this javascript is done, replace
				// the HTML if it is the last script to load
				s.onload = () => {
					if (--count == 0)
						this.el.innerHTML = html;
				};
			}
				
			// if no scripts were found, replace the HTML now.
			if (count == 0)
			{
				console.log("immediately replacing innerHtml");
				this.el.innerHTML = html;
			}
		});
	},

	dynamic_js: function(url)
	{
		// add the JS to the head
		console.log('include ', url);
		let s = document.createElement("script");
		s.setAttribute("type", "text/javascript");
		s.setAttribute("src", url);
		document.head.appendChild(s);
		return s;
	},

	tick: function(time, dt)
	{
		// nothing to do per tick
	},
});
