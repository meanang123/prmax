//-----------------------------------------------------------------------------
// Name:    AdvanceDuplicate.js
// Author:  Chris Hoy
// Purpose:
// Created: 11/11/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../advance/templates/AdvanceDuplicate.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/layout/ContentPane",
	"dijit/form/Button"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic, domattr, domclass ){
	 return declare("research.advance.AdvanceDuplicate",
		[BaseWidgetAMD],{
		templateString: template,
		constructor: function()
		{
			this._duplicate_call_back = dojo.hitch(this, this._duplicate_call );
		},
		postCreate:function()
		{
			this.reasoncodes.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
			this.reasoncodes.set("value", PRCOMMON.utils.stores.Reason_Add_Default);

			this.inherited(arguments);
		},
		_duplicate_button:function()
		{
			if ( utilities2.form_validator(this.form)==false)
			{
				alert("Not all required fields filled in");
				throw "N";
			}

			if ( confirm("Duplicate Feature " + dojo.attr(this.heading,"innerHTML" ) + "?"))
			{
				request.post('/advance/research_duplicate',
						utilities2.make_params({ data: this.form.get("value")} )).then
						(this._duplicate_call_back);
			}
		},
		_duplicate_call:function ( response )
		{
			if ( response.success == "OK" )
			{
				topic.publish(PRCOMMON.Events.Feature_Added,response.data);
				alert("Feature Duplicate");
				this._dialog.hide();
				this.clear();
			}
			else
			{
				alert ( "Problem Duplicating Feature" ) ;
			}
		},
		_setDialogAttr:function(dialog)
		{
			this._dialog = dialog;
		},
		// styandard clear function
		clear:function()
		{
			this.advancefeatureid.set("value", -1 ) ;
			this.feature.set("value","");
			this.reasoncodes.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
			domattr.set(this.heading,"innerHTML" , "" ) ;
		},
		load:function( advancefeatureid, feature )
		{
			this.advancefeatureid.set("value", advancefeatureid );
			domattr.set(this.heading,"innerHTML" , feature ) ;
		}
});
});





