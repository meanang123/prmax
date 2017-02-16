//-----------------------------------------------------------------------------
// Name:    DlgCtrl.js
// Author:  Chris Hoy
// Purpose:
// Created: 11/08/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.DlgCtrl");

dojo.declare("prmax.DlgCtrl", null,
	{
		// Arguments required
		// dlg_name_tag
		// dlg_title
		// controller_id
		// url
		constructor: function(settings)
		{
			this.onShowCall = dojo.hitch(this,this._onShow);
			this.onLoadcall = dojo.hitch(this,this._onLoad);
			this.dialog_id = settings['dlg_id'];
			this.dialog_title = settings['dlg_title'];
			this.controller_id = settings['controller_id'];
			this.url = settings['url'];
			this.style = settings['style']||"width:40em;height:45em";
			this.controller_context=settings['controller_context'];

			var tmp = new dijit.Dialog();
			this.showd = tmp.show;
			this.dialog = undefined;
		},
		_onLoad:function()
		{
			this.control = dijit.byId(this.controller_id);
			if (this.control)
			{
				this.control.Clear();
				this.control.Load(this.controller_context);
			}
		},
		_onShow:function()
		{
			this.control = dijit.byId(this.controller_id);
			if (this.control) this._onLoad();
			var d = dijit.byId(this.dialog_id);
			this.showd.call(d,arguments);
		},
		showDialog:function()
		{
			this.dialog = dijit.byId(this.dialog_id);
			if ( this.dialog == undefined )
			{
				var node = document.createElement("div");
				document.body.appendChild(node);
				a = {	id:this.dialog_id,
						href:this.url,
						title:this.dialog_title,
						style:this.style,
						show: this.onShowCall,
						onLoad:this.onLoadcall};
				console.log(a);
				var ww = new dijit.Dialog(
					a,
					node);
			}
			this.dialog = dijit.byId(this.dialog_id);
			this.dialog.show();
		}
	}
);





