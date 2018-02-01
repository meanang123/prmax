//-----------------------------------------------------------------------------
// Name:    prcommon.crm.responses.add.js
// Author:
// Purpose:
// Created: Sept 2017
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.responses.add");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Button");
dojo.require("prcommon.documents.upload");
dojo.require("dojo.data.ItemFileWriteStore");

dojo.require("prmax.projects.projectselect");

dojo.declare("prcommon.crm.responses.add",
[ ttl.BaseWidget ],
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.responses","templates/add.html"),
	constructor: function()
	{
		this._AddedCallback = dojo.hitch(this,this._Added);

		this._client_data = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
		this._issues_data = new dojox.data.JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});
		this._mode = '';
		this._output = '';
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
	Load:function(dialog, mode, output)
	{
		this._dialog = dialog;
		if (mode != undefined && mode != null)
		{
			this._mode = mode;
		};
		if (output != undefined && output != null)
		{
			this._output = output;
		};

		if (this._mode == "save")
		{
			dojo.addClass(this.output_node, "prmaxhidden");
			this._dialog.resize({w:600, h:200});
		};
	},
	_Clear:function()
	{
		this.statementdescription.set("value","");
		this.output.set("value", "");
		this.clientid.set("value", "-1" );
		this.issueid.set("value", "-1" );
		this.saveNode.set("disabled",false);
	},
	_Added:function( response )
	{
		if (response.success=="DU")
		{
			alert("Statement Already Exists");
		}
		else if (response.success=="OK")
		{
			dojo.publish('/statement/add', [ response.data ] );
			alert("Statement Added");
			this._Close();
		}
		else if (response.success=="FA")
		{
			alert(response.message);
		}
		else
		{
			alert("Problem Adding Statement");
		}
	},
	_Add:function()
	{
		if (ttl.utilities.formValidator(this.statement_form) == false)
		{
			alert("Please Enter Details");
			return false;
		}
		var content = this.statement_form.get("value") ;
		if (this._output)
		{
			content['output'] = this._output;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._AddedCallback,
			url:"/statement/statement_add",
			content:content}));
	},
	Clear:function()
	{
		this._Clear();
	},
	showClose:function ( dlg )
	{
		this.dlg = dlg;
		dojo.removeClass( this.clearNode, "prmaxhidden");
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
		if (html.sourcename == "sendrelease")
			this.output.set("value", html.html) ;
	},
	_Close:function()
	{
		this.upload_doc_ctrl.Clear();
		this.upload_doc_dlg.hide();
		this._dialog.hide();
	},

});
