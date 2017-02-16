//-----------------------------------------------------------------------------
// Name:    prcommon.advance.DeleteFromList
// Author:  Chris Hoy
// Purpose:	Delete selected entries from and advance list
// Created: 14/12/2010
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prcommon.advance.DeleteFromList");

dojo.declare("prcommon.advance.DeleteFromList",
	[ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.advance","templates/DeleteFromList.html"),
	constructor: function()
	{
		this._DeleteListCall= dojo.hitch(this,this._DeleteList);
	},
	postCreate:function()
	{
		dojo.connect(this.requiredNode,"onSubmit",dojo.hitch(this,this._Submit));

		this.inherited(arguments);
	},
	Load:function( advancefeatureslistid, selected )
	{
		this.advancefeatureslistid.set("value", advancefeatureslistid ) ;
		this.source.setOptions(selected);
	},
	_SubmitForm:function()
	{
		this.requiredNode.submit();
	},
	_Submit:function()
	{
		if ( confirm("Remove entries?")==false)
		{
			this.saveNode.cancel();
			return;
		}
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._DeleteListCall,
				url:'/advance/delete_list_entries',
				content: this.requiredNode.get("value")
		}));
	},
	_DeleteList:function(response)
	{
		if (response.success=="OK")
		{
			dojo.publish(PRCOMMON.Events.Advance_Session_Changed, [ response.data] );
			dojo.publish(PRCOMMON.Events.Display_Clear,[false]);
			dojo.publish(PRCOMMON.Events.Dialog_Close,["delete_from_list"]);
		}
		else
		{
			alert("Problem Deleting Selection");
		}
		this.saveNode.cancel();
	}
});
