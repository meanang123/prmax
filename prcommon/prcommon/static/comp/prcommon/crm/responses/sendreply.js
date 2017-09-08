//-----------------------------------------------------------------------------
// Name:    sendreply.js
// Author:  
// Purpose:
// Created: 25/08/2017
//
// To do:
//
//-----------------------------------------------------------------------------
//
dojo.provide("prcommon.crm.responses.sendreply");

dojo.require("prcommon.clippings.add_server");
dojo.require("prcommon.documents.upload");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("prmax.email.loadworddocument");
dojo.require("dijit.ProgressBar");

dojo.declare("prcommon.crm.responses.sendreply",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.responses","templates/sendreply.html"),
	constructor: function()
	{
		this._send_call_back = dojo.hitch(this, this._send_call);
		this._customerid = PRMAX.utils.settings.cid;
		this._customeremailserver =  new prcommon.data.QueryWriteStore({ url:"/common/lookups?searchtype=customeremailserver"});
		dojo.subscribe('customeremailserver/add', dojo.hitch(this, this._add_customeremailserver_event));
		this.userid = PRMAX.utils.settings.uid;
		this._contacthistoryid = '';

		dojo.subscribe(PRCOMMON.Events.Word_Html_Data, dojo.hitch(this,this._word_html_data_event));		
	},
	postCreate:function()
	{
		this.upload_doc_ctrl.Load(this.upload_doc_dlg);	
		this.inherited(arguments);
		this.customeremailserverid.set("store", this._customeremailserver);
	},
	load:function(dialog, subject, contacthistoryid)
	{
		this._dialog = dialog;	
		this.emailsubject.set("value", subject);
		this._contacthistoryid = contacthistoryid;
		this.emailbody.set("value", "");
	},
	_LoadWord:function()
	{
		this.upload_doc_ctrl.Clear();
		this.upload_doc_dlg.show();
	},
	_Close:function ( )
	{
		this.upload_doc_ctrl.Clear();
		this.upload_doc_dlg.hide();
	},	
	_word_html_data_event:function(html)
	{
		this.emailbody.set("value", html.html) ;
	},	
	_add_server:function()
	{
		this.add_server_dialog.show();
		this.add_server_ctrl.load(this.add_server_dialog, this._customerid);
	},
	_add_customeremailserver_event:function(data)
	{
		var servertype = {};
		servertype.id = data.customeremailserverid;
		servertype.name = data.fromemailaddress;
		this._customeremailserver.newItem(servertype);
		this.customeremailserverid.set("value", data.customeremailserverid);
	},	
	_send:function()
	{
		if (ttl.utilities.formValidator(this.form) == false)
		{
			alert("Please Enter Details");
			this.sendbtn.cancel();
			return false;
		}

		var content = this.form.get("value") ;
		content['userid'] = this.userid;
		content['contacthistoryid'] = this._contacthistoryid;
		this.sendbtn.makeBusy();

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._send_call_back,
			url:"/crm/update_response",
			content:content}));
	},
	_send_call:function(response)
	{
		if ( response.success=="OK")
		{
			dojo.publish("/crm/update_response", [response]);
			alert("Reply has been sent");
			this.sendbtn.cancel();
			this._dialog.hide();
		}
		else
		{
			alert("Problem sending reply");
		}
		this.sendbtn.cancel();
	},
	_upload_doc:function()
	{
		this.upload_doc_dlg.show()
	},
	_close_dlg:function()
	{
		this.upload_doc_ctrl.Clear();
		this.upload_doc_dlg.hide();	
	}
});

