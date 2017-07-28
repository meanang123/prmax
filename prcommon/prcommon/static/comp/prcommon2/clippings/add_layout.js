//-----------------------------------------------------------------------------
// Name:    ReportBuilder.js
// Author:  
// Purpose:
// Created: Sept 2016
//
// To do:
//
//-----------------------------------------------------------------------------

define([
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
