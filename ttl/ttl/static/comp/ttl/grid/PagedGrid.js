//-----------------------------------------------------------------------------
// Name:    Grid.js
// Author:  Chris Hoy
// Purpose:
// Created: 01/05/2012
//
// To do:
//
//-----------------------------------------------------------------------------

define(["dojo/_base/declare",
	"dgrid/Selection",
	"dgrid/extensions/DijitRegistry",
	"dgrid/Grid",
	"dgrid/extensions/Pagination",
	"dgrid/TouchScroll",
	"dojo/dom-style"],
	function(declare, Selection, DijitRegistry, StdGrid, Pagination, TouchScroll, domstyle){
 return declare("ttl.grid.PagedGrid",
	[StdGrid, Pagination, Selection, DijitRegistry, TouchScroll],{
	postCreate:function()
	{
		this.inherited(arguments);
		domstyle.set(this.domNode, "height", "100%");
		}
});
});

