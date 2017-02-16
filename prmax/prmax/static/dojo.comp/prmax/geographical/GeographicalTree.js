//-----------------------------------------------------------------------------
// Name:    geographicals.js
// Author:  Chris Hoy
// Purpose: Show geographical coverage in a tree
// Created: 28/09/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.geographical.GeographicalTree");

dojo.require("ttl.BaseWidget");
dojo.require("dojox.rpc.Service");
dojo.require("dojox.data.JsonRestStore");
dojo.require("dijit.tree.ForestStoreModel");
dojo.require("dijit.Tree");

dojo.declare("prmax.geographical.GeographicalTree",
	[ ttl.BaseWidget],
	{
	templatePath: dojo.moduleUrl( "prmax.geographical","templates/GeographicalTree.html"),
	constructor: function()
	{
		this.inherited(arguments);

		this.jsonStore = new dojox.data.JsonRestStore({target:"/geographical/resttree", labelAttribute:"name"});
		this.myModel = new dijit.tree.ForestStoreModel({
				store: this.jsonStore,
				deferItemLoadingUntilExpand: true,
				query: "root",
				childrenAttrs: ["children"]});

	},
	postCreate:function()
	{
		this.treenode =   new dijit.Tree({
			model: this.myModel,
			showRoot:true,
			label: "Countries",
			persist: false
		});

		this.tree.domNode.appendChild(this.treenode.domNode);
		this.treenode.startup();
		dojo.connect(this.treenode,"onDblClick", dojo.hitch(this,this._SelectNode));

		this.inherited(arguments);
	},
	_SelectNode:function(e)
	{
		console.log ( e ) ;
		dojo.publish(PRCOMMON.Events.Geographical_Selected , [ { geographicalid:e.id, geographicalname:e.name} ] ) ;
	},
	_Close:function()
	{
		dojo.publish(PRCOMMON.Events.Dialog_Close , [ "geog_close" ] ) ;
	},
	resize:function()
	{
		this.frame.resize ( arguments[0] ) ;
		this.inherited ( arguments ) ;
	}
});





