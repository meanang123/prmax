require({cache:{
'url:prcommon2/search/templates/FreelanceSearch.html':"<div class=\"searchform\">\r\n\t<div class=\"paddingcell\" >\r\n\t\t<form data-dojo-props='\"class\":\"prmaxdefault\",name:\"std_search_freelance\",cellspacing:\"0\",cellpadding:\"0\",onsubmit:\"return false\",formid:\"search_freelance\"' data-dojo-attach-point=\"form_name\" data-dojo-type=\"ttl/Form2\" >\r\n\t\t\t<input type=\"hidden\" value=\"freelance\"  name=\"search_type\" data-dojo-type=\"dijit/form/TextBox\" />\r\n\t\t\t<div class=\"paddingrow\">&nbsp;</div>\r\n\t\t\t<div data-dojo-props='usepartial:true,search:\"std_search_freelance\",keytypeid:136,name:\"freelance_searchname_ext\"' data-dojo-type=\"prcommon2/search/person\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div data-dojo-props='search:\"std_search_freelance\",displayname:\"Email\",keytypeid:113,name:\"freelance_email\"' data-dojo-type=\"prcommon2/search/standard\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div data-dojo-props='search:\"std_search_freelance\",displayname:\"Tel\",keytypeid:112,name:\"freelance_tel\"' data-dojo-type=\"prcommon2/search/standard\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div data-dojo-props='search:\"std_search_freelance\",style:\"width:99%\",keytypeid:14, name:\"freelance_interests\"' data-dojo-type=\"prcommon2/interests/Interests\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div data-dojo-props='search:\"std_search_freelance\",displayname:\"Profile\",keytypeid:115,name:\"freelance_profile\"' data-dojo-type=\"prcommon2/search/standard\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"searchtypeid\",value:1' data-dojo-attach-point=\"searchtypeid\" data-dojo-type=\"dijit/form/TextBox\"/>\r\n\t\t\t<input type=\"submit\" style=\"display:none\"/>\r\n\t\t</form>\r\n\t</div>\r\n</div>"}});
//-----------------------------------------------------------------------------
// Name:   AdvanceSearch.js
// Author:  Chris Hoy
//
//-----------------------------------------------------------------------------
define("prcommon2/search/FreelanceSearch", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/FreelanceSearch.html",
	"dijit/layout/ContentPane",
	"prcommon2/search/std_search",
	"dijit/form/TextBox",
	"prcommon2/search/SearchCount",
	"ttl/Form2",
	"prcommon2/search/standard",
	"prcommon2/interests/Interests"
	], function(declare, BaseWidgetAMD, template, ContentPane){
 return declare("prcommon2.search.FreelanceSearch",
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





