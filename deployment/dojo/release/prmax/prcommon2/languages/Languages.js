//>>built
require({cache:{"url:prcommon2/languages/templates/Languages.html":"<div >\r\n\t<div class=\"dojolanguagesPane\" >\r\n\t\t<div data-dojo-attach-point=\"selectarea\" class=\"prmaxselectmultiple\" >\r\n\t\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\r\n\t\t\t\t  <tr><td width=\"47%\"></td><td width=\"5%\"></td><td width=\"48%\" ></td></tr>\r\n\t\t\t\t  <tr><td colspan=\"3\">\r\n\t\t\t\t  <table style=\"width:100%\" class=\"prmaxtable\" >\r\n\t\t\t\t\t  <tr>\r\n\t\t\t\t\t  <td width=\"70%\" data-dojo-attach-point=\"master_type_text\"><span class=\"prmaxrowtag\">Select </span><input class=\"prmaxfocus prmaxinput\" type=\"text\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='style:\"width:150px\"' data-dojo-attach-point=\"languages_list_select\" data-dojo-attach-event=\"onkeyup:languages_select_event\" /></td>\r\n\t\t\t\t\t<td><div data-dojo-attach-point=\"show_search_integration\" class=\"prmaxhidden\"><label data-dojo-attach-point=\"search_only_label\">Default to Primary</label><input data-dojo-attach-point=\"search_only\"  data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:\"1\"' /></div></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t  </td></tr>\r\n\t\t\t\t  <tr><td ><select style=\"width:100%\" name=\"roles\" data-dojo-attach-point=\"languages_list\" size=\"${size}\" class=\"lists\" multiple=\"multiple\" ></select></td>\r\n\t\t\t\t  <td >\r\n\t\t\t\t\t<button class=\"button_add_all\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_all\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-attach-event=\"onClick:languages_select_all\" data-dojo-type=\"dijit/form/Button\"><div class=\"std_movement_button\">&gt;&gt;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_add_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_single\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:languages_select_single\"><div class=\"std_movement_button\">&gt;&nbsp;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_del_all\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_del_all\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:languages_remove_all\"><div class=\"std_movement_button\">&lt;&lt;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_del_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_del_single\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:languages_remove_single\"><div class=\"std_movement_button\">&lt;&nbsp;</div></button></td>\r\n\t\t\t\t  <td ><select style=\"width:100%\" data-dojo-attach-point=\"languages_select\" size=\"${size}\" class=\"lists\"  data-dojo-attach-event=\"onchange:languages_update_selection\"></select></td>\r\n\t\t\t\t  </tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"}});define("prcommon2/languages/Languages",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../languages/templates/Languages.html","dojo/_base/lang","dojo/dom-attr","dojo/dom-class","dojo/dom-style","dojo/request","ttl/utilities2"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9){return _1("prcommon2.languages.Languages",[_2],{templateString:_3,name:"",value:"",size:"7",startopen:false,searchmode:false,widgetsInTemplate:true,selectonly:true,constructor:function(){this.disabled=false;this._load_selection_call=_4.hitch(this,this._load_selection);this.selectTimer=null;},postCreate:function(){dojo.connect(this.languages_list_select.domNode,"onkeyup",_4.hitch(this,this.languages_select_event));dojo.connect(this.languages_list,"onchange",_4.hitch(this,this.languages_update_selection));dojo.connect(this.languages_list,"ondblclick",_4.hitch(this,this.languages_select_dbl));this.inherited(arguments);},clear:function(){this._clear_selection_box();this._clear_selected_box();this.languages_list_select.set("value","");this._get_selector(this._getValueAttr());this._selection_options();this.inherited(arguments);},_send_request:function(_a){_8.post("/lanquages/listuserselection",_9.make_params({data:{word:_a}})).then(this._load_selection_call);},languages_select_event:function(){var _b=this.languages_list_select.get("value");if(_b.length>0){if(this.selectTimer){clearTimeout(this.selectTimer);this.selectTimer=null;}this.selectTimer=setTimeout(dojo.hitch(this,this._send_request,_b),this.searchTime);}else{if(this.selectTimer){clearTimeout(this.selectTimer);this.selectTimer=null;}this._clear_selection_box();this._selection_options();}},_load_selection:function(_c){this._clear_selection_box();for(var i=0;i<_c.data.length;++i){var _d=_c.data[i];this.languages_list.options[this.languages_list.options.length]=new Option(_d[0],_d[1]);}this._selection_options();},_clear_selection_box:function(){this.languages_list.options.length=0;},_clear_selected_box:function(){this.languages_select.length=0;},languages_update_selection:function(){this._selection_options();},languages_select_dbl:function(){this.languages_select_single();this._selection_options();},languages_select_all:function(){for(var c=0;c<this.languages_list.options.length;c++){var _e=this.languages_list.options[c];var _f=true;for(var c1=0;c1<this.languages_select.options.length;c1++){if(this.languages_select.options[c1].value==_e.value){_f=false;break;}}if(_f){this.languages_select.options[this.languages_select.options.length]=new Option(_e.text,_e.value);}}this._get_selector(this._getValueAttr());this.languages_list.options.length=0;this.languages_update_selection();},languages_select_single:function(){for(var c=0;c<this.languages_list.options.length;c++){var _10=this.languages_list.options[c];if(_10.selected){_10.selected=false;var _11=true;for(var c1=0;c1<this.languages_select.options.length;c1++){if(this.languages_select.options[c1].value==_10.value){_11=false;break;}}if(_11){this.languages_select.options[this.languages_select.options.length]=new Option(_10.text,_10.value);this._get_selector(this._getValueAttr());}}}},languages_remove_all:function(){this.languages_select.options.length=0;this.languages_update_selection();this._get_selector(this._getValueAttr());},languages_remove_single:function(){for(var c=0;c<this.languages_select.options.length;c++){if(this.languages_select.options[c].selected){this.languages_select.options[c]=null;}}this.languages_update_selection();this._get_selector(this._getValueAttr());},add_select:function(_12){this.languages_select.options[this.languages_select.options.length]=new Option(_12.languagename,_12.languageid);},_setValueAttr:function(_13){this.clear();if(_13!=null){var _14=_13.data;var _15=false;if(_14==null||_14==undefined){_14=_13;}for(var key in _14){var _16=_14[key];this.languages_select.options[this.languages_select.options.length]=new Option(_16.languagename,_16.languageid);opne=true;}if(_15){this.make_open();}this._get_selector(this._getValueAttr());}},_getValueAttr:function(){var _17=Array();for(var c=0;c<this.languages_select.options.length;c++){if(this._extended){_17[c]={languageid:parseInt(this.languages_select.options[c].value),languagename:this.languages_select.options[c].text};}else{_17[c]=parseInt(this.languages_select.options[c].value);}}var obj={data:_17};if(this._extended){return obj;}else{var _17=_17.length>0?dojo.toJson(obj):"";this.value=_17;return _17;}},_getCountAttr:function(){return this.languages_select.options.length;},_setExtendedAttr:function(_18){this._extended=_18;},change_filter:function(){this.languages_select();},_selection_options:function(){this.button_all.set("disabled",this.languages_list.length?false:true);this.button_single.set("disabled",this.languages_list.selectedIndex!=-1?false:true);this.button_del_all.set("disabled",this.languages_select.length?false:true);this.button_del_single.set("disabled",this.languages_select.selectedIndex!=-1?false:true);this._up_down();},_up_down:function(){var _19=true;var _1a=true;if(this.languages_select.options.length>1&&this.languages_select.selectedIndex!=-1){if(this.languages_select.selectedIndex>0){_19=false;}if(this.languages_select.selectedIndex<this.languages_select.options.length-1){_1a=false;}}},_setDisabledAttr:function(_1b){this.disabled=_1b;},_getDisabledAttr:function(){return this.disabled;},_get_selector:function(){if(this.selectonly==false){this.inherited(arguments);}},_focus:function(){this.languages_list_select.focus();}});});