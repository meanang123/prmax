//-----------------------------------------------------------------------------
// Name:    Form.js
// Author:  Chris Hoy
// Purpose: extendsion of the basic form comonent of dojo
// Created: 01/02/2008
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("ttl.Form");

dojo.require("dijit.form.Form");

dojo.declare(
	"ttl.Form",
	[dijit.form.Form],
	{
		// This function replace the std form isvalid
		// it ignores disabled fields for validation it those that can be focus
		// on
		formid:"",
		isValid:function()
		{
			return dojo.every(this.getDescendants(),
			function(widget){
	 			var rest = !widget.isValid || widget.isValid();
				if ( rest == false )
				{
					if (widget.isFocusable())
						widget.focus();
					else
						rest = true ;
				}
				return rest;
	 		});
		},
		setExtendedMode:function(extendedmode)
		{
			// set the mode og get for each of the sub widgets
			dojo.forEach(this.getDescendants(), function(widget){
					if(!widget.name){ return; }
					widget.set("extended",extendedmode);
			});
		}
	}
);

