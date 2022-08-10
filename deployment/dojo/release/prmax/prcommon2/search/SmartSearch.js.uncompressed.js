require({cache:{
'url:prcommon2/search/templates/SmartSearch.html':"<div>\r\n\t<div>\r\n\t\t<form data-dojo-props='onsubmit:\"return false\",\"class\":\"prmaxtable\",name:\"std_search_quick\",formid:\"std_search_quick_form\"' data-dojo-attach-point=\"form_name\" data-dojo-type=\"ttl/Form2\" >\r\n\t\t\t<br/>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",value:\"quick\",name:\"search_type\"' data-dojo-type=\"dijit/form/TextBox\" />\r\n\t\t\t<div  data-dojo-props='usepartial:true,displayname:\"Outlet Name\",keytypeid:1,name:\"quick_searchname\",value:\"\"' data-dojo-type=\"prcommon2/search/standard\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div data-dojo-props='usepartial:true,displayname:\"Surname\",keytypeid:138,name:\"quick_contactfull_ext\"' data-dojo-type=\"prcommon2/search/person\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div data-dojo-props='style:\"width:99%\",keytypeid:23,name:\"quick_outlettypes\"' data-dojo-type=\"prcommon2/search/PrmaxOutletTypes\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div data-dojo-props='style:\"width:99%\",keytypeid:114,size:8,name:\"quick_interests\",restrict:0' data-dojo-type=\"prcommon2/interests/Interests\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div data-dojo-props='style:\"width:99%\",keytypeid:50,name:\"quick_coverage\"' data-dojo-type=\"prcommon2/geographical/Geographical\" ></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div data-dojo-props='search:\"std_search_quick\",displayname:\"Tel\",keytypeid:118,name:\"quick_tel\",min:4' data-dojo-type=\"prcommon2/search/standard\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div data-dojo-props='search:\"std_search_quick\",displayname:\"Email\",keytypeid:117,name:\"quick_email\",min:4' data-dojo-type=\"prcommon2/search/standard\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div data-dojo-props='style:\"width:99%\",keytypeid:24,name:\"quick_countryid\"' data-dojo-type=\"prcommon2/search/Countries\"></div>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"searchtypeid\",value:1' data-dojo-attach-point=\"searchtypeid\" data-dojo-type=\"dijit/form/TextBox\"/>\r\n\t\t\t<input type=\"submit\" style=\"display:none\"/>\r\n\t\t</form>\r\n\t</div>\r\n</div>"}});
//-----------------------------------------------------------------------------
// Name:   AdvanceSearch.js
// Author:  Chris Hoy
//
//-----------------------------------------------------------------------------
define("prcommon2/search/SmartSearch", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/SmartSearch.html",
	"dijit/layout/ContentPane",
	"prcommon2/search/std_search",
	"prcommon2/search/SearchCount",
	"ttl/Form2",
	"dijit/form/TextBox",
	"prcommon2/search/standard",
	"prcommon2/search/PrmaxOutletTypes",
	"prcommon2/interests/Interests",
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
