//-----------------------------------------------------------------------------
// Name:    geographicals.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.employees.PersonDelete");

dojo.declare("prmax.dataadmin.employees.PersonDelete",
	[ prcommon.search.std_search,dijit._Widget, dijit._Templated, dijit._Container],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.dataadmin.employees","templates/PersonDelete.html"),
		constructor: function()
		{
			this._DeletedContactCallBack = dojo.hitch(this, this._DeletedContactCall );
		},
		postCreate:function()
		{
			this.reasoncodes.store = PRCOMMON.utils.stores.Research_Reason_Del_Codes();
			this.inherited(arguments);
		},
		_DeleteSubmit:function()
		{
			if ( ttl.utilities.formValidator(this.form)==false)
			{
				alert("Not all required fields filled in");
				this.deleteBtn.cancel();
				return;
			}
			if ( this.reason.get("value").length == 0 )
			{
				alert("No Description Given");
				this.reason.focus();
				return;
			}

			if  ( confirm ("Delete " + dojo.attr(this.heading,"innerHTML" ) + " ?" ))
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._DeletedContactCallBack,
						url:'/contacts/research_person_delete' ,
						content: this.form.get("value")
				}));
			}
		},
		_DeletedContactCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				dojo.publish(PRCOMMON.Events.Person_Delete, [response.contact]);
				alert("Person Deleted");
				this.Clear();
				dojo.publish(PRCOMMON.Events.Dialog_Close, ["per_del"]);
			}
			else
			{
				alert ( "Problem Deleteing Person" ) ;
				this.deleteBtn.cancel();
			}
		},
		// styandard clear function
		Clear:function()
		{
			this.contactid.set("value", -1 ) ;
			this.reasoncodes.set("value",null);
			this.reason.set("value","");
			this.deleteBtn.cancel();
		},
		Load:function( employeeid, name )
		{
			this.contactid.set("value", employeeid );
			dojo.attr(this.heading,"innerHTML" , name ) ;
			this.reasoncodes.set("value", null);
			this.reason.set("value","");
			this.reason.focus();
		},
		focus:function()
		{
			this.reason.focus();
		}
	}
);





