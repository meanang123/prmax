require({cache:{
'url:prcommon2/search/templates/OutletSearchSimple.html':"<div class=\"searchform\">\r\n\t<div class=\"paddingcell\" >\r\n\t\t<form data-dojo-props='onsubmit:\"return false\",\"class\":\"prmaxtable\",name:\"std_search_outlet\",formid:\"std_search_outlet_form\"' data-dojo-attach-point=\"form_name\" data-dojo-type=\"ttl/Form2\" >\r\n\t\t<input data-dojo-props='type:\"hidden\",value:\"outlet\",name:\"search_type\"' data-dojo-type=\"dijit/form/TextBox\" />\r\n\t\t<div  data-dojo-props='usepartial:true,displayname:\"Outlet Name\",keytypeid:1,name:\"outlet_searchname\",value:\"\"' data-dojo-attach-point=\"std_search_outlet_outlet_name\" data-dojo-type=\"prcommon2/search/standard\"></div>\r\n\t\t<input data-dojo-props='type:\"hidden\",name:\"searchtypeid\",value:1' data-dojo-attach-point=\"searchtypeid\" data-dojo-type=\"dijit/form/TextBox\"/>\r\n\t\t<input type=\"submit\" style=\"display:none\"/>\r\n\t\t</form>\r\n\t</div>\r\n</div>"}});
//-----------------------------------------------------------------------------
// Name:   AdvanceSearch.js
// Author:  Chris Hoy
//
//-----------------------------------------------------------------------------
define("prcommon2/search/OutletSearchSimple", [
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





