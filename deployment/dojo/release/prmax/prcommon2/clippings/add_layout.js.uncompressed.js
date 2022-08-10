require({cache:{
'url:prcommon2/clippings/templates/add_layout.html':"<div>\r\n    <form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"onSubmit\":\"return false\"'>\r\n<!--        <input data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"icustomerid\" data-dojo-props='\"class\":\"prmaxhidden\", name:\"icustomerid\",type:\"text\"'/>\r\n-->\r\n        <table width=\"100%\" class=\"prmaxtable\" >\r\n            <tr><td align=\"right\" width=\"20%\" class=\"prmaxrowtag\"><label>Layout</label></td><td><input data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"emaillayoutid\" data-dojo-props='required:true,name:\"emaillayoutdescription\",trim:true,type:\"text\"'></td></tr>\r\n        \r\n            <tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"right\"><button data-dojo-attach-event=\"onClick:_save\" data-dojo-attach-point=\"savebtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Saving...\",label:\"Save\",\"class\":\"btnright\"'></button></td></tr>\r\n\r\n        </table></br></br>\r\n    </form></br></br>\r\n    \r\n</div>\r\n\r\n"}});
//-----------------------------------------------------------------------------
// Name:    ReportBuilder.js
// Author:  
// Purpose:
// Created: Sept 2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/clippings/add_layout", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/add_layout.html",
	"ttl/utilities2",
	"dojo/topic",	
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dojox/form/PasswordValidator",
	"dijit/form/SimpleTextarea"	
	],
	function(declare, BaseWidgetAMD, template, utilities2, topic, request, lang, domstyle, domattr, domclass, ItemFileReadStore){

 return declare("prcommon2.clippings.add_layout",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._save_call_back = dojo.hitch(this,this._save_call);

		this._emaillayout = new ItemFileReadStore({ url:"/common/lookups?searchtype=emaillayout"});
//		this._customerid = PRMAX.utils.settings.cid;	
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.emaillayoutid.set("store",this._emaillayout);		
	},
	load:function ( dialog, customerid)
	{
		this._dialog = dialog;
//		this.icustomerid.set("value", customerid);
	},
	_save:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.savebtn.cancel();
			return false;
		}

		var data = this.form.get("value");

		request.post("/emaillayout/save",
				utilities2.make_params({ data : data})).
				then(this._save_call_back);
	},
	_save_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Email Layout Added");
			this.savebtn.cancel();
			this._dialog.hide();
			topic.publish('/emaillayout/add', [response.data]);
		}
		else
		{
			alert("Problem Adding Email Layout");
		}
		this.savebtn.cancel();
	},	
	
});
});
