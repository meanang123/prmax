// wrapped by build app
define("ttl/TextBox", ["dijit","dojo","dojox","dojo/require!dijit/form/TextBox"], function(dijit,dojo,dojox){
//-----------------------------------------------------------------------------
// Name:    OrderRow.js
// Author:  Chris Hoy
// Purpose: 
// Created: 28/03/2008
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("ttl.TextBox");

dojo.require("dijit.form.TextBox");

dojo.declare("ttl.TextBox", 
	[ dijit.form.TextBox],
	{
		_onKeyPress: function(e){
			ttl.TextBox.superclass._onKeyPress.call(this,e);		
			this.onChanged();
		},
		// event for character pressed
		onChanged:function() {},
		// verify is number
		isNumber: function()
		{
			return ttl.utilities.isNumber(this.getValue());
		},
		isValid:function()
		{
			if (this.isNumber()==false)
			{
				alert("Must be a number");
				return false;
			}
			return this.isNumber();
		}
		
	}
);
});
