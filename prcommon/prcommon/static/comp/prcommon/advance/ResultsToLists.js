//-----------------------------------------------------------------------------
// Name:    prcommon.advance.ResultsToLists
// Author:  Chris Hoy
// Purpose: Save the currently selectect lsit too a new list
// Created: 21/11/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.advance.ResultsToLists");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.advance.ResultsToLists",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.advance","templates/resultstolists.html"),
	constructor: function()
	{
		this._SaveAsCallBack = dojo.hitch ( this , this._SaveAsCall ) ;
		this._SaveCallBack = dojo.hitch( this, this._SaveCall);

		this.store = new dojox.data.QueryReadStore(
		{	url:"/advance/lists",
			onError:ttl.utilities.globalerrorchecker
		});
	},
	postCreate:function()
	{
		this.lists.store = this.store ;

		this.inherited(arguments);
	},
	Load:function(advancefeatureslistid, selection, listname)
	{
		this.advancefeatureslistid.set("value",advancefeatureslistid);
		this.selection.setOptions (selection );
		this.advancefeatureslistid2.set("value",advancefeatureslistid);
		this.source2.setOptions (selection );
		dojo.attr(this.listname_view,"innerHTML", listname);
		this._Clear();
	},
	_Cancel:function()
	{
		dojo.publish(PRCOMMON.Events.Dialog_Close, ["adv_result_saveas_del"]);
		this.saveNode.cancel();
	},
	show:function()
	{
		dojo.addClass(this.selection_view,"prmaxhidden");
		this.saveNode.cancel();
		this.inherited(arguments);
	},
	_SaveAsCall:function ( response )
	{
		if ( response.success == "OK")
		{
			// result saved to a list show on main interface
			dojo.publish(PRCOMMON.Events.Advance_Session_Changed, [response.data,null,null,true]);
			this._Cancel();
		}
		else
		{
			alert("problem Saving too list");
			this.saveNode.cancel();
		}
	},
	_Save:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SaveAsCallBack,
				url:'/advance/results_to_list',
				content: this.form.get("value")
			}));
	},
	_ShowSelector:function()
	{
		dojo.toggleClass(this.selection_view,"prmaxhidden");
	},
	_Select:function()
	{
		var advlistid = this.lists.get("value");

		if (advlistid)
		{
			this.advancefeatureslistid.set("value", advlistid );
			dojo.attr(this.listname_view,"innerHTML", this.lists.get("displayedValue"));
		}
		this._ShowSelector();
	},
	_Add_List:function()
	{
		var lname = this.listname.get("value");
		if ( lname.Length == 0 )
		{
			alert("No List Name Supplied");
			this.listname.focus();
			return ;
		}

		if ( confirm( " Add new Features list - " + lname + " ?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._SaveCallBack,
					url:'/advance/createlist',
					content: { listname : lname }
				}));
		}
	},
	_SaveCall:function ( response )
	{
		if ( response.success == "OK")
		{
			// result saved to a list show on main interface
			this.advancefeatureslistid.set("value", response.data.advancefeatureslistid );
			dojo.attr(this.listname_view,"innerHTML", response.data.advancefeatureslistdescription);
			this._Hide();
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
	_Hide:function()
	{
		dojo.addClass(this.new_list_view, "prmaxhidden");
		this.lists.focus();
		this.addNode.cancel();
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
	},
	_Clear:function()
	{
		this.saveNode.cancel();
		this.addNode.cancel();
		this.listname.set("value","");
		this.lists.set("value",null);
		this.tabController.selectChild ( this.savetolisttab ) ;
	}
});





