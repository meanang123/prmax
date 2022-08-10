//-----------------------------------------------------------------------------
// Name:    Grid.js
// Author:  Chris Hoy
// Purpose:
// Created: 01/05/2012
//
// To do:
//
//-----------------------------------------------------------------------------

define("ttl/grid/Grid", ["dojo/_base/declare",
	"dojo/dom-style",
	"dgrid/List",  
	"dgrid/OnDemandGrid",
	"dgrid/Selection",
	"dgrid/editor",
	"dgrid/Keyboard",
	"dgrid/tree",
	"dgrid/extensions/DijitRegistry",
	"dgrid/TouchScroll"],
	function(declare, domstyle, OnDemandGrid, Selection, editor, Keyboard, tree, DijitRegistry, TouchScroll){
 return declare("ttl.grid.Grid",
	[OnDemandGrid,Selection,editor,Keyboard,tree,DijitRegistry,TouchScroll],{
	pagingDelay:100, // too prevent  on large grids lot of extra data requests
	postCreate:function()
	{
		this.inherited(arguments);
		domstyle.set(this.domNode, "height", "100%");
		}
});
});

