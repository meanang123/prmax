//-----------------------------------------------------------------------------
// Name:    ReportBuilder.js
// Author:  
// Purpose:
// Created: Sept 2016
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prcommon.clippings.add_server");

dojo.require("dojo.data.ItemFileWriteStore");

dojo.declare("prcommon.clippings.add_server",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.clippings","templates/add_server.html"),
	constructor: function()
	{
		this._save_call_back = dojo.hitch(this,this._save_call);
		this._send_test_call_back = dojo.hitch(this,this._send_test_call);

		this._servertypes = new dojo.data.ItemFileWriteStore({ url:"/common/lookups?searchtype=servertypes"});
		this._customerid = PRMAX.utils.settings.cid;	
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.servertypeid.store = this._servertypes;		
	},
	load:function ( dialog, customerid)
	{
		this._dialog = dialog;
		this.customerid.set("value", customerid);
	},
	_save:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.savebtn.cancel();
			return false;
		}

		var data = this.form.get("value");
		data['password'] = this.password.value;

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._save_call_back,
						url:"/customeremailserver/add" ,
						content: data
						}));
						
	},
	_save_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Email Server Added");
			this.savebtn.cancel();
			this._dialog.hide();
			dojo.publish('customeremailserver/add', [response.data]);
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
		data['password'] = this.password.value;

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._send_test_call_back,
						url:"/emails/email_test_server" ,
						content: data
						}));
						
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
