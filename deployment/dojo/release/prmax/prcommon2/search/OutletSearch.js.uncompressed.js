require({cache:{
'url:prcommon2/search/templates/OutletSearch.html':"<div class=\"searchform\">\r\n\t<div class=\"paddingcell\" >\r\n\t\t<form data-dojo-props='onsubmit:\"return false\",\"class\":\"prmaxtable\",name:\"std_search_outlet\",formid:\"std_search_outlet_form\"' data-dojo-attach-point=\"form_name\" data-dojo-type=\"ttl/Form2\" >\r\n\t\t<input data-dojo-props='type:\"hidden\",value:\"outlet\",name:\"search_type\"' data-dojo-type=\"dijit/form/TextBox\" />\r\n\t\t<br/>\r\n\t\t<div  data-dojo-props='usepartial:true,displayname:\"Outlet Name\",keytypeid:1,name:\"outlet_searchname\",value:\"\"' data-dojo-attach-point=\"std_search_outlet_outlet_name\" data-dojo-type=\"prcommon2/search/standard\"></div>\r\n\t\t<hr/>\r\n\t\t<div data-dojo-props='style:\"width:99%\",keytypeid:23,name:\"outlet_outlettypes\"' data-dojo-type=\"prcommon2/search/PrmaxOutletTypes\"></div>\r\n\t\t<hr/>\r\n\t\t<div data-dojo-props='style:\"width:99%\",keytypeid:6,size:8,name:\"outlet_interests\"' data-dojo-type=\"prcommon2/interests/Interests\"></div>\r\n\t\t<hr/>\r\n\t\t<div  data-dojo-type=\"prcommon2/search/SearchRoles\" data-dojo-props='keytypeid:119,name:\"outlet_roles\",style:\"width:99%\",showdefaultoption:false' data-dojo-attach-point=\"search_outlet_roles\" ></div>\r\n\t\t<hr/>\r\n\t\t<div data-dojo-props='style:\"width:99%\",keytypeid:50,name:\"outlet_coverage\"' data-dojo-attach-point=\"outlet_coverage\" data-dojo-type=\"prcommon2/geographical/Geographical\" ></div>\r\n\t\t<hr/>\r\n\t\t<div data-dojo-props='style:\"width:99%\",displayname:\"Circulation\",keytypeid:4,name:\"outlet_circulation\"' data-dojo-type=\"prcommon2/search/Circulation\"></div>\r\n\t\t<hr/>\r\n\t\t<div data-dojo-props='displayname:\"Profile\",keytypeid:102,name:\"outlet_profile\",value:\"\"' data-dojo-type=\"prcommon2/search/standard\"></div>\r\n\t\t<hr/>\r\n\t\t<div data-dojo-props='displayname:\"Frequency\",keytypeid:3,name:\"outlet_frequency\"' data-dojo-type=\"prcommon2/search/Frequency\"></div>\r\n\t\t<hr/>\r\n\t\t<div data-dojo-props='displayname:\"Publisher\",keytypeid:137,name:\"outlet_publisher\"' data-dojo-type=\"prcommon2/search/Publisher\"></div>\r\n\t\t<hr/>\r\n\t\t<div data-dojo-props='usepartial:true,displayname:\"Feature\",keytypeid:128,name:\"outlet_advance_feature\",value:\"\"' data-dojo-type=\"prcommon2/search/standard\"></div>\r\n\t\t<hr/>\r\n\t\t<div data-dojo-props='style:\"width:99%\",keytypeid:24,name:\"outlet_countryid\"' data-dojo-type=\"prcommon2/search/Countries\"></div>\r\n\t\t<input data-dojo-props='type:\"hidden\",name:\"searchtypeid\",value:1' data-dojo-attach-point=\"searchtypeid\" data-dojo-type=\"dijit/form/TextBox\"/>\r\n\t\t<input type=\"submit\" style=\"display:none\"/>\r\n\t\t</form>\r\n\t</div>\r\n</div>"}});
//-----------------------------------------------------------------------------
// Name:   AdvanceSearch.js
// Author:  Chris Hoy
//
//-----------------------------------------------------------------------------
define("prcommon2/search/OutletSearch", [
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
	"prcommon2/search/Publisher",
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





