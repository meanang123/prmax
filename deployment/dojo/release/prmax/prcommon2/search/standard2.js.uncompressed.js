require({cache:{
'url:prcommon2/search/templates/standard.html':"<table width=\"99%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\r\n<tr><td width=\"20%\" ><span class=\"prmaxrowtag\">${displayname}</span></td>\r\n<td width=\"60%\" ><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='style:\"width:100%\",\"class\":\"prmaxinput\",type:\"text\",trim:true,maxlength:255' data-dojo-attach-point=\"datanode\" data-dojo-attach-event=\"onBlur:_on_change\"  /></td>\r\n<td align=\"right\"><div data-dojo-attach-point=\"countnode\" data-dojo-type=\"prcommon2/search/SearchCount\"></div></td></tr></table >\r\n"}});
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

define("prcommon2/search/standard2", [
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





