//-----------------------------------------------------------------------------
// Name:    prcommon.messages.view_message
// Author:  Chris Hoy
// Purpose:
// Created: 28/05/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.messages.view_message");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.messages.view_message",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.messages","templates/view_message.html"),
	constructor: function()
	{
		this._LoadCallBack = dojo.hitch(this,this._LoadCall );
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	 _LoadCall:function( response )
	{
		if ( response.success == "OK" )
		{
		}
		else
		{
		}
	},
	Load:function ( messageid )
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._LoadCallBack,
				url:"/message/get" ,
				content: { messageid: messageid }
		}));
	}
});





