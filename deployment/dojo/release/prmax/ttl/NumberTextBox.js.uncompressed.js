// wrapped by build app
define("ttl/NumberTextBox", ["dijit","dojo","dojox","dojo/require!dijit/form/NumberTextBox"], function(dijit,dojo,dojox){
//-----------------------------------------------------------------------------
// Name:    OrderRow.js
// Author:  Chris Hoy
// Purpose: 
// Created: 28/03/2008
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("ttl.NumberTextBox");

dojo.require("dijit.form.NumberTextBox");

dojo.declare("ttl.NumberTextBox", 
	[ dijit.form.NumberTextBox],
	{
		_onKeyPress: function(e){
			ttl.NumberTextBox.superclass._onKeyPress.call(this,e);		
			this.onChanged();
		},
		// event for character pressed
		onChanged:function() {}
	}
);
});
