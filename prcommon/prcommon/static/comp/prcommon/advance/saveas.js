//-----------------------------------------------------------------------------
// Name:    prcommon.advance.saveas
// Author:  Chris Hoy
// Purpose: Save the currently selectect lsit too a new list
// Created: 21/11/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.advance.saveas");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.advance.saveas",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.advance","templates/saveas.html"),
	constructor: function()
	{
		this._SaveAsCallBack = dojo.hitch ( this , this._SaveAsCall ) ;
		this._SaveCallBack = dojo.hitch( this, this._SaveCall);

		this.store = new dojox.data.QueryReadStore(
		{	url:"/advance/lists",
			onError:ttl.utilities.globalerrorchecker
		})
	},
	postCreate:function()
	{
		this.lists.store = this.store ;

		this.inherited(arguments);
	},
	focus:function()
	{
		this.listname.focus();
	},
	Load:function(advancefeatureslistid, selected)
	{
		this.advancefeatureslistid.set("value",advancefeatureslistid);
		this.advancefeatureslistid2.set("value",advancefeatureslistid);
		this.source.setOptions(selected);
		this.source2.setOptions(selected);
		this._Clear();
	},
	_Cancel:function()
	{
		dojo.publish(PRCOMMON.Events.Dialog_Close, ["adv_saveas_del"]);
		this._Clear();
	},
	_Clear:function()
	{
		this.saveNode.cancel();
		this.addNode.cancel();
		this.listname.set("value","");
		this.lists.set("value",null);
		this.tabController.selectChild ( this.savetolisttab ) ;
	},
	_SaveAsCall:function ( response )
	{
		if ( response.success == "OK")
		{
			// result saved to a list show on main interface
			dojo.publish(PRCOMMON.Events.Advance_Session_Changed, [response.data]);
			this._Clear();
			this._Cancel();
		}
		else if ( response.success == "SA" )
		{
				alert("Cannot Save to Self");
		}
		else
		{
			alert("problem Saving too list");
		}
		this.saveNode.cancel();
	},
	_Save:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required fields filled in");
			return;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SaveAsCallBack,
				url:'/advance/saveas',
				content: this.form.get("value")
			}));
	},
	_Add:function()
	{
		if ( ttl.utilities.formValidator(this.form2)==false)
		{
			alert("Not all required fields filled in");
			return;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SaveCallBack,
				url:'/advance/saveas_new',
				content: this.form2.get("value")
			}));

	},
	_SaveCall:function ( response )
	{
		if ( response.success == "OK")
		{
			// result saved to a list show on main interface
			dojo.publish(PRCOMMON.Events.Advance_Session_Changed, [response.data]);
			this._Clear();
			this._Cancel();
		}
		else if ( response.success == "DU")
		{
			alert("List Already Exists");
			this.listname.focus();
		}
		else
		{
			alert("Problem Creating List");
		}

		this.addNode.cancel();
	},
	resize:function()
	{
		console.log("save resize" , arguments);
		this.tabController.resize( {h:435,width:400} ) ;
	}
});





