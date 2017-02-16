//-----------------------------------------------------------------------------
// Name:    prmax.interests.ApplyTags
// Author:  Chris Hoy
// Purpose:
// Created: 22/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.interests.ApplyTags");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.declare("prmax.interests.ApplyTags",
	[dijit._Widget, dijit._Templated, dijit._Container],
	{
	selected:-1,
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.interests","templates/ApplyTags.html"),
	constructor: function()
	{
		this._SavedResultCall = dojo.hitch(this,this._SavedResult);
	},
	postCreate:function()
	{
		dojo.connect(this.form,"onSubmit",dojo.hitch(this,this._Submit));
		this.selectedNode.setOptions(this.selected);

		this.employeeradiolabel.setAttribute('for',this.employeeradio.id);
		this.outletradiolabel.setAttribute('for',this.outletradio.id);

		this.addtag.setAdded(dojo.hitch(this,this._AddedTags));

		dojo.connect(this.addpane,"toggle",dojo.hitch(this,this._OpenSave));
	},
	_OpenSave:function()
	{
		if (this.addpane.get("open"))
			this.addtag.focus();
	},

	_ApplyTagsButton:function()
	{
		this.form.submit();
	},
	_AddedTags:function(data)
	{
		this.interests.addSelect(data);
	},
	_Submit:function()
	{
		if (this.interests.get("count")==0)
		{
			alert("No Tags Selected");
			this.saveNode.cancel();
			return ;
		}
		// check selected tags
		dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._SavedResultCall,
					url:"/search/applytags" ,
					content: this.form.get("value")
			}));
	},
	_SavedResult:function(response)
	{
		console.log(response);
		this.saveNode.cancel();

		if (response.success=="OK")
		{
			alert("Tags Added");
			dojo.publish(PRCOMMON.Events.Display_ReLoad, []);
			dojo.publish(PRCOMMON.Events.Dialog_Close, ["tags"]);
		}
		else
		{
			alert("Problem adding Tags");
		}
	},
	destroy: function()
	{
		console.log("destroy called");
		this.inherited(arguments);
	},
	_Close:function()
	{
		dojo.publish(PRCOMMON.Events.Dialog_Close, ["tags"]);
	}
});
