//-----------------------------------------------------------------------------
// Name:    prcommon.advance.SaveToStanding
// Author:  Chris Hoy
// Purpose:
// Created: 14/12/2010
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prcommon.advance.SaveToStanding");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.advance.SaveToStanding",
	[ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.advance","templates/SaveToStanding.html"),
	constructor: function()
	{
		this._SavedCallBack = dojo.hitch(this, this._SavedCall );
		this._SaveNewCallBack = dojo.hitch ( this, this._SaveNewCall );
		this.store = new dojox.data.QueryReadStore(
		{	url:"/lists/lists?listtypeid=1",
			onError:ttl.utilities.globalerrorchecker
		});
	},
	postCreate:function()
	{
		this.lists.store = this.store ;

		this.inherited(arguments);
	},
	Load:function( advancefeatureslistid, selected , dlg)
	{
		this._Clear();
		this.advancefeatureslistid.set("value", advancefeatureslistid ) ;
		this.source.setOptions(selected);
		this.advancefeatureslistid2.set("value", advancefeatureslistid ) ;
		this.source2.setOptions(selected);
		this._dlg = dlg;
	},
	_DoSave:function()
	{
		if ( ttl.utilities.formValidator( this.requiredNode ) == false ||
				 confirm("Save To Media List?")==false)
		{
			this.saveNode.cancel();
			return ;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SavedCallBack,
				url:'/advance/save_to_standing',
				content: this.requiredNode.get("value")
		}));
	},
	_SavedCall:function(response)
	{
		if (response.success=="OK")
		{
			alert("Saved to Media List");
			this._dlg.hide();
			this._Clear();
		}
		else
		{
			alert("Problem Saving to Media List");
		}
		this.saveNode.cancel();
	},

	_SaveNewCall:function(response)
	{
		if (response.success=="OK")
		{
			this._dlg.hide();
			this._Clear();
			alert("Saved to Media List");
		}
		else if (response.success=="DU")
		{
			this.listname.focus();
			alert("List Already exists");
		}
		else
		{
			alert("Problem Saving to Media List");
		}
		this.saveNewNode.cancel();

	},
	_SaveNew:function()
	{
		if ( ttl.utilities.formValidator( this.formNew ) == false ||
				 confirm("Save To New Media List?")==false)
		{
			this.saveNewNode.cancel();
			return ;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SaveNewCallBack,
				url:'/advance/save_to_standing_new',
				content: this.formNew.get("value")
		}));

	},
	_Cancel:function()
	{
		this._dlg.hide();
		this._Clear();

	},
	_Clear:function()
	{
		this.saveNewNode.cancel();
		this.saveNode.cancel();
		this.listname.set("value","");
		this.tabController.selectChild(this.savetolisttab);
		this.advancefeatureslistid.set("value", null ) ;
		this.advancefeatureslistid2.set("value", null ) ;
	},
	resize:function()
	{
		console.log("save resize" , arguments);
		this.tabController.resize( {h:435,width:400} ) ;
	}
});
