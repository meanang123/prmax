//-----------------------------------------------------------------------------
// Name:    prmax.lists.SaveToList
// Author:  Chris Hoy
// Purpose:
// Created: 22/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.lists.DeleteToList");

dojo.declare("prmax.lists.DeleteToList",
	[ ttl.BaseWidget ],
	{
	selected:-1,
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.lists","templates/deletefromlist.html"),
	constructor: function()
	{
		this._DeleteListCall= dojo.hitch(this,this._DeleteList);
	},
	postCreate:function()
	{
		this.source.setOptions(this.selected);
		dojo.connect(this.requiredNode,"onSubmit",dojo.hitch(this,this._Submit));
	},
	_SubmitForm:function()
	{
		this.requiredNode.submit();
	},
	_Submit:function()
	{
		if ( confirm("Remove entries from search results?")==false)
		{
			this.saveNode.cancel();
			return;
		}
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._DeleteListCall,
				url:'search/sessiondelete',
				content: this.requiredNode.get("value")
		}));
	},
	_DeleteList:function(response)
	{
		if (response.success=="OK")
		{
			dojo.publish(PRCOMMON.Events.SearchSession_Changed, [ response.data] );
			dojo.publish(PRCOMMON.Events.Display_Clear,[false]);
			PRMAX.search.stdDialog.hide();
		}
		else
		{
			alert("Problem Deleting Selection");
		}

		this.saveNode.cancel();
	}
});
