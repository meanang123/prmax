//>>built
require({cache:{"url:prcommon2/search/templates/Frequency.html":"<div class=\"frequencies\">\r\n\t<table width=\"99%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" >\r\n\t\t<tr><td width=\"20%\"   class=\"prmaxrowtag\">Frequency</td>\r\n\t\t\t\t<td width=\"75%\" ><select data-dojo-attach-point=\"select\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='searchAttr:\"name\",labelType:\"html\"' data-dojo-attach-event=\"onChange:_changed\" ></td>\r\n\t\t\t\t<td width=\"5%\"align=\"right\" valign=\"top\" ><div data-dojo-attach-point=\"countnode\" data-dojo-type=\"prcommon2/search/SearchCount\"></div></td>\r\n\t\t</tr>\r\n\t</table>\r\n</div>\r\n\r\n"}});define("prcommon2/search/Frequency",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../search/templates/Frequency.html","prcommon2/search/std_search","dojo/_base/lang","dojo/dom-attr","dojo/dom-class","dojo/dom-style","dojo/json","dojo/data/ItemFileReadStore","prcommon2/search/std_search","dijit/form/FilteringSelect","prcommon2/search/SearchCount"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a){return _1("prcommon2.search.Frequency",[_2,_4],{templateString:_3,name:"",value:"",title:"",search:"",size:"9",testmode:false,constructor:function(){this.store=new _a({url:"/common/lookups?searchtype=frequencies&ignoreoption=1"});},postCreate:function(){this.select.set("store",this.store);this.select.set("value",-1);},_changed:function(){this._get_selector(this._get_data());},clear:function(){this.select.set("value",-1);this._get_selector("");this.inherited(arguments);},_setValueAttr:function(_b){var _c=false;this.clear();this._get_selector(this._getValueAttr());},_getValueAttr:function(){return this._get_data();},_get_data:function(){var _d=parseInt(this.select.get("value"));if(this._extended){return {data:_d};}else{this.value=(_d!=null&&_d!=-1)?_9.stringify(_d):"";return this.value;}},_focus:function(){this.select.focus();},_capture_extended_content:function(_e){var _f=this.inherited(arguments);_f.partial=0;return _f;}});});