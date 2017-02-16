//-----------------------------------------------------------------------------
// Name:   AdvanceSearch.js
// Author:  Chris Hoy
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/AdvanceSearch.html",
	"prcommon2/search/std_search",
	"dijit/form/TextBox",
	"prcommon2/search/SearchCount",
	"ttl/Form2",
	"dijit/form/TextBox",
	"prcommon2/date/DateSearchExtended",
	"prcommon2/search/standard",
	"prcommon2/search/PrmaxOutletTypes"
	], function(declare, BaseWidgetAMD, template){
 return declare("prcommon2.search.AdvanceSearch",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
	},
	postCreate:function()
	{
		this.inherited( arguments ) ;
	},
	_getFormAttr:function()
	{
		return this.std_search_advance_form;
	}
});
});





