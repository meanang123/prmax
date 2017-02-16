//-----------------------------------------------------------------------------
// Name:    DlgCtrl2.js
// Author:  Chris Hoy
// Purpose:
// Created: 11/08/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.DlgCtrl2");

dojo.declare("prmax.DlgCtrl2", null,
	{
		constructor: function(style)
		{
			this.style = style;////||"width:20em;height:25em";
			this._Create();
		},
		_Create:function()
		{
			var node = document.createElement("div");
			document.body.appendChild(node);
			this._dialog = new dijit.Dialog({
							title:"",
							style:this.style},
				node);
		},
		set:function( method ,  value )
		{
			if ( method=="content")
				this._dialog.set("content",value);
		},
		show:function(intitle)
		{
			this._dialog.set("title",intitle||"Missing Title");
			this._dialog.show();
		},
		hide:function()
		{
			this._dialog.hide();
		}
	}
);





