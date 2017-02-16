//-----------------------------------------------------------------------------
// Name:    standard.js
// Author:  Chris Hoy
// Purpose: basic search field, This is a standard text field should be overridden
//			for ther fields such as dropdown list etc
// Created: 27/05/2008
//
// To do:
//			1. css settings for each field
//			2. use of table for layout to fixed?

//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/standard.html",
	"prcommon2/search/std_search",
	"dijit/form/TextBox",
	"prcommon2/search/SearchCount"
	], function(declare, BaseWidgetAMD, template,std_search){
 return declare("prcommon2.search.standard",
	[BaseWidgetAMD,std_search],{
	templateString: template,
	testmode:false,
	constructor: function()
	{
		this._on_input_call_back = dojo.hitch(this,this._on_input)
	},
	postCreate:function()
	{
		// capture the key strokes
		if(dojo.isMoz || dojo.isOpera)
		{
			// firefox used a single operation
			this.connect(this.datanode.textbox, "oninput", this._on_input_call_back);
		}
		else
		{
			// ie etc need to capture a number of events
			this.connect(this.datanode.textbox, "onkeyup", this._on_input_call_back);
			this.connect(this.datanode.textbox, "onpaste", this._on_input_call_back);
			this.connect(this.datanode.textbox, "oncut", this._on_input_call_back);
		}
	},
	// Key Pressed handler
	_on_input:function()
	{
		this._get_selector( this.datanode.get("value") );
	},
	// focus event to make sure that as may chnaged are captured as possible
	_on_change:function()
	{
		this._get_selector(this.datanode.get("value"));
	},
	// styandard clear function
	clear:function()
	{
		this.datanode.set("value","");
		this._value="";
		this._setdisplay(this._value);
		this.inherited(arguments);
	},
	_setValueAttr:function( value )
	{
		this.datanode.set("value",value);
	},
	_getValueAttr:function( value )
	{
		this.value = this.datanode.get("value");
		return this.value;
	},
	focus:function()
	{
		this.datanode.focus();
	}
});
});





