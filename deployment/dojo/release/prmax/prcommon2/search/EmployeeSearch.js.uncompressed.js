require({cache:{
'url:prcommon2/search/templates/EmployeeSearch.html':"<div class=\"searchform\">\r\n\t<div class=\"paddingcell\" >\r\n\t\t<form data-dojo-props='\"class\":\"prmaxdefault\",name:\"std_search_employee\",cellspacing:\"0\",cellpadding:\"0\",formid:\"std_search_employee_form\",onsubmit:\"return false\"' data-dojo-type=\"ttl/Form2\" data-dojo-attach-point=\"form_name\">\r\n\t\t\t<input data-dojo-props='type:\"hidden\",value:\"employee\",name:\"search_type\"' data-dojo-type=\"dijit/form/TextBox\" />\r\n\t\t\t<div class=\"paddingrow\">&nbsp;</div>\r\n\t\t\t<div data-dojo-props='usepartial:true,search:\"std_search_employee\",keytypeid:133,name:\"employee_searchname_ext\"' data-dojo-type=\"prcommon2/search/person\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div  data-dojo-props='search:\"std_search_employee\",keytypeid:120 ,name:\"employee_roles\",style:\"width:99%\",showdefaultoption:false' data-dojo-type=\"prcommon2/search/SearchRoles\" ></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div data-dojo-props='search:\"std_search_employee\",style:\"width:99%\",keytypeid:7,name:\"employee_interests\"' data-dojo-type=\"prcommon2/interests/Interests\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div data-dojo-props='search:\"std_search_employee\",style:\"width:99%\",keytypeid:121,name:\"employee_outlettypes\"' data-dojo-type=\"prcommon2/search/PrmaxOutletTypes\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div data-dojo-props='search:\"std_search_employee\",style:\"width:99%\",keytypeid:27,name:\"employee_countryid\"' data-dojo-type=\"prcommon2/search/Countries\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<input type=\"submit\" style=\"display:none\"/>\r\n\t\t</form>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:   AdvanceSearch.js
// Author:  Chris Hoy
//
//-----------------------------------------------------------------------------
define("prcommon2/search/EmployeeSearch", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/EmployeeSearch.html",
	"dijit/layout/ContentPane",
	"prcommon2/search/std_search",
	"dijit/form/TextBox",
	"prcommon2/search/SearchCount",
	"ttl/Form2",
	"prcommon2/search/standard",
	"prcommon2/interests/Interests",
	"prcommon2/search/PrmaxOutletTypes",
	"prcommon2/search/SearchRoles",
	"prcommon2/search/person",
	"prcommon2/search/standard2",
	"prcommon2/search/Countries"
	], function(declare, BaseWidgetAMD, template, ContentPane){
 return declare("prcommon2.search.EmployeeSearch",
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





