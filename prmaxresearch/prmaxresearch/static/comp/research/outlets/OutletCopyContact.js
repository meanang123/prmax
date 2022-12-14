//-----------------------------------------------------------------------------
// Name:    OutletCopyContact.js
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
	"dojo/text!../outlets/templates/OutletCopyContact.html",
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
 return declare("research.outlets.OutletCopyContact",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._copy_call_back = lang.hitch(this, this._copy_call );
		this._outlet_selected_call_back = lang.hitch(this, this._outlet_selected_call );
		this._outlets =  new JsonRest( {target:'/research/admin/outlets/list_research', idProperty:"outletid"});
		this._outletdesks =new JsonRest( {target:'/research/admin/desks/list_outlet_desks', idProperty:"outletdeskid"});

	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.outletid.set("store", this._outlets);
		this.outletdeskid.set("store", this._outletdesks);
	},
	_copy_contact:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}
		if ( confirm("Copy Contact?"))
		{
			request.post('/research/admin/outlets/research_copy_contact',
				utilities2.make_params({data:this.form.get("value")})). then
				(this._copy_call_back);
		}
	},
	_copy_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			//topic.publish(PRCOMMON.Events.Employee_Updated,{employeeid: parseInt(this.employeeid.get("value"))});
			alert("Contact Copied. Please verify the 'Research tab' to make sure these changes haven't effected it");
			if (response.data.source_series == true && response.data.destination_series == false)
			{
				alert("Series members were affected. Please run employee synchronisation process");
			}				
			else if (response.data.source_series == false && response.data.destination_series == true)
			{
				alert("Series members of DESTINATION publication were affected. Please run employee synchronisation process for DESTINATION publication");
			}				
			else if (response.data.source_series == true && response.data.destination_series == true)
			{
				alert("Series members of BOTH source AND destination publications were affected. Please run employee synchronisation process for both of them");
			}			
			this._dialog.hide();
		}
		else
		{
			alert ( "Problem Copying Contact" ) ;
		}
	},
	// standard clear function
	clear:function()
	{
		this.outletid.set("value", null ) ;
		this.outletdeskid.set("value", -1);
		domattr.set(this.heading,"innerHTML" , "" ) ;
		domclass.add(this.desk_view,"prmaxhidden");

	},
	clear2:function()
	{
		this.outletid.set("value", null ) ;
		this.outletdeskid.set("value", -1);
	},
	load:function( employeeid, employeename, dialog, outletid)
	{
		this.clear();
		this.employeeid.set("value", employeeid );
		domattr.set(this.heading,"innerHTML" , employeename ) ;
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
		if (this.outletid.value != "")
		{
			request.post('/research/admin/outlets/research_outlet_is_child',
				utilities2.make_params({data:{outletid:this.outletid.value}})). then
				(this._outlet_selected_call_back);
		}
	},
	_outlet_selected_call:function ( response )
	{
		if ( response.is_child == false )
		{
			this.outletdeskid.set("query",{outletid:response.outletid});
			this.outletdeskid.set("value", null);
			domclass.remove(this.desk_view,"prmaxhidden");
		}
		else
		{
			alert ( "Cannot copy a contact to a child outlet. Please select a parent outlet." ) ;
			this.clear2();
		}
	},	
});
});





