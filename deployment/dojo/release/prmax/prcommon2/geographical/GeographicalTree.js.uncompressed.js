require({cache:{
'url:prcommon2/geographical/templates/GeographicalTree.html':"<div>\r\n\t<div data-dojo-attach-point=\"tree\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' ></div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:2em\"'>\r\n\t\t<button data-dojo-props='type:\"button\",style:\"float:right;padding-right:10px\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_close\">Close</button>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    geographicals.js
// Author:  Chris Hoy
// Purpose: Show geographical coverage in a tree
// Created: 28/09/2010
//
// To do:
//
//-----------------------------------------------------------------------------
define("prcommon2/geographical/GeographicalTree", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dijit/layout/BorderContainer",
	"dojo/text!../geographical/templates/GeographicalTree.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojox/data/JsonRestStore",
	"dijit/tree/ForestStoreModel",
	"dijit/Tree"
	], function(declare, BaseWidgetAMD, BorderContainer, template, request, utilities2, json,lang, topic, JsonRestStore, ForestStoreModel, Tree ){
 return declare("prcommon2.geographical.GeographicalTree",
	[BaseWidgetAMD, BorderContainer],{
	templateString:template,
	constructor: function()
	{
		this.json_store = new JsonRestStore({target:"/geographical/resttree", labelAttribute:"name"});
		this.myModel = new ForestStoreModel({
			store: this.json_store,
			deferItemLoadingUntilExpand: true,
			query: "root",
			childrenAttrs: ["children"]});
		this._dialog = null;
	},
	postCreate:function()
	{
		this.treenode = new Tree({
			model: this.myModel,
			showRoot:true,
			label: "Countries",
			persist: false
		});

		this.tree.domNode.appendChild(this.treenode.domNode);
		this.treenode.startup();
		dojo.connect(this.treenode,"onDblClick", lang.hitch(this,this._select_node));

		this.inherited(arguments);
	},
	_select_node:function(e)
	{
		topic.publish(PRCOMMON.Events.Geographical_Selected , { geographicalid:e.id, geographicalname:e.name}) ;
	},
	_close:function()
	{
		if (this._dialog)
			this._dialog.hide();
		else
			topic.publish(PRCOMMON.Events.Dialog_Close , "geog_close" ) ;
	},
	_setDialogAttr:function(dialog)
	{
		this._dialog = dialog;
	}
});
});





