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
dojo.require("prcommon.crm.responses.search");
dojo.require("prcommon.crm.responses.add");

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
		this._statements =  new prcommon.data.QueryWriteStore({ url:"/common/lookups?searchtype=statements"});
		dojo.subscribe('customeremailserver/add', dojo.hitch(this, this._add_customeremailserver_event));
		this.userid = PRMAX.utils.settings.uid;
		this.userccaddresses = PRMAX.utils.settings.ccaddresses;
		this._contacthistoryid = '';
		this._statementid = '';

		dojo.subscribe(PRCOMMON.Events.Word_Html_Data, dojo.hitch(this,this._word_html_data_event));		
		dojo.subscribe('/statement/get', dojo.hitch(this,this._get_statement_event));	
		dojo.subscribe('/usersettings/ccaddresses', dojo.hitch(this,this._get_ccaddresses_event));	
		
		
	},
	postCreate:function()
	{
		this.upload_doc_ctrl.Load(this.upload_doc_dlg);	
		this.inherited(arguments);
		this.customeremailserverid.set("store", this._customeremailserver);
//		this.statementid.set("store", this._statements);
	},
	load:function(dialog, subject, contacthistoryid)
	{
		this._dialog = dialog;	
		this.emailsubject.set("value", subject);
		this._contacthistoryid = contacthistoryid;
		this.emailbody.set("value", "");
		this.ccemailaddresses.set("value", this.userccaddresses);
	},
	_LoadWord:function()
	{
		this.upload_doc_ctrl.Clear();
		this.upload_doc_dlg.show();
	},
	_SearchStatement:function()
	{
//		this.addstatementctrl.Clear();
		this.searchstatementctrl.Load(this.search_statement_dlg);
		this.search_statement_dlg.show();
	},
	_AddStatement:function()
	{
//		this.addstatementctrl.Clear();
		this.addstatementctrl.Load(this.add_statement_dlg, "save", this.emailbody.value);
		this.add_statement_dlg.show();
		this.add_statement_dlg.resize({w:600, h:200});
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
	_get_statement_event:function(data)
	{
		this._statementid = data.data.statementid;
		this.emailbody.set("value", data.data.output) ;
	},	
	_get_ccaddresses_event:function(data)
	{
		this.userccaddresses = data.control.ccaddresses;
		this.ccemailaddresses.set("value", this.userccaddresses);
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
		content['exclude_images'] = true;
		content['statementid'] = this._statementid;

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

