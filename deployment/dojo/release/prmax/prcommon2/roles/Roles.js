//>>built
require({cache:{"url:prcommon2/roles/templates/Roles.html":"<div >\r\n\t<div class=\"dojoInterestPane\" >\r\n\t\t<div data-dojo-attach-point=\"selectarea\" style=\"display:none\" >\r\n\t\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\r\n\t\t\t\t  <tr><td width=\"47%\"></td><td width=\"5%\"></td><td width=\"48%\" ></td></tr>\r\n\t\t\t\t  <tr><td colspan=\"3\">\r\n\t\t\t\t  <table style=\"width:100%\" class=\"prmaxtable\" >\r\n\t\t\t\t\t  <tr>\r\n\t\t\t\t\t  <td width=\"70%\" data-dojo-attach-point=\"master_type_text\"><span class=\"prmaxrowtag\">Select </span><input class=\"prmaxfocus prmaxinput\" type=\"text\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='style:\"width:150px\"' data-dojo-attach-point=\"interest_list_select\" data-dojo-attach-event=\"onkeyup:interest_select_event\" /></td>\r\n\t\t\t\t\t<td><div data-dojo-attach-point=\"show_search_integration\" class=\"prmaxhidden\"><label data-dojo-attach-point=\"search_only_label\">Default to Primary</label><input data-dojo-attach-point=\"search_only\"  data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",value:\"1\"' /></div></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t  </td></tr>\r\n\t\t\t\t  <tr><td ><select style=\"width:100%\" name=\"roles\" data-dojo-attach-point=\"interest_list\" size=\"${size}\" class=\"lists\" multiple=\"multiple\" ></select></td>\r\n\t\t\t\t  <td >\r\n\t\t\t\t\t<button class=\"button_add_all\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_all\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-attach-event=\"onClick:interest_select_all\" data-dojo-type=\"dijit/form/Button\"><div class=\"std_movement_button\">&gt;&gt;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_add_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_single\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:interest_select_single\"><div class=\"std_movement_button\">&gt;&nbsp;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_del_all\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_del_all\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:interest_remove_all\"><div class=\"std_movement_button\">&lt;&lt;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_del_single\" style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"button_del_single\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:interest_remove_single\"><div class=\"std_movement_button\">&lt;&nbsp;</div></button></td>\r\n\t\t\t\t  <td ><select style=\"width:100%\" data-dojo-attach-point=\"interest_select\" size=\"${size}\" class=\"lists\"  data-dojo-attach-event=\"onchange:interest_update_selection\"></select></td>\r\n\t\t\t\t  <td>\r\n\t\t\t\t\t<button  style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"up\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-attach-event=\"onClick:_up_button\" data-dojo-type=\"dijit/form/Button\"><div style=\"width:2em\">Up</div></button><br/>\r\n\t\t\t\t\t<button style=\"padding:0px;margin:0px\" data-dojo-attach-point=\"down\" data-dojo-props='disabled:true,type:\"button\"' data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_down_button\"><div style=\"width:2em\">Down</div></button><br/>\r\n\t\t\t\t  </td></tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"}});define("prcommon2/roles/Roles",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../roles/templates/Roles.html","prcommon2/search/std_search","dojo/_base/lang","dojo/dom-attr","dojo/dom-class","dojo/dom-style","dojo/request","ttl/utilities2"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a){return _1("prcommon2.roles.Roles",[_2,_4],{templateString:_3,name:"",value:"",size:"7",startopen:false,searchmode:false,widgetsInTemplate:true,selectonly:true,orderbtns:true,constructor:function(){this.disabled=false;this._extended=false;this._load_selection_call=_5.hitch(this,this._load_selection);this.selectTimer=null;},postCreate:function(){dojo.connect(this.interest_list_select.domNode,"onkeyup",_5.hitch(this,this.interest_select_event));dojo.connect(this.interest_list,"onchange",_5.hitch(this,this.interest_update_selection));dojo.connect(this.interest_list,"ondblclick",_5.hitch(this,this.interest_select_dbl));if(this.startopen){_8.set(this.selectarea,"display","block");}else{_8.set(this.selectarea,"display","none");}if(this.orderbtns==false){_7.add(this.up.domNode,"prmaxhidden");_7.add(this.down.domNode,"prmaxhidden");}this.inherited(arguments);},clear:function(){this._clear_selection_box();this._clear_selected_box();this.interest_list_select.set("value","");this._get_selector(this._getValueAttr());this._selection_options();this.inherited(arguments);},_send_request:function(_b){var _c={word:_b};_9.post("/roles/listuserselection",_a.make_params({data:_c})).then(this._load_selection_call);},interest_select_event:function(){var _d=this.interest_list_select.get("value");if(_d.length>0){if(this.selectTimer){clearTimeout(this.selectTimer);this.selectTimer=null;}this.selectTimer=setTimeout(dojo.hitch(this,this._send_request,_d),this.searchTime);}else{if(this.selectTimer){clearTimeout(this.selectTimer);this.selectTimer=null;}this._ClearSelectionBox();this._SelectionOptions();}},_load_selection:function(_e){this._clear_selection_box();for(var i=0;i<_e.data.length;++i){var _f=_e.data[i];this.interest_list.options[this.interest_list.options.length]=new Option(_f[0],_f[1]);}this._selection_options();},_clear_selection_box:function(){this.interest_list.options.length=0;},_clear_selected_box:function(){this.interest_select.length=0;},interest_update_selection:function(){this._selection_options();},interest_select_dbl:function(){this.interest_select_single();this._selection_options();},interest_select_all:function(){for(var c=0;c<this.interest_list.options.length;c++){var _10=this.interest_list.options[c];var _11=true;for(var c1=0;c1<this.interest_select.options.length;c1++){if(this.interest_select.options[c1].value==_10.value){_11=false;break;}}if(_11){this.interest_select.options[this.interest_select.options.length]=new Option(_10.text,_10.value);}}this._get_selector(this._getValueAttr());this.interest_list.options.length=0;this.interest_update_selection();},interest_select_single:function(){for(var c=0;c<this.interest_list.options.length;c++){var _12=this.interest_list.options[c];if(_12.selected){_12.selected=false;var _13=true;for(var c1=0;c1<this.interest_select.options.length;c1++){if(this.interest_select.options[c1].value==_12.value){_13=false;break;}}if(_13){this.interest_select.options[this.interest_select.options.length]=new Option(_12.text,_12.value);this._get_selector(this._getValueAttr());}}}},interest_remove_all:function(){this.interest_select.options.length=0;this.interest_update_selection();this._get_selector(this._getValueAttr());},interest_remove_single:function(){for(var c=0;c<this.interest_select.options.length;c++){if(this.interest_select.options[c].selected){this.interest_select.options[c]=null;}}this.interest_update_selection();this._get_selector(this._getValueAttr());},add_select:function(_14){rolename=_14.rolename;this.interest_select.options[this.interest_select.options.length]=new Option(_14.rolename,_14.prmaxroleid);},_setValueAttr:function(_15){this.clear();if(_15!=null){var _16=_15.data;var _17=false;if(_16==null||_16==undefined){_16=_15;}for(var key in _16){var _18=_16[key];var _19="rolename";if(_18.rolename==undefined||_18.rolename==null){_19="prmaxrole";}this.interest_select.options[this.interest_select.options.length]=new Option(_18[_19],_18.prmaxroleid);opne=true;}if(_17){this.make_open();}this._get_selector(this._getValueAttr());}},_getValueAttr:function(){var _1a=Array();for(var c=0;c<this.interest_select.options.length;c++){if(this._extended){_1a[c]={interestid:parseInt(this.interest_select.options[c].value),interestname:this.interest_select.options[c].text};}else{_1a[c]=parseInt(this.interest_select.options[c].value);}}var obj=this._capture_extended_content({data:_1a});if(this._extended){return obj;}else{var _1a=_1a.length>0?dojo.toJson(obj):"";this.value=_1a;return _1a;}},_getCountAttr:function(){return this.interest_select.options.length;},_setExtendedAttr:function(_1b){this._extended=_1b;},change_filter:function(){this.interest_select();},_selection_options:function(){this.button_all.set("disabled",this.interest_list.length?false:true);this.button_single.set("disabled",this.interest_list.selectedIndex!=-1?false:true);this.button_del_all.set("disabled",this.interest_select.length?false:true);this.button_del_single.set("disabled",this.interest_select.selectedIndex!=-1?false:true);this._up_down();},_up_down:function(){var _1c=true;var _1d=true;if(this.interest_select.options.length>1&&this.interest_select.selectedIndex!=-1){if(this.interest_select.selectedIndex>0){_1c=false;}if(this.interest_select.selectedIndex<this.interest_select.options.length-1){_1d=false;}}this.up.set("disabled",_1c);this.down.set("disabled",_1d);},_up_button:function(){var _1e=this.interest_select.selectedIndex;if(_1e!=-1){var _1f=this.interest_select.options[_1e];var _20=this.interest_select.options[_1e-1];this.interest_select.options[_1e-1]=new Option(_1f.innerHTML,_1f.value,true);this.interest_select.options[_1e]=new Option(_20.innerHTML,_20.value);this._up_down();}},_down_button:function(){var _21=this.interest_select.selectedIndex;if(_21!=-1){var _22=this.interest_select.options[_21];var _23=this.interest_select.options[_21+1];this.interest_select.options[_21+1]=new Option(_22.innerHTML,_22.value,true);this.interest_select.options[_21]=new Option(_23.innerHTML,_23.value);this._up_down();}},_capture_extended_content:function(_24){var _25={logic:2};if(this.search_only.get("checked")){_25.search_only=true;}return dojo.mixin(_24,_25);},_setDisabledAttr:function(_26){this.disabled=_26;},_getDisabledAttr:function(){return this.disabled;},_get_selector:function(){if(this.selectonly==false){this.inherited(arguments);}},_focus:function(){this.interest_list_select.focus();},_toggle:function(){this.inherited(arguments);}});});