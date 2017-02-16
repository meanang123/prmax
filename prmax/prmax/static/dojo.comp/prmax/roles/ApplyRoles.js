//-----------------------------------------------------------------------------
// Name:    prmax.roles.ApplyRoles
// Author:  Chris Hoy
// Purpose:
// Created: 22/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.roles.ApplyRoles");

dojo.declare("prmax.roles.ApplyRoles",
	[ttl.BaseWidget],
	{
	selected:-1,
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.roles","templates/ApplyRoles.html"),
	constructor: function()
	{
		this._SavedResultCall = dojo.hitch(this,this._SavedResult);
	},
	postCreate:function()
	{
		dojo.connect(this.form,"onSubmit",dojo.hitch(this,this._Submit));
		this.selectedNode.setOptions(this.selected);
		dojo.attr(this.label_primary, "for", this.primary.id);
		this.inherited(arguments);
	},
	_ApplyTagsButton:function()
	{
		if ( confirm("Apply Roles to Search Results"))
		{
			this.form.submit();
		}
	},
	_Submit:function()
	{
		// check selected tags
		dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._SavedResultCall,
					url:"/roles/applyroles" ,
					content: this.form.get("value")
			}));
	},
	_SavedResult:function(response)
	{
		this.saveNode.cancel();

		if (response.success=="OK")
		{
			alert("Roles Added");
			dojo.publish(PRCOMMON.Events.SearchSession_Changed, [response.data]);
			dojo.publish(PRCOMMON.Events.Dialog_Close, ["roles"]);
		}
		else
		{
			alert("Problem adding Roles");
		}
	},
	_Close:function()
	{
		dojo.publish(PRCOMMON.Events.Dialog_Close, ["roles"]);
	}
});
