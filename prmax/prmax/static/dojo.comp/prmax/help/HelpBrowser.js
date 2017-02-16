//-----------------------------------------------------------------------------
// Name:    OutetTypes.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.help.HelpBrowser");

dojo.require("ttl.BaseWidget");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.Tree");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");

dojo.declare("prmax.help.HelpBrowser",
	[ ttl.BaseWidget ],
	{
		templatePath: dojo.moduleUrl( "prmax.help","templates/HelpBrowser.html"),
		constructor: function()
		{
			this.jsmethod = null;
			this.store = new dojo.data.ItemFileReadStore (
				{url:'/display/helptree',
				onError:ttl.utilities.globalerrorchecker,
				clearOnClose:true,
				urlPreventCache:true
				});

			this.treeModel = new dijit.tree.ForestStoreModel({
					store: this.store,
					query: {type: 1},
			        rootId: "rootNode",
					rootLabel: "Help Topics",
			        childrenAttrs: ["children"]});
		},
		postCreate:function()
		{
			this.treenode =   new dijit.Tree({
			model: this.treeModel,
  			showRoot:false,
			style:"width:200px;height:100%"
				});
		this.tree.appendChild(this.treenode.domNode);
		this.treenode.startup();
		dojo.connect(this.treenode,"onClick", dojo.hitch(this,this._TreeClick));
		dojo.connect(this.view,"onLoad", dojo.hitch(this,this._onLoadFrame));
		},
		_TreeClick:function(item)
		{
			this.jsmethod = null;
			console.log("TreeClick", item);
			if ( item.type==2)
			{
				console.log("item selected");
				if (item.jsmethod != null )
					this.jsmethod = item.jsmethod;
				this.view.attr("href",item.page)
			}
			if ( item.type==3)
			{
				ttl.utilities.openStdWindow ( item.page ) ;
			}
		},
		resize:function()
		{
			console.log("resize help");
			this.frame.resize(arguments[0]);
		},
		_onLoadFrame:function()
		{
			// On Load frame
			console.debug("onLoad called");
			if ( this.jsmethod )
				this[this.jsmethod]();
		},
		_LoadAbout:function()
		{
			dojo.byId("test_1").innerHTML=dojo.version.toString();
		}
	});





