//-----------------------------------------------------------------------------
// Name:    OutletSetPrimary.js
// Author:  Chris Hoy
// Purpose:
// Created: 03/03/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlets/templates/OutletSetPrimary.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dijit/layout/ContentPane",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/FilteringSelect",
	"dijit/form/Form",
	"dijit/form/Textarea"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json,lang,topic,domattr ){
 return declare("research.outlets.OutletSetPrimary",
	[BaseWidgetAMD],{
	templateString: template,
		constructor: function()
		{
			this._set_primary_call_back = lang.hitch(this, this._set_primary_call );
		},
		postCreate:function()
		{
			dojo.connect(this.form,"onSubmit",lang.hitch(this,this._set_primary_submit));
			this.reasoncodes.set("store",PRCOMMON.utils.stores.Research_Reason_Update_Codes());

			this.inherited(arguments);
		},
		_set_primary_submit:function()
		{
			if ( utilities2.form_validator(this.form)==false)
			{
				alert("Not all required fields filled in");
				throw "N";
			}
			if ( confirm("Set Primary  Contact " + domattr.get(this.heading,"innerHTML" ) + "?"))
			{
				request.post('/research/admin/employees/research_set_primary',
					utilities2.make_params({data: this.form.get("value") } )).then
					(this._set_primary_call_back);
			}
		},
		_set_primary_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				alert("Outlet Primary Contact Changed");
				this.clear();
				topic.publish('/emp/set_primary');
				this._dialog.hide();

			}
			else
			{
				alert ( "Problem Changed Primary Contact" ) ;
			}
		},
		// styandard clear function
		clear:function()
		{
			this.employeeid.set("value", -1 ) ;
			this.reasoncodes.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
			this.reason.set("value","");
			domattr.set(this.heading,"innerHTML" , "" ) ;
		},
		load:function( employeeid, employeename, job_title, dialog)
		{
			this._dialog = dialog;
			this.employeeid.set("value", employeeid );
			domattr.set(this.heading,"innerHTML" , employeename ) ;
			this.reasoncodes.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
			this.reason.focus();
		},
		focus:function()
		{
			this.reason.focus();
		}
});
});





