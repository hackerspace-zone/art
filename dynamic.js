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

		let room = url.searchParams.get('room');
		if (room)
		{
			// there is an explicit room on the query string;
			// probably a dev test setup, so do not change host
		} else
		if (typeof APP != 'undefined')
		{
			// Running under hubs, retrieve the room id from the name
			if (APP.hub.hub_id)
				room = APP.hub.hub_id;
		} else {
			console.log("NO DYNAMIC CONTENT");
			return;
		}

		let html_src = host + room + ".html";
		console.log("loading dynamic content: ", html_src);

		// attempt to load the remote HTML and replace
		// the entity that created this with the new file.
		fetch(html_src).then((response) => {
			if (!response.ok)
				throw new Error("fetch("+src+") failed");
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
