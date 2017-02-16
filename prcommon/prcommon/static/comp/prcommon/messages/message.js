//-----------------------------------------------------------------------------
// Name:    prcommon.messages.message
// Author:  Chris Hoy
// Purpose:
// Created: 28/05/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.messages.message");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.messages.selectdestination");

dojo.declare("prcommon.messages.message",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	messagedefaultvalue:2,
	templatePath: dojo.moduleUrl( "prcommon.messages","templates/message.html"),
	constructor: function()
	{
		this._SaveCallBack = dojo.hitch(this,this._SaveCall );
	},
	postCreate:function()
	{
		this.messagetypeid.store = PRCOMMON.utils.stores.MessageTypes();
		this.messagetypeid.set("value",this.messagedefaultvalue);

		this.inherited(arguments);
	},
	focus:function()
	{
		this.subject.focus();
	},
	Valid:function( isFocused )
	{
		if ( ttl.utilities.formValidator(this.formNode)==false)
		{
			alert("Not all required field filled in");
			return false;
		}

		if ( this.message.get("value").length == 0 )
		{
			alert("No Message Specified");
			return false;
		}
		return true ;
	},
	 _SaveCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Message Sent");
			dojo.publish ( PRCOMMON.Events.Message_Sent , [response.data ]);
			dojo.publish ( PRCOMMON.Events.Dialog_Close , ["mess_close"]);
		}
		else
		{
			alert("Problem changing Settings");
		}
	},
	Send:function()
	{
		if ( this.Valid() == false )
		return ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SaveCallBack,
				url:"/message/add" ,
				content: this.formNode.attr("value")
		}));
	},
	Clear:function()
	{
		this.messagetypeid.set("value",this.messagedefaultvalue);
		this.message.set("value","");
		this.subject.set("value","");
		this.parentmessageid.set("value",-1);
	},
	_ToButton:function()
	{
		this.select_user_dlg.show();
	}
});





