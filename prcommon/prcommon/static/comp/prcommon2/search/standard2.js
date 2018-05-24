//-----------------------------------------------------------------------------
// Name:    standard2.js
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
	"dojo/_base/lang",
	"dijit/form/TextBox",
	"prcommon2/search/SearchCount"
	], function(declare, BaseWidgetAMD, template, std_search, lang){
return declare("prcommon2.search.standard2",
	[BaseWidgetAMD,std_search],{
	templateString: template,
	testmode:false,
	constructor: function()
	{
		this._OnInputCallBack = lang.hitch(this,this._OnInput)
	},
	postCreate:function()
	{
		// capture the key strokes
		if(dojo.isMoz || dojo.isOpera)
		{
			// firefox used a single operation
			this.connect(this.dataNode.textbox, "oninput", this._OnInputCallBack);
		}
		else
		{
			// ie etc need to capture a number of events
			this.connect(this.dataNode.textbox, "onkeyup", this._OnInputCallBack);
			this.connect(this.dataNode.textbox, "onpaste", this._OnInputCallBack);
			this.connect(this.dataNode.textbox, "oncut", this._OnInputCallBack);
		}
	},
	// Key Pressed handler
	_OnInput:function()
	{
		this._get_selector( this.dataNode.get("value") );
	},
	// focus event to make sure that as may chnaged are captured as possible
	_onChange:function()
	{
		this._get_selector(this.dataNode.get("value"));
	},
	// styandard clear function
	Clear:function()
	{
		this.dataNode.set("value","");
		this._value="";
		this._setdisplay(this._value);
		this.inherited(arguments);
	},
	_setValueAttr:function( value )
	{
		this.dataNode.set("value",value);
	},
	_getValueAttr:function( value )
	{
		this.value = this.dataNode.get("value");
		return this.value;
	},
	focus:function()
	{
		this.dataNode.focus();
	},
	_CaptureExtendedContent:function(stdfields)
	{
		try
		{
			return lang.mixin(stdfields,{
				partial:this.usepartial?2:0,
				private_only:0
				});
		}
		catch(e) { alert(e); }
	}
});
});





