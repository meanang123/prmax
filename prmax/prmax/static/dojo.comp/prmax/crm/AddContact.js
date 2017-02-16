//-----------------------------------------------------------------------------
// Name:    AddContac.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/05/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.crm.AddContact");

dojo.declare("prmax.crm.AddContact",
	[ dijit._Widget, dijit._Templated, dijit._Container],
	{
	widgetsInTemplate: true,
	contacthistorysourceid_default:-2,
	showclose:false,
	isedit:false,
	templatePath: dojo.moduleUrl( "prmax.crm","templates/AddContact.html"),
	constructor: function()
	{
		this._SavedCallBack = dojo.hitch ( this, this._SavedCall);
		this._GetCallBack = dojo.hitch ( this, this._GetCall);
		this._UpdateCallBack = dojo.hitch ( this, this._UpdateCall);
		this._contacthistoryid = -1;
		this.inherited(arguments);
	},
	postCreate:function()
	{
		this.contacthistorysourceid.store = PRCOMMON.utils.stores.ContactHistoryTypes();
		if ( this.contacthistorysourceid_default != -2)
			this.contacthistorysourceid.st("value",this.contacthistorysourceid_default);

		if ( this.showclose)
			dojo.removeClass( this.closeNode.domNode, "prmaxhidden");

		this.inherited(arguments);
	},
	_Save:function()
	{
		if ( ttl.utilities.formValidator(this.formNode)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		if ( this._contacthistoryid == -1 )
		{
			dojo.xhrPost(
						ttl.utilities.makeParams({
							load: this._SavedCallBack,
							url:"/crm/addnote" ,
							content: this.formNode.get("value")
							})	);
		}
		else
		{
			dojo.xhrPost(
						ttl.utilities.makeParams({
							load: this._UpdateCallBack,
							url:"/crm/updatenote" ,
							content: this.formNode.get("value")
							})	);
		}
	},
	_UpdateCall:function( response )
	{
		if ( response.success == "OK" )
		{
			dojo.publish ( PRCOMMON.Events.Crm_Note_Update , [response.data ]);
			this._Close();
		}
		else
		{
			alert("Problem Updating Note");
			this.saveNode.cancel();
		}
	},
	_SavedCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			dojo.publish ( PRCOMMON.Events.Crm_Note_Add , [response.data ]);
			this._Close();
		}
		else
		{
			alert("Problem Adding Note");
			this.saveNode.cancel();
		}
	},
	Clear:function()
	{
		this.contacthistorysourceid.set("value", ( this.contacthistorysourceid_default != -2) ? this.contacthistorysourceid_default:null);
		this.subject.set("value","");
		this.details.set("value","");
		this.saveNode.cancel();
		this.isedit = false;
		this._contacthistoryid = -1;
		this.contacthistoryid.set("value", -1 ) ;
		this.saveNode.set("label", "Add");
		this.saveNode.set("busyLabel","Please Wait Adding Notes...");

	},
	_Close:function()
	{
		dojo.publish(PRCOMMON.Events.Dialog_Close, ["add_contact"]);
		this.Clear();
	},
	LoadControls:function( outletid, employeeid, contactid, ref_customerid, taskid)
	{
		this.ref_customerid.set("value",ref_customerid);
		this.outletid.set("value",outletid);
		this.employeeid.set("value",employeeid);
		this.contactid.set("value",contactid);
		this.taskid.set("value", taskid);
	},
	_setContacthistorysourceid_defaultAttr:function(value)
	{
		this.contacthistorysourceid_default = value;
		if ( this.contacthistorysourceid_default != -2)
			this.contacthistorysourceid.set("value",this.contacthistorysourceid_default);
	},
	_getContacthistorysourceid_defaultAttr:function()
	{
		return this.contacthistorysourceid_default;
	},
	_GetCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.contacthistoryid.set("value", response.data.contacthistoryid ) ;
			this.subject.set("value" , response.data.subject ) ;
			this.details.set("value" , response.data.details ) ;
			this.contacthistorysourceid.set("value" , response.data.contacthistorysourceid ) ;
			this.saveNode.set("label", "Save");
			this.saveNode.set("busyLabel","Please Wait Updating Notes...");
		}
		else
		{
			alert("Problem Loading Note");
		}
	},
	LoadEdit:function( contacthistoryid )
	{
		this._contacthistoryid = contacthistoryid;

			dojo.xhrPost(
						ttl.utilities.makeParams({
							load: this._GetCallBack,
							url:"/crm/getnote" ,
							content: {contacthistoryid : contacthistoryid }
							})	);

	}
});





