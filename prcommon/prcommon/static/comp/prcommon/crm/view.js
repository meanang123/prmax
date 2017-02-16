//-----------------------------------------------------------------------------
// Name:    ViewContact.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/05/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.crm.ViewContact");

dojo.declare("prmax.crm.ViewContact",
	[ dijit._Widget, dijit._Templated, dijit._Container],
	{
	widgetsInTemplate: true,
	contacthistoryid:-1,
	isdelete:false,
	isedit:false,
	templatePath: dojo.moduleUrl( "prmax.crm","templates/ViewContact.html"),
	constructor: function()
	{
		this._LoadCallBack = dojo.hitch(this,this._LoadCall);
		this._DeleteCallBack = dojo.hitch(this, this._DeleteCall);

		dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._DialogCloseEvent));
		dojo.subscribe(PRCOMMON.Events.Crm_Note_Update, dojo.hitch(this,this._UpdateNoteEvent));

		this.inherited(arguments);
	},
	postCreate:function()
	{
		if ( this.isdelete == true )
			dojo.removeClass ( this.deletebtn.domNode,"prmaxhidden");
		if ( this.isedit == true )
			dojo.removeClass ( this.editbtn.domNode,"prmaxhidden");

		this.inherited(arguments);
	},
	Load: function( contacthistoryid )
	{
		this.contacthistoryid = contacthistoryid;
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._LoadCallBack,
					url:'/crm/getnote',
					content: {contacthistoryid:contacthistoryid}
			})	);
	},
	_LoadCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this._LoadDisplay ( response.data ) ;
			dojo.removeClass(this.view,"prmaxhidden");
		}
	},
	_LoadDisplay:function ( data )
	{
		dojo.attr(this.subject,"innerHTML", data.subject);
		dojo.attr(this.taken,"innerHTML", data.taken);
		dojo.attr(this.details,"innerHTML", data.details);
		dojo.attr(this.takenbyname,"innerHTML", data.takenbyname);
		dojo.attr(this.modified,"innerHTML", data.modified);
		dojo.attr(this.modifiedbyname,"innerHTML", data.modifiedbyname);
		dojo.attr(this.contacthistorydescription,"innerHTML", data.contacthistorydescription);
	},
	_EditNote:function()
	{
		this.editctrl1.LoadEdit ( this.contacthistoryid ) ;
		this.editctrl.show();
	},
	_DialogCloseEvent:function(  source )
	{
		if ( source == "add_contact" )
			this.editctrl.hide();
	},
	_UpdateNoteEvent:function(  data )
	{
		this._LoadDisplay ( data ) ;
	},
	_DeleteCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			dojo.publish ( PRCOMMON.Events.Crm_Note_Delete , [ this.contacthistoryid ]);
			this.Clear();
		}
		else
		{
			alert("Problem Deleting Note");
		}
	},
	_DeleteNote:function()
	{
		if ( confirm ("Delete Note") )
		{
			dojo.xhrPost(
						ttl.utilities.makeParams({
							load: this._DeleteCallBack,
							url:"/crm/deletenote" ,
							content: { contacthistoryid: this.contacthistoryid }
							})	);
		}
	},
	Clear:function()
	{
		dojo.addClass(this.view,"prmaxhidden");
		dojo.attr(this.subject,"innerHTML", "");
		dojo.attr(this.taken,"innerHTML", "");
		dojo.attr(this.details,"innerHTML", "");
		dojo.attr(this.takenbyname,"innerHTML", "");
		dojo.attr(this.modified,"innerHTML", "");
		dojo.attr(this.modifiedbyname,"innerHTML", "");
		dojo.attr(this.contacthistorydescription,"innerHTML", "");
	}
});





