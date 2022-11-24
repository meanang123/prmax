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
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../freelance/templates/FreelanceDelete.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"dojox/form/BusyButton",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template, request, utilities2,lang,topic,domattr){
 return declare("research.freelance.FreelanceDelete",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._delete_call_back = lang.hitch(this, this._delete_call );
		this._dialog = null;
	},
		postCreate:function()
		{
			this.reasoncodes.set("store",PRCOMMON.utils.stores.Research_Reason_Del_Codes());

			this.inherited(arguments);
		},
		_delete_submit:function()
		{
			if ( utilities2.form_validator(this.form)==false)
			{
				alert("Not all required fields filled in");
				throw "N";
			}
			if ( this.reason.get("value").length == 0 )
			{
				alert("No Description Given");
				this.reason.focus();
				return;
			}

			if ( confirm("Delete Freelance " + domattr.get(this.heading,"innerHTML" ) + "?"))
			{
				if ( confirm("Delete Freelancer are you sure?"))
				{
					request.post('/research/admin/outlets/research_delete',
						utilities2.make_params({data: this.form.get("value")})).then
						(this._delete_call_back);
				}
			}
		},
		_delete_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				topic.publish(PRCOMMON.Events.Outlet_Deleted,response.data);
				alert("Freelance Deleted");
				this.clear();
				this._dialog.hide();
			}
			else
			{
				alert ( "Problem Deleteing Freelancer" ) ;
			}
		},
		// styandard clear function
		clear:function()
		{
			this.outletid.set("value", -1 ) ;
			this.reasoncodes.set("value",null);
			this.reason.set("value","");
			domattr.set(this.heading,"innerHTML" , "" ) ;
		},
		load:function( outletid, freelancename )
		{
			this.outletid.set("value", outletid );
			domattr.set(this.heading,"innerHTML" , freelancename ) ;
			this.reasoncodes.set("value", null);
			this.reason.focus();
		},
		focus:function()
		{
			this.reason.focus();
		},
		_setDialogAttr:function ( dialog )
		{
			this._dialog = dialog;
		}
});
});





