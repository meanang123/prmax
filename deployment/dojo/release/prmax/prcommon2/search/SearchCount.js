//>>built
require({cache:{"url:prcommon2/search/templates/SearchCount.html":"<div data-dojo-attach-point=\"innerNode\" class=\"prmaxsearchcount\">&nbsp;</div>"}});define("prcommon2/search/SearchCount",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../search/templates/SearchCount.html"],function(_1,_2,_3){return _1("prcommon2.search.SearchCount",[_2],{templateString:_3,clear:function(){this.innerNode.innerHTML="&nbsp;";},_getValueAttr:function(){return this.innerNode.innerHTML;},_setValueAttr:function(_4){this.innerNode.innerHTML=_4;}});});