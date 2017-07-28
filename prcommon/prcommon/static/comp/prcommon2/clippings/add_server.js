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
	"dojo/text!../clippings/templates/add_server.html",
	"ttl/utilities2",
	"dojo/topic",	
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dojox/form/PasswordValidator"
	],
	function(declare, BaseWidgetAMD, template, utilities2, topic, request, lang, domstyle, domattr, domclass, ItemFileReadStore){

 return declare("prcommon2.clippings.add_server",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._save_call_back = dojo.hitch(this,this._save_call);
		this._send_test_call_back = dojo.hitch(this,this._send_test_call);

		this._servertypes = new ItemFileReadStore({ url:"/common/lookups?searchtype=servertypes"});
		this._customerid = PRMAX.utils.settings.cid;	
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.servertypeid.set("store",this._servertypes);		
	},
	load:function ( dialog, customerid)
	{
		this._dialog = dialog;
		this.customerid.set("value", customerid);
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

		request.post("/customeremailserver/add",
				utilities2.make_params({ data : data})).
				then(this._save_call_back);
	},
	_save_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Email Server Added");
			this.savebtn.cancel();
			this._dialog.hide();
			topic.publish('customeremailserver/add', [response.data]);
		}
		else
		{
			alert("Problem Adding Email Server");
		}
		this.savebtn.cancel();
	},	
	_send_test:function()
	{
	
		var data = {};
		data['customerid'] = this._customerid;
		data['fromemailaddress'] = this.fromemailaddress.get("value");
		data['host'] = this.servertypeid.get("value");
		data['hostname'] = this.servertypeid.get("name");
		data['username'] = this.username.get("value");
		data['password'] = this.password.get("value");
		request.post("/emails/email_test_server",
				utilities2.make_params({ data : data})).
				then(this._send_test_call_back);	
	
	},
	_send_test_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Test email has been sent");
			this.sendtestbtn.cancel();
		}
		else
		{
			alert("Problem Sending Test Email");
		}
		this.sendtestbtn.cancel();
	},	
	
	
});
});
