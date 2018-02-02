//-----------------------------------------------------------------------------
// Name:    update.js
// Author:  Chris Hoy
// Purpose:
// Created: 06/07/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.issues.update");


dojo.require("prcommon.crm.solidsocial.viewercoverage");
dojo.require("prcommon.clippings.questions.analysis_viewer");

dojo.declare("prcommon.crm.issues.update",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.issues","templates/update.html"),
	history_view:"/crm/issues/history_view?issuehistoryid=${issuehistoryid}",
	constructor: function()
	{
		this._update_call_back = dojo.hitch( this, this._update_call);
		this._load_call_back = dojo.hitch( this, this._load_call);
		this._load_briefing_call_back = dojo.hitch(this, this._load_briefing_call);
		this._delete_issue_call_back = dojo.hitch(this, this._delete_issue_call);
		this._error_call_back = dojo.hitch ( this, this._error_call );

		this._documents = new dojox.data.JsonRestStore( {target:"/crm/documents/rest_combo", idAttribute:"id"});
		this._briefingnotesstatus = new dojo.data.ItemFileReadStore ( { url:"/common/lookups_restricted?searchtype=briefingnotesstatus"});
		this._users = new dojo.data.ItemFileReadStore ( { url:"/user/user_list"});
		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});


		this.filter_db = new prcommon.data.QueryWriteStore (
			{url:'/crm/issues/issue_history',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker
			});

		this.issue_engagements = new prcommon.data.QueryWriteStore (
			{url:'/crm/issues/issue_engagements',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker
			});

	},
	view:{
		cells: [[
			{name: 'Changed', width: "auto",field: 'changed_display'}
			]]
	},
	view1:{
		cells: [[
			{name: 'Date',width: "60px",field:'taken_display'},
			{name: 'Subject',width: "auto",field:'subject'},
			{name: 'Contact',width: "auto",field:'contactname'},
			{name: 'Status',width: "auto",field:'contacthistorystatusdescription'}
			]]
	},
	postCreate:function()
	{
		this.history_grid.set("structure", this.view);
		this.history_grid._setStore(this.filter_db);
		this.history_grid.onRowClick = dojo.hitch(this, this._on_select_row);
		this.engagements_grid.set("structure", this.view1);
		this.engagements_grid._setStore(this.issue_engagements);

		this.documentid.set("store", this._documents);
		this.documentid.set("value",-1);
		this.briefingnotesstatusid.set("store", this._briefingnotesstatus);
		this.briefingnotesstatusid.set("value", 1);
		this.approvedbyid.set("store", this._users);
		this.approvedbyid.set("value",PRMAX.utils.settings.uid);

		this.clientid.set("store", this._clients);
		this.clientid.set("value",  "-1");

		this.engagements.set("title", PRMAX.utils.settings.crm_engagement_plural);

		this.inherited(arguments);
	},
	_on_select_row:function(e)
	{
		this._selected_row = this.history_grid.getItem(e.rowIndex);

		this.history_view_ctrl.set("href",dojo.string.substitute(this.history_view,{issuehistoryid:this._selected_row.i.issuehistoryid}));

	},
	_save_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			dojo.publish ( PRCOMMON.Events.Issue_Update , [response.data ]);
		}
		else
		{
			alert("Problem Updating Issue");
		}

		this.savebtn.cancel();
	},
	_load_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.issueid.set("value", response.data.issueid);
			this.issuename.set("value", response.data.name);
			this.briefingnotes.set("value", response.data.briefingnotes);
			this.history_grid.setQuery({issueid:response.data.issueid});
			this.engagements_grid.setQuery({issueid:response.data.issueid});
			this.documentid.set("value", response.data.documentid);
			this.briefingnotesstatusid.set("value",response.data.briefingnotesstatusid);
			this.approvedbyid.set("value",response.data.approvedbyid);
			if (response.data.clientid >0 )
				this.clientid.set("value",response.data.clientid);
			else
				this.clientid.set("value",-1);

			this._display_colours( response.data.background_colour, response.data.text_colour );

			this.tabcont.selectChild(this.details);
			this.coverage.load(response.data.issueid);
			this.analysis_ctrl.load(null,response.data.issueid)
			this.display_view.selectChild(this.tabcont);

		}
		else
		{
			alert("Problem Loading Issue");
		}
	},
	startup:function()
	{
		this.inherited(arguments);

		if (PRMAX.utils.settings.clippings==false)
		{
			this.analysis_tab.controlButton.domNode.style.display = "none";
		}
		if (PRMAX.utils.settings.updatum==false)
		{
			this.coverage.controlButton.domNode.style.display = "none";
		}
	},
	_clear:function()
	{
		this.documentid.set("value",-1);
		this.briefingnotesstatusid.set("value",1);
		this.approvedbyid.set("value",PRMAX.utils.settings.uid);
	},
	clear:function()
	{
		this.display_view.selectChild(this.blank);
		this.history_view_ctrl.set("content","");
		this._clear();
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
	},
	load:function(issueid)
	{
		this.clear();
		this._issueid = issueid;

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._load_call_back,
						url:"/crm/issues/get" ,
						content: {issueid:issueid}
						}));
	},
	_update_issue:function()
	{
		if ( ttl.utilities.formValidator(this.formnode)==false)
		{
			alert("Not all required field filled in");
			this.savebtn.cancel();
			return;
		}

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._update_call_back,
						url:"/crm/issues/update" ,
						content: this.formnode.get("value")
						}));
	},
		_update_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			dojo.publish ( PRCOMMON.Events.Issue_Update , [response.data ]);
		}
		else
		{
			alert("Problem Updating Issue");
		}

		this.savebtn.cancel();
	},
	_change_colour:function()
	{
		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._load_briefing_call_back,
						url:"/crm/issues/briefingnoteget" ,
						content: {briefingnotesstatusid: this.briefingnotesstatusid.get("value")}
						}));
	},
	_load_briefing_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._display_colours( response.data.background_colour, response.data.text_colour ) ;
		}
		else
		{

		}
	},
	_display_colours:function(background_colour, text_colour)
	{
		if ( text_colour )
		{
			dojo.style(this.briefingnotes.domNode,"color",text_colour);
			dojo.style(this.notes_frame,"color",text_colour);
		}
		else
		{
			dojo.style(this.briefingnotes.domNode,"color","inherit");
			dojo.style(this.notes_frame,"color","inherit");
		}

		if ( background_colour )
		{
			dojo.style(this.briefingnotes.domNode,"backgroundColor",background_colour);
			dojo.style(this.notes_frame,"backgroundColor",background_colour);
		}
		else
		{
			dojo.style(this.briefingnotes.domNode,"backgroundColor","transparent");
			dojo.style(this.notes_frame,"backgroundColor","transparent");
		}
	},
	_delete_issue:function()
	{
		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._delete_issue_call_back,
						error: this._error_call_back,
						url:"/crm/issues/archive" ,
						content: {issueid : this._issueid}
						}));
	},
	_delete_issue_call:function(response)
	{
		if ( response.success=="OK")
		{

		}
		else
		{
			alert("Problem");
		}

		this.deletebtn.cancel();

	},
	_error_call:function(response, ioArgs)
	{
		this.deletebtn.cancel();
		ttl.utilities.xhrPostError(response,ioArgs);
	}
});





