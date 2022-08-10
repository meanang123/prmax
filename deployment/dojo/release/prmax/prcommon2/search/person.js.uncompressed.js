require({cache:{
'url:prcommon2/search/templates/person.html':"<table width=\"99%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" >\r\n<tr>\r\n<td width=\"20%\" ><span class=\"prmaxrowtag\">Surname</span></td>\r\n<td width=\"40%\" ><input data-dojo-props='type:\"text\",trim:true,maxlength:\"84\",style:\"width:90%\",\"class\":\"prmaxinput\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"data_surname\" data-dojo-attach-event=\"onBlur:_onChange\" /></td>\r\n<td width=\"10%\" ><span class=\"prmaxrowtag\">Firstname</span></td>\r\n<td width=\"20%\" ><input data-dojo-props='type:\"text\",trim:true,maxlength:\"10\",style:\"width:90%\",\"class\":\"prmaxinput\",disabled:true' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"data_firstname\" data-dojo-attach-event=\"onBlur:_onChange\" /></td>\r\n<td align=\"right\"><div data-dojo-attach-point=\"countnode\" data-dojo-type=\"prcommon2/search/SearchCount\"></div></td></tr></table >\r\n"}});
//-----------------------------------------------------------------------------
// Name:    person.js
// Author:  Chris Hoy
// Purpose:
// Created: 16/01/2017
//
// To do:
//
//-----------------------------------------------------------------------------
define("prcommon2/search/person", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/person.html",
	"prcommon2/search/std_search",
	"dojo/_base/lang",
	"dijit/form/TextBox",
	"prcommon2/search/SearchCount"
	], function(declare, BaseWidgetAMD, template, std_search, lang){
return declare("prcommon2.search.person",
	[BaseWidgetAMD,std_search],{
	templateString: template,
	testmode:false,
	constructor: function()		
	{
		this._on_input_call_back = lang.hitch(this,this._on_input)
	},
	postCreate:function()
	{
		// capture the key strokes
		if(dojo.isMoz || dojo.isOpera)
		{
			// firefox used a single operation
			this.connect(this.data_surname.textbox, "oninput", this._on_input_call_back);
			this.connect(this.data_firstname.textbox, "oninput", this._on_input_call_back);
		}
		else
		{
			// ie etc need to capture a number of events
			this.connect(this.data_surname.textbox, "onkeyup", this._on_input_call_back);
			this.connect(this.data_surname.textbox, "onpaste", this._on_input_call_back);
			this.connect(this.data_surname.textbox, "oncut", this._on_input_call_back);
			this.connect(this.data_firstname.textbox, "onkeyup", this._on_input_call_back);
			this.connect(this.data_firstname.textbox, "onpaste", this._on_input_call_back);
			this.connect(this.data_firstname.textbox, "oncut", this._on_input_call_back);
		}
	},
	// Key Pressed handler
	_on_input:function()
	{
		this._enable_controls();
		this._get_selector(this._get_data());
	},
	// focus event to make sure that as may chnaged are captured as possible
	_onChange:function()
	{
		this._get_selector(this._get_data());
	},
	// standard clear function
	Clear:function()
	{
		this.data_surname.set("value","");
		this.data_firstname.set("value","");
		this._value="";
		this._setdisplay(this._value);
		this._enable_controls();
		this.inherited(arguments);
	},
	_setValueAttr:function( value )
	{
		if ( value == "" || value == null)
		{
			this.data_surname.set("value","");
			this.data_firstname.set("value","");
		}
		else
		{
			this.data_surname.set("value",value.data.surname);
			this.data_firstname.set("value",value.data.firstname);
		}
	},
	_getValueAttr:function( value )
	{
		return this._get_data();
	},
	focus:function()
	{
		this.data_surname.focus();
	},
	_get_data:function()
	{
		var data = {
			surname: this.data_surname.get("value"),
			firstname : this.data_firstname.get("value")
			}

		var obj = {data:data,logic:2};

		if (this._extended)
		{
			return obj;
		}
		else
		{
			var data = "";
			if (obj["data"]["surname"].length>0)
				data = dojo.toJson(obj);

			this.value = data;
			this._enable_controls();
			return data ;
		}
	},
	_enable_controls:function()
	{
		var data = this.data_surname.get("value");

		if (data.length>0)
		{
			this.data_firstname.set("disabled", false);
		}
		else
		{
			this.data_firstname.set("value", "");
			this.data_firstname.set("disabled", true);
		}
	}
});
});





