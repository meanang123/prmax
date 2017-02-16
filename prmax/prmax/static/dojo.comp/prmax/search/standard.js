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
dojo.provide("prmax.search.standard");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.require("dijit.form.TextBox");
dojo.require("prcommon.search.std_search");

dojo.declare("prmax.search.standard",
	[ prcommon.search.std_search,dijit._Widget, dijit._Templated, dijit._Container],
	{
		testmode:false,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.search","templates/standard.html"),
		constructor: function()
		{
			this._OnInputCallBack = dojo.hitch(this,this._OnInput)
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
			this._Get( this.dataNode.get("value") );
		},
		// focus event to make sure that as may chnaged are captured as possible
		_onChange:function()
		{
			this._Get(this.dataNode.get("value"));
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
		}
	}
);





