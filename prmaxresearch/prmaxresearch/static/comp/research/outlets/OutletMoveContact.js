//-----------------------------------------------------------------------------
// Name:    OutletMoveContact.js
// Author:  Chris Hoy
// Purpose:
// Created: 06/03/2013
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlets/templates/OutletMoveContact.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"ttl/store/JsonRest",
	"dojo/dom-class",
	"dijit/layout/ContentPane",
	"dijit/form/Button",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/Form"
	], function(declare, BaseWidgetAMD, template, request, utilities2, lang,topic,domattr,JsonRest,domclass){
 return declare("research.outlets.OutletMoveContact",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._move_call_back = lang.hitch(this, this._move_call );
		this._outlets =  new JsonRest( {target:'/research/admin/outlets/list_research', idProperty:"outletid"});
		this._outletdesks =new JsonRest( {target:'/research/admin/desks/list_outlet_desks', idProperty:"outletdeskid"});

	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.outletid.set("store", this._outlets);
		this.outletdeskid.set("store", this._outletdesks);
	},
	_move_contact:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}
		if ( confirm("Move Contact?"))
		{
			request.post('/research/admin/outlets/research_move_contact',
				utilities2.make_params({data:this.form.get("value")})). then
				(this._move_call_back);
		}
	},
	_move_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			topic.publish(PRCOMMON.Events.Employee_Deleted,{has_deleted:true, employeeid: parseInt(this.employeeid.get("value"))});
			alert("Contact Moved");
			this._dialog.hide();
			this.clear();
		}
		else
		{
			alert ( "Problem Moving Contact" ) ;
		}
	},
	// styandard clear function
	clear:function()
	{
		this.outletid.set("value", null ) ;
		this.outletdeskid.set("value", -1);
		domattr.set(this.heading,"innerHTML" , "" ) ;
		domclass.add(this.desk_view,"prmaxhidden");

	},
	load:function( employeeid, employeename, dialog, outletid)
	{
		this.clear();
		this.employeeid.set("value", employeeid );
		domattr.set(this.heading,"innerHTML" , employeename) ;
		this._dialog = dialog;
		this.outletid.set("query",{ioutletid:outletid});
		this.outletid.set("value", null);
	},
	_close_dlg:function()
	{
		this._dialog.hide();
		this.clear();
	},
	_outlet_selected:function( outletid)
	{
		this.outletdeskid.set("query",{outletid:outletid});
		this.outletdeskid.set("value", null);
		domclass.remove(this.desk_view,"prmaxhidden");
	}
});
});





