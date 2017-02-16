//-----------------------------------------------------------------------------
// Name:    Profile.js
// Author:  Chris Hoy
// Purpose:
// Created: 24/02/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.employees.People");

dojo.declare("prmax.dataadmin.employees.People",
	[ dijit._Widget, dijit._Templated, dijit._Container],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.employees","templates/People.html"),
	constructor: function()
	{
		this.people_model = new prcommon.data.QueryWriteStore (
			{	url:"/contacts/research_contactlist",
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
			});

		this.people_employee_model = new dojox.data.QueryReadStore (
			{	url:"/contacts/research_contact_employee",
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
			});

		this._GetEntryCallBack = dojo.hitch (this, this._getContactEntry);
		this._LoadCallBack = dojo.hitch ( this , this._LoadCall);
		this._UpdatedCallBack = dojo.hitch ( this , this._UpdatedCall);

		dojo.subscribe(PRCOMMON.Events.Person_Added, dojo.hitch(this,this._PersonAddEvent));
		dojo.subscribe(PRCOMMON.Events.Person_Update, dojo.hitch(this,this._PersonUpdateEvent));
		dojo.subscribe(PRCOMMON.Events.Person_Delete, dojo.hitch(this,this._PersonDeleteEvent));
		dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._DialogCloseEvent));
	},
	postCreate:function()
	{
		this.people_grid.set("structure",this.view);
		this.people_grid._setStore(this.people_model );

		this.people_details_employee_grid.set("structure",this.view_employee);
		this.people_details_employee_grid._setStore(this.people_employee_model );

		this.people_grid.onStyleRow = dojo.hitch(this,this._OnStyleRow);
		this.people_grid.onRowClick = dojo.hitch(this,this._OnSelectRow);

		this.reasoncodeid.store = PRCOMMON.utils.stores.Research_Reason_Update_Codes();
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);

		this.inherited(arguments);

	},
	_OnStyleRow:function(inRow)
	{
		ttl.GridHelpers.onStyleRow(inRow);
	},
	_OnSelectRow : function(e) {

		this._row = this.people_grid.getItem(e.rowIndex);

		this.contactid.set("value",this._row.i.contactid ) ;
		this.people_details_employee_grid.setQuery( ttl.utilities.getPreventCache({contactid:this._row.i.contactid}));
		this.audit_ctrl.Load( this._row.i.contactid  ) ;
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadCallBack,
			url:'/contacts/get',
			content: { contactid : this._row.i.contactid }
			}));

		this.controls.selectChild(this.details_view);
		this.people_grid.selection.clickSelectEvent(e);
	},
	_LoadCall:function( response )
	{
		if ( response.success=="OK")
		{
			this.prefix.set("value", response.contact.prefix );
			this.firstname.set("value", response.contact.firstname );
			this.familyname.set("value", response.contact.familyname );
			this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
			this.reason.set("value","");
		}
	},
	view: {
		cells: [[ {name: 'Display Name',width: "auto",field:"contactname"},
		{name: 'Id',width: "auto",field:"contactid"},
		{name: 'Source',width: "auto",field:"sourcename"}]]
	},
	view_employee: {
		cells: [[ {name: 'Outlet Name',width: "auto",field:"outletname"},
		{name: 'Job Title ',width: "auto",field:"job_title"},
		{name: 'Source',width: "auto",field:"sourcename"},
		{name: 'Media Channel',width: "auto",field:"prmax_outlettypename"}
		]]
	},

	view: {
		cells: [[ {name: 'Display Name',width: "auto",field:"contactname"},
		{name: 'Id',width: "auto",field:"contactid"},
		{name: 'Source',width: "auto",field:"sourcename"}]]
	},

	resize:function()
	{
		this.borderControl.resize(arguments[0]);
	},
	_Execute:function()
	{
		var query = {};

		if (arguments[0].filter.length>0)
			query["filter"] = arguments[0].filter;

		this.people_grid.setQuery( ttl.utilities.getPreventCache(query));
	},
	_ClearFilter:function()
	{
		this.filter.set("value","");
	},
	_Add:function()
	{
		this.person_add_dlg.show();
	},
	_PersonAddEvent:function ( contact )
	{
		this.people_model.newItem(contact);
	},
	_getContactEntry:function()
	{
		this.person = arguments[0];
	},
	_PersonUpdateEvent:function( contact )
	{
		this.person = null;
		var item  =	{	identity:contact.contactid,
						onItem: this._GetEntryCallBack};
		this.people_model.fetchItemByIdentity(item);
		if (this.person !== null )
		{
			this.people_model.setValue(  this.person, "contactname" , contact.contactname, true );
			this.people_model.setValue(  this.person, "sourcename" , contact.sourcename, true );
		}
	},
	_PersonDeleteEvent:function ( contact )
	{
		this.people_model.deleteItem ( this._row ) ;
		this.controls.selectChild(this.blank);
		this._row = null;
	},
	_DialogCloseEvent:function(  source )
	{
		if ( source == "cont_add" )
			this.person_add_dlg.hide();
		if ( source == "per_del" )
			this.person_delete_dlg.hide();
	},
	_UpdateContact:function()
	{
		if ( ttl.utilities.formValidator(this.formUpdate)==false)
		{
			alert("Not all required field filled in");
			this.updateNode.cancel();
			return;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._UpdatedCallBack,
			url: "/contacts/research_update",
			content: this.formUpdate.get("value")}));
	},
	_ClearReason:function()
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.reason.set("value","");
	},
	_UpdatedCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Contact Updated" ) ;
			dojo.publish(PRCOMMON.Events.Person_Update, [ response.contact ] ) ;
			this._ClearReason();
		}
		else
		{
			alert("Problem Updated Contact" ) ;
		}
		this.updateNode.cancel();
	},
	_DeleteContact:function()
	{
		this.person_delete_ctrl.Load( this._row.i.contactid, this._row.i.contactname );
		this.person_delete_dlg.show();
	}
});





