//-----------------------------------------------------------------------------
// Name:    add.js
// Author:  Chris Hoy
// Purpose:
// Created: 06/07/2014
//
// To do:
//
//-----------------------------------------------------------------------------
//
dojo.provide("prcommon.crm.issues.add");

dojo.require("prcommon.crm.solidsocial.preview");
dojo.require("prcommon.documents.adddialog");

dojo.declare("prcommon.crm.issues.add",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.issues","templates/add.html"),
	constructor: function()
	{
		this._save_call_back = dojo.hitch( this, this._save_call);
		this._add_issue_call_back = dojo.hitch(this, this._add_issue_call);
		this._documents = new dojox.data.JsonRestStore( {target:"/crm/documents/rest_combo", idAttribute:"id"});
		this._briefingnotesstatus = new dojo.data.ItemFileReadStore ( { url:"/common/lookups_restricted?searchtype=briefingnotesstatus"});
		this._users = new dojo.data.ItemFileReadStore ( { url:"/user/user_list"});
		this._load_briefing_call_back = dojo.hitch(this, this._load_briefing_call);
		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});


		this._pub_event = PRCOMMON.Events.Issue_Add;
		dojo.subscribe(PRCOMMON.Events.Document_Add, dojo.hitch(this, this._add_event));
	},
	postCreate:function()
	{

		this.inherited(arguments);

		this._dialog = null;
		this.documentid.set("store", this._documents);
		this.documentid.set("value",-1);
		this.briefingnotesstatusid.set("store", this._briefingnotesstatus);
		this.briefingnotesstatusid.set("value", 1);
		this.approvedbyid.set("store", this._users);
		this.approvedbyid.set("value",null);
		this.clientid.set("store", this._clients);
		this.clientid.set("value",  "-1");

	},
	_save:function()
	{
		if ( ttl.utilities.formValidator(this.formnode)==false)
		{
			alert("Not all required field filled in");
			this.savebtn.cancel();
			return;
		}

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._save_call_back,
						url:"/crm/issues/add" ,
						content: this.formnode.get("value")
						}));
	},
	_setDialogAttr:function( _dialog )
	{
		this._dialog = _dialog;
	},
	_setPublish_eventAttr:function( _pub_event_local )
	{
		this._pub_event = _pub_event_local;
	},
	_save_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			dojo.publish ( this._pub_event , [response.data ]);
			this._close();
		}
		else
		{
			alert("Problem Adding Issue");
			this.savebtn.cancel();
		}
	},
	_clear:function()
	{
		this.savebtn.cancel();

		this.issue.set("value","");
		this.briefingnotes.set("value","");
		this.documentid.set("value",-1);
		this.briefingnotesstatusid.set("value", 1);
		this.approvedbyid.set("value",null);
		this.clientid.set("value",  "-1");

	},
	_close:function()
	{
		if ( this._dialog != null)
			this._dialog.hide();

		this._clear();
	},
	clear:function()
	{
		this._clear();
	},
	_add_event:function( document )
	{
		this.documentid.set( "value", document.documentid );
	},
	_new_document:function()
	{
		this.addctrl.show();
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
	_show_selection:function()
	{
		this.add_ctrl.load(this.monitoring_words.get("value"));
		this.add_dlg.show();
	},
	_show_preview:function()
	{
		if ( this.monitoring.get("checked"))
		{
			dojo.removeClass(this.monitoring_view,"prmaxhidden");
		}
		else
		{
			dojo.addClass(this.monitoring_view,"prmaxhidden");
		}
	}
});





