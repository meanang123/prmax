//>>built
require({cache:{"url:prcommon2/search/templates/ContactSearch.html":"<div class=\"searchform\">\r\n\t<div class=\"paddingcell\" >\r\n\t\t<form data-dojo-props='\"class\":\"prmaxdefault\",name:\"std_search_employee\",cellspacing:\"0\",cellpadding:\"0\",formid:\"std_search_employee_form\",onsubmit:\"return false\"' data-dojo-type=\"ttl/Form2\" data-dojo-attach-point=\"form_name\">\r\n\t\t\t<input data-dojo-props='type:\"hidden\",value:\"employee\",name:\"search_type\"' data-dojo-type=\"dijit/form/TextBox\" />\r\n\t\t\t<div class=\"paddingrow\">&nbsp;</div>\r\n\t\t\t<div data-dojo-props='usepartial:true,search:\"std_search_employee\",displayname:\"Surname\",keytypeid:10,name:\"employee_searchname\"' data-dojo-type=\"prcommon2/search/standard\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<input type=\"submit\" style=\"display:none\"/>\r\n\t\t</form>\r\n\t</div>\r\n</div>"}});define("prcommon2/search/ContactSearch",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../search/templates/ContactSearch.html","dijit/layout/ContentPane","prcommon2/search/std_search","dijit/form/TextBox","prcommon2/search/SearchCount","ttl/Form2","prcommon2/search/standard"],function(_1,_2,_3,_4){return _1("prcommon2.search.ContactSearch",[_2,_4],{templateString:_3,constructor:function(){},postCreate:function(){this.inherited(arguments);},_getFormAttr:function(){return this.form_name;},clear:function(){dojo.every(this.form_name.getChildren(),function(_5){if(_5.clear!=null){_5.clear();}return true;});}});});