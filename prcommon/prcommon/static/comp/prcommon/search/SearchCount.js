//-----------------------------------------------------------------------------
// Name:    prcommon.search.SearchCount
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.search.SearchCount");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.search.SearchCount",
	[ ttl.BaseWidget ],
	{
		templatePath: dojo.moduleUrl( "prcommon.search","templates/SearchCount.html"),
		// styandard clear function
		Clear:function()
		{
			this.innerNode.innerHTML ="&nbsp;";
		},
		_getValueAttr:function()
		{
			return this.innerNode.innerHTML;
		},
		_setValueAttr:function( value )
		{
			this.innerNode.innerHTML =value;
		}
	}
);
