//-----------------------------------------------------------------------------
// Name:    Form.js
// Author:  Chris Hoy
// Purpose: extendsion of the basic form comonent of dojo
// Created: 01/02/2008
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"dijit/form/Form",
	], function(declare, Form ){
 return declare("ttl.Form2",
	[Form],
	{
		// This function replace the std form isvalid
		// it ignores disabled fields for validation it those that can be focus
		// on
		formid:"",
		isValid:function()
		{
			return dojo.every(this.getChildren(),
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
			dojo.forEach(this.getChildren(), function(widget){
					if(!widget.name){ return; }
					widget.set("extended",extendedmode);
			});
		}
});
});

