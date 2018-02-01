//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.update.js
// Author:  
// Purpose:
// Created: Jan 2018
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.pressrelease.update");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Button");
dojo.require("prcommon.documents.upload");
dojo.require("dojo.data.ItemFileWriteStore");

dojo.require("prmax.projects.projectselect");

dojo.declare("prmax.pressrelease.update",
[ ttl.BaseWidget ],
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease","templates/update.html"),
	constructor: function()
	{
		this._LoadCallback = dojo.hitch(this,this._LoadCall);
		this._UpdateEmailtemplateCallBack = dojo.hitch(this,this._UpdateEmailtemplateCall);

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
	Load:function(dialog, emailtemplateid)
	{
		this._dialog = dialog;
		this._emailtemplateid = emailtemplateid;
		this.emailtemplateid.set("value", emailtemplateid);

		var content = {};
		content['emailtemplateid'] = emailtemplateid;
	
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadCallback,
			url:"/emails/templates_get",
			content:content}));	
	},

	_LoadCall:function ( response )
	{

		if ( response.success == "OK" )
		{
			this.emailtemplateid.set("value", response.data.emailtemplateid);
			this.emailtemplatename.set("value", response.data.emailtemplatename);
			this.clientid.set("value", response.data.clientid);
			this.issueid.set("value", response.data.issueid);
			this.emailtemplatecontent.set("value", response.data.emailtemplatecontent);
		}
		else
		{
			alert("Problem Loading Press Release");
		}
	},

	
	_Update:function()
	{
		if ( ttl.utilities.formValidator(this.update_emailtemplate_form)==false)
		{
			alert("Not all required field filled in");
			this.update_form_btn.cancel();
			return;
		}
		if (confirm ("Update?"))
		{
			var content = this.update_emailtemplate_form.get("value");
			
			
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: dojo.hitch(this,this._UpdateEmailtemplateCallBack),
					url:'/emails/templates_update_text',
					content: content
				})
			);
		}
	},
	_UpdateEmailtemplateCall:function ( response )
	{
		if (response.success=="OK")
		{
			alert("Press Release Updated");
			this.update_form_btn.cancel();
		}
		else if ( response.success == "DU")
		{
			alert("Press Release Already Exists");
			this.update_form_btn.cancel();
		}
		else
		{
			alert("Problem updating Press Release");
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
		if (html.sourcename == "pressrelease_update")
		{
			this.output.set("value", html.html) ;
		}
	},		
	_Close:function ( )
	{
		this.upload_doc_ctrl.Clear();
		this.upload_doc_dlg.hide();
		this._dialog.hide();
	},	

});
