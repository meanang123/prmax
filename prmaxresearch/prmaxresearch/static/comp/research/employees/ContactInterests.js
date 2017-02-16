//-----------------------------------------------------------------------------
// Name:    ContactInterests.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/11/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../employees/templates/ContactInterests.html",
	"dojo/topic",
	"dojo/_base/lang",
	"dojo/request",
	"ttl/utilities2"
	], function(declare, BaseWidgetAMD, template, topic,  lang, request, utilities2){
 return declare("research.employees.ContactInterests",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._dialog = null;
		this._changed_call_back = lang.hitch( this, this._changed_call);
	},
	_change_interests:function()
	{
		if  ( confirm ("Change Keywords from the Selected Contact to these Keywords"))
		{
			request.post('/research/admin/employees/research_contact_interests',
				utilities2.make_params({data: this.form.get("value")})).then
				( this._changed_call_back);
		}
	},
	_changed_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Contact Keywords Changed");
			this._dialog.hide();
		}
		else
		{
			alert ( "Problem Changing Contact Keywords" ) ;
		}
	},
	_setDialogAttr:function( dialog )
	{
		this._dialog = dialog;
	}
});
});





