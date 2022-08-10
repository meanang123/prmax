require({cache:{
'url:prcommon2/search/templates/AdvanceSearch.html':"<div class=\"searchform\">\r\n\t<div class=\"paddingcell\" >\r\n\t\t<form data-dojo-attach-point=\"std_search_advance_form\" data-dojo-props='name:\"search_advance\",formid:\"std_search_advance_form\",onsubmit:\"return false\"' data-dojo-type=\"ttl/Form2\" >\r\n\t\t\t<input data-dojo-props='type:\"hidden\",value:\"advance\",name:\"search_type\"' data-dojo-type=\"dijit/form/TextBox\" />\r\n\t\t\t<div class=\"paddingrow\">&nbsp;</div>\r\n\t\t\t<div  data-dojo-props='search:\"std_search_advance\",displayname:\"Publication Date\",keytypeid:124,name:\"advance_publicationdate\"' data-dojo-type=\"prcommon2/date/DateSearchExtended\"></div>\r\n\t\t\t<hr />\r\n\t\t\t<div  data-dojo-props='usepartial:true,search:\"std_search_advance\",displayname:\"Feature Text\",keytypeid:122,name:\"advance_advancename\"' data-dojo-type=\"prcommon2/search/standard\"></div>\r\n\t\t\t<hr />\r\n\t\t\t<div data-dojo-props='search:\"std_search_advance\",style:\"width:99%\",keytypeid:127,name:\"advance_outlettypes\"'data-dojo-type=\"prcommon2/search/PrmaxOutletTypes\"></div>\r\n\t\t\t<hr />\r\n\t\t\t<div data-dojo-props='usepartial:true,search:\"std_search_advance\",displayname:\"Outlet Name\",keytypeid:126,name:\"advance_outletname\"' data-dojo-type=\"prcommon2/search/standard\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<input type=\"submit\" style=\"display:none\"/>\r\n\t\t</form>\r\n\t</div>\r\n</div>"}});
//-----------------------------------------------------------------------------
// Name:   AdvanceSearch.js
// Author:  Chris Hoy
//
//-----------------------------------------------------------------------------
define("prcommon2/search/AdvanceSearch", [
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





