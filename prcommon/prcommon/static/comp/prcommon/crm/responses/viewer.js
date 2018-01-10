//-----------------------------------------------------------------------------
// Name:    prcommon.crm.responses.viewer.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
// Update file will be required
//
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.responses.viewer");


dojo.require("ttl.GridHelpers");
dojo.require("ttl.BaseWidget");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojox.form.BusyButton");
dojo.require("dijit.form.Button");
dojo.require("prcommon.data.QueryWriteStore");
dojo.require("prcommon.documents.upload");
dojo.require("prcommon.crm.responses.add");
dojo.require("prcommon.crm.responses.update");

dojo.declare("prcommon.crm.responses.viewer",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	basic_details_page:"/clippings/display_page?clippingid=${clippingid}",	
	templatePath: dojo.moduleUrl( "prcommon.crm.responses","templates/viewer.html"),
	constructor: function()
	{
		this.model = new prcommon.data.QueryWriteStore(
			{	url:'/statement/statement_grid',
				onError:ttl.utilities.globalerrorchecker,
				clearOnClose:true,
				nocallback:true,
				urlPreventCache:true
			});

		this.engagement_model = new prcommon.data.QueryWriteStore (
			{url:'/statement/statement_engagements_grid',
				onError:ttl.utilities.globalerrorchecker,
				clearOnClose:true,
				nocallback:true,
				urlPreventCache:true
			});

		this.clipping_model = new prcommon.data.QueryWriteStore (
			{url:'/statement/statement_clippings_grid',
				onError:ttl.utilities.globalerrorchecker,
				clearOnClose:true,
				nocallback:true,
				urlPreventCache:true
			});

		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
		this._issues = new dojox.data.JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});
		this._UpdateStatementCallBack = dojo.hitch(this,this._UpdateStatementCall);
		this._DeleteStatementCallBack = dojo.hitch(this,this._DeleteStatementCall);
		this._load_call_back = dojo.hitch(this, this._load_call);
		dojo.subscribe(PRCOMMON.Events.Word_Html_Data, dojo.hitch(this,this._word_html_data_event));
		dojo.subscribe('/statement/add',  dojo.hitch(this, this._AddStatementEvent));
	},
	postCreate:function()
	{
		this.icustomerid = PRMAX.utils.settings.cid;
		this.upload_doc_ctrl.Load(this.upload_doc_dlg);

		this.grid.set("structure",this.view);
		this.grid._setStore(this.model);
		this.grid['onCellClick'] = dojo.hitch(this,this._onCellClick);

		this.engagements_grid.set("structure", this.engagement_view);
		this.engagements_grid._setStore(this.engagement_model);

		this.clippings_grid.set("structure", this.clip_view);
		this.clippings_grid._setStore(this.clipping_model);
		this.clippings_grid["onRowClick"] = dojo.hitch(this, this._on_row_click );

		this.clientid.store = this._clients;
		this.clientid.set("value",-1);
		this.issueid.store = this._issues;
		this.issueid.set("value",-1);
		this.tabcont.selectChild(this.details);
	},
	_OnStyleRow:function(inRow)
	{
		ttl.GridHelpers.onStyleRow(inRow);
		this.tabcont.selectChild(this.details);
	},
	view: {
		cells: [[
		{name: 'Description',width: "200px",field:"statementdescription"},
		{name: 'Client',width: "200px",field:"clientname"},
		{name: 'Issue',width: "auto",field:"issuename"},
		{name: 'Created date',width: "auto",field:"created"}
		]]
	},
	engagement_view: {
		cells: [[
		{name: 'Outlet',width: "200px",field:"outletname"},
		{name: 'Contact',width: "200px",field:"contactname"},
		{name: 'Date',width: "auto",field:"taken"}
		]]
	},
	clip_view: {
		cells: [[
		{name: 'Outlet',width: "200px",field:"outletname"},
		{name: 'Date',width: "auto",field:"sourcedate"}
		]]
	},

	_onCellClick:function ( e )
	{
		this._row = this.grid.getItem(e.rowIndex);
		this.grid.selection.clickSelectEvent(e);
		this.tabcont.selectChild(this.details);

//		this.engagements_grid.set("structure", this.engagement_view);
//		this.engagements_grid._setStore(this.engagement_model);

		this._ShowDetails();
	},
	_on_row_click:function(event)
	{
		var row = this.clippings_grid.getItem(event.rowIndex);
		if ( row )
		{
			this._row = row;
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._load_call_back,
				url:'/clippings/get_for_edit',
				content: {clippingid:row.i.clippingid}}));
		}
	},	
	_load_call:function(response)
	{
		this.clipping_view.set("href",dojo.string.substitute(this.basic_details_page,{clippingid:response.data.clippingid}));
		this.clippings_view.selectChild(this.clipping_view);
	},	
	_ShowDetails:function()
	{
		dojo.removeClass(this.display_pane,"prmaxhidden");

		this.statementid.set("value", this._row.i.statementid);
		this.statementdescription.set("value", this._row.i.statementdescription);
		this.clientid.set("value", this._row.i.clientid);
		this.issueid.set("value", this._row.i.issueid);
		this.output.set("value", this._row.i.output);

		this.engagements_grid.setQuery({statementid:this._row.i.statementid});
		this.clippings_grid.setQuery({statementid:this._row.i.statementid});
		this.clippings_view.selectChild(this.blank_view);
	},
	_AddStatement:function()
	{
		this.addstatementctrl.Load(this.add_statement_dlg);
		this.add_statement_dlg.show();

	},
	_AddStatementEvent:function(statement)
	{
		this.model.newItem(statement);
	},
	_Update:function()
	{
		if ( ttl.utilities.formValidator(this.update_form)==false)
		{
			alert("Not all required field filled in");
			this.update_form_btn.cancel();
			return;
		}
		if (confirm ("Update?"))
		{
			var content = this.update_form.get("value");
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
			this.model.setValue(this._row, "statementdescription", response.data.statementdescription, true );
			this.model.setValue(this._row, "clientid", response.data.clientid, true );
			this.model.setValue(this._row, "clientname", response.data.clientname, true );
			this.model.setValue(this._row, "issueid", response.data.issueid, true );
			this.model.setValue(this._row, "issuename", response.data.issuename, true );
			this.model.setValue(this._row, "output", response.data.output, true );
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
	_deleteStatement:function()
	{
		if (confirm("Delete Selected Statement?"))
		{
			var content = {};
			content['statementid'] = this._row.i.statementid;
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: dojo.hitch(this,this._DeleteStatementCallBack),
					url:"/statement/statement_delete",
					content: content}));
		}
	},
	_DeleteStatementCall:function(response)
	{
		if ( response.success == "OK")
		{
			alert("Statement Deleted");
			this.grid.setQuery(ttl.utilities.getPreventCache({}));
		}
		else
		{
			alert("Problem Deleting Selected Statement");
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
});





