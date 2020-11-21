/*
 * Apply a template to an object.
 */
AFRAME.registerComponent('template', {
	schema: {
		src: { type:'selector', default:null, },
	},

	init: function()
	{
		if (!this.data.src)
			return;
		this.el.appendChild(document.importNode(this.data.src.content, true));
	},
});
