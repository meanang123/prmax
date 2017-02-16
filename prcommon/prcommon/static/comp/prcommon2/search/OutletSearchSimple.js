//-----------------------------------------------------------------------------
// Name:   AdvanceSearch.js
// Author:  Chris Hoy
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/OutletSearchSimple.html",
	"prcommon2/search/std_search",
	"prcommon2/search/SearchCount",
	"ttl/Form2",
	"dijit/form/TextBox",
	"prcommon2/search/standard",
	], function(declare, BaseWidgetAMD, template){
 return declare("prcommon2.search.OutletSearchSimple",
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
		return this.form_name;
	}
});
});





