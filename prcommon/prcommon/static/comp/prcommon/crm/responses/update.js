//-----------------------------------------------------------------------------
// Name:    prcommon.crm.responses.update.js
// Author:  
// Purpose:
// Created: Sept 2017
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.responses.update");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Button");
dojo.require("prcommon.documents.upload");
dojo.require("dojo.data.ItemFileWriteStore");

dojo.require("prmax.projects.projectselect");

dojo.declare("prcommon.crm.responses.update",
[ ttl.BaseWidget ],
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.responses","templates/update.html"),
	constructor: function()
	{
		this._AddedCallback = dojo.hitch(this,this._Added);
		this._LoadCallback = dojo.hitch(this,this._LoadCall);
		this._UpdateStatementCallBack = dojo.hitch(this,this._UpdateStatementCall);

		this._client_data = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
		this._issues_data = new dojox.data.JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});
		dojo.subscribe(PRCOMMON.Events.Word_Html_Data, dojo.hitch(this,this._word_html_data_event));	
		
		this.inherited(arguments);
	},
	postCreate:function()
	{
		this.icustomerid = PRMAX.utils.settings.cid;
		this.upload_doc_ctrl.Load(this.upload_doc_dlg);	
		this.clientid.store = this._client_data;
		this.clientid.set("value",-1);
		this.issueid.store = this._issues_data;
		this.issueid.set("value",-1);

		this.inherited(arguments);
	},
	Load:function(dialog, statementid)
	{
		this._dialog = dialog;
		this._statementid = statementid;
		this.statementid.set("value", statementid);

		var content = {};
		content['statementid'] = statementid;
	
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadCallback,
			url:"/statement/statement_get",
			content:content}));	
	},

	_LoadCall:function ( response )
	{

		if ( response.success == "OK" )
		{
			this.statementid.set("value", response.data.statementid);
			this.statementdescription.set("value", response.data.statementdescription);
			this.clientid.set("value", response.data.clientid);
			this.issueid.set("value", response.data.issueid);
			this.output.set("value", response.data.output);
		}
		else
		{
			alert("Problem Loading Statement");
		}
	},

	
	_Update:function()
	{
		if ( ttl.utilities.formValidator(this.update_statement_form)==false)
		{
			alert("Not all required field filled in");
			this.update_form_btn.cancel();
			return;
		}
		if (confirm ("Update?"))
		{
			var content = this.update_statement_form.get("value");
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: dojo.hitch(this,this._UpdateStatementCallBack),
					url:'/statement/statement_update',
					content: content
				})
			);
		}
	},
	_UpdateStatementCall:function ( response )
	{
		if (response.success=="OK")
		{
			alert("Statement Updated");
			this.update_form_btn.cancel();
		}
		else if ( response.success == "DU")
		{
			alert("Statement Already Exists");
			this.update_form_btn.cancel();
		}

		else
		{
			alert("Problem updating Statement");
			this.update_form_btn.cancel();
		}
	},

	_LoadWord:function()
	{
		this.upload_doc_dlg.show();
	},	
	_close_dlg:function()
	{
		this.upload_doc_ctrl.Clear();
		this.upload_doc_dlg.hide();	
	},
	_upload_doc:function()
	{
		this.upload_doc_dlg.show()
	},
	_word_html_data_event:function(html)
	{
		this.output.set("value", html.html) ;
	},		
	_Close:function ( )
	{
		this.upload_doc_ctrl.Clear();
		this.upload_doc_dlg.hide();
		this._dialog.hide();
	},	

});
