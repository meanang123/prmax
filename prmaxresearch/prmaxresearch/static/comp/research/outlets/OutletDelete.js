//-----------------------------------------------------------------------------
// Name:    OutletDelete.js
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
	"dojo/text!../outlets/templates/OutletDelete.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dijit/layout/ContentPane",
	"dijit/form/Button",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/Form"
	], function(declare, BaseWidgetAMD, template, request, utilities2, lang,topic,domattr){
 return declare("research.outlets.OutletEdit",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
			this._delete_call_back = lang.hitch(this, this._delete_call );
			this._error_call_back = lang.hitch(this, this._error_call);
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
			if ( confirm("Delete Outlet " + domattr.get(this.heading,"innerHTML" ) + "?"))
			{
				if ( confirm("Delete Outlet are you sure?"))
				{
					this.delete_btn.makeBusy();
					request.post('/research/admin/outlets/research_delete',
						utilities2.make_params({data:this.form.get("value"),timeout:90000})).then
						(this._delete_call_back);
				}
			}
		},
		_delete_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				topic.publish(PRCOMMON.Events.Outlet_Deleted,response.data);
				alert("Outlet Deleted");
				this._dialog.hide();
				this.clear();
			}
			else
			{
				alert ( "Problem Deleteing Contact" ) ;
			}

			this.delete_btn.cancel();
		},
		// styandard clear function
		clear:function()
		{
			this.outletid.set("value", -1 ) ;
			this.reasoncodes.set("value",null);
			domattr.set(this.heading,"innerHTML" , "" ) ;
			this.delete_btn.cancel();
		},
		load:function( outletid, outletname, dialog)
		{
			this.outletid.set("value", outletid );
			domattr.set(this.heading,"innerHTML" , outletname ) ;
			this.reasoncodes.set("value", null);
			this._dialog = dialog;
		},
		_error_call:function()
		{
			alert("Taking time to delete please wait ");
			this.delete_btn.cancel();
		},
});
});





