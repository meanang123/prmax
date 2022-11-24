//-----------------------------------------------------------------------------
// Name:    AdvanceDelete.js
// Author:  Chris Hoy
// Purpose:
// Created: 14/10/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../advance/templates/AdvanceDelete.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/layout/ContentPane",
	"dijit/form/Button"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json,lang,topic, domattr, domclass ){
	 return declare("research.advance.AdvanceDelete",
		[BaseWidgetAMD],{
		templateString: template,
		constructor: function()
		{
			this._delete_call_back = dojo.hitch(this, this._delete_call );
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

			if ( confirm("Delete Feature " + domattr.get(this.heading,"innerHTML" ) + "?"))
			{
				if ( confirm("Delete Feature are you sure?"))
				{
					request.post('/advance/research_delete',
						utilities2.make_params({ data : this.form.get("value") })).then
						(this._delete_call_back);
				}
			}
		},
		_delete_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				topic.publish(PRCOMMON.Events.Feature_Deleted,response.data);
				alert("Feature  Deleted");
				this._dialog.hide();
				this.clear();
			}
			else
			{
				alert ( "Problem Deleteing Feature" ) ;
			}
		},
		_setDialogAttr:function( dialog )
		{
		this._dialog = dialog;
		},
		// styandard clear function
		clear:function()
		{
			this.advancefeatureid.set("value", -1 ) ;
			this.reasoncodes.set("value",null);
			this.reason.set("value","");
			domattr.set(this.heading,"innerHTML" , "" ) ;
		},
		load:function( advancefeatureid, feature )
		{
			this.advancefeatureid.set("value", advancefeatureid );
			domattr.set(this.heading,"innerHTML" , feature ) ;
			this.reasoncodes.set("value", null);
			this.reason.focus();
		},
		focus:function()
		{
			this.reason.focus();
		}
});
});





