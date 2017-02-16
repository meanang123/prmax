//-----------------------------------------------------------------------------
// Name:   AdvanceSearch.js
// Author:  Chris Hoy
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/OutletSearch.html",
	"dijit/layout/ContentPane",
	"prcommon2/search/std_search",
	"prcommon2/search/SearchCount",
	"ttl/Form2",
	"dijit/form/TextBox",
	"prcommon2/search/standard",
	"prcommon2/search/PrmaxOutletTypes",
	"prcommon2/interests/Interests",
	"prcommon2/search/SearchRoles",
	"prcommon2/geographical/Geographical",
	"prcommon2/search/Circulation",
	"prcommon2/search/Frequency",
	"prcommon2/search/Countries"
	], function(declare, BaseWidgetAMD, template, ContentPane){
 return declare("prcommon2.search.OutletSearch",
	[BaseWidgetAMD, ContentPane],{
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
	},
	clear:function()
	{
		dojo.every(this.form_name.getChildren(),
			function(widget)
			{
				if ( widget.clear != null)
					{
						widget.clear();
					}
					return true;
			});
	}
});
});





