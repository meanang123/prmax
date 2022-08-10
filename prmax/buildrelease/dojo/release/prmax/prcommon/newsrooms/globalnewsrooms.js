/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.newsrooms.globalnewsrooms"]){dojo._hasResource["prcommon.newsrooms.globalnewsrooms"]=true;dojo.provide("prcommon.newsrooms.globalnewsrooms");dojo.require("ttl.BaseWidget");dojo.declare("prcommon.newsrooms.globalnewsrooms",[ttl.BaseWidget],{name:"",value:"",displaytitle:"Global Newsrooms",search:"",size:"7",testmode:false,selectonly:false,startopen:false,preload:true,interesttypeid:1,restrict:1,widgetsInTemplate:true,templateString:"<div data-dojo-attach-point=\"containerNode\" >\r\n<!--\r\n\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" >\r\n\t\t<tr><td width=\"20%\" class=\"prmaxrowtag\">${displaytitle}</td>\r\n\t\t</tr>\r\n\t</table>\r\n-->\r\n\t<div class=\"dojolanguagesPane\" >\r\n\t\t<div data-dojo-attach-point=\"selectarea\" class=\"prmaxselectmultiple\" >\r\n\t\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\r\n\t\t\t\t  <tr><td width=\"47%\"></td><td width=\"5%\"></td><td width=\"48%\" ></td></tr>\r\n\t\t\t\t  <tr><td colspan=\"3\">\r\n\t\t\t\t  <table style=\"width:100%\" class=\"prmaxtable\" >\r\n\t\t\t\t\t  <tr>\r\n\t\t\t\t\t  <td width=\"40%\" data-dojo-attach-point=\"master_type_text\"><span class=\"prmaxrowtag\">Select </span><input data-dojo-type=\"dijit.form.TextBox\" data-dojo-props='\"class\":\"prmaxfocus prmaxinput\",type:\"text\",style:\"width:60%\"' data-dojo-attach-point=\"newsrooms_list_select\" data-dojo-attach-event=\"onkeyup:newsrooms_select_event\" /></td>\r\n\t\t\t\t\t  </tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t  </td></tr>\r\n\t\t\t\t  <tr><td ><select style=\"width:100%\" data-dojo-attach-point=\"newsrooms_list\" size=\"${size}\" class=\"lists\" multiple=\"multiple\" ></select></td>\r\n\t\t\t\t  <td >\r\n\t\t\t\t\t<button data-dojo-props='style:\"padding:0px;margin:0px\",disabled:\"true\",type:\"button\",\"class\":\"button_add_all\"' data-dojo-attach-point=\"button_all\" data-dojo-attach-event=\"onClick:newsrooms_select_all\" data-dojo-type=\"dijit.form.Button\"><div class=\"std_movement_button\">&gt;&gt;</div></button><br/>\r\n\t\t\t\t\t<button data-dojo-props='style:\"padding:0px;margin:0px\",disabled:\"true\",type:\"button\",\"class\":\"button_add_single\"' data-dojo-attach-point=\"button_single\" data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:newsrooms_select_single\"><div class=\"std_movement_button\">&gt;&nbsp;</div></button><br/>\r\n\t\t\t\t\t<button data-dojo-props='style:\"padding:0px;margin:0px\",disabled:\"true\",type:\"button\",\"class\":\"button_del_all\"' data-dojo-attach-point=\"button_del_all\" data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:newsrooms_remove_all\"><div class=\"std_movement_button\">&lt;&lt;</div></button><br/>\r\n\t\t\t\t\t<button data-dojo-props='style:\"padding:0px;margin:0px\",disabled:\"true\",type:\"button\",\"class\":\"button_del_single\"' data-dojo-attach-point=\"button_del_single\" data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:newsrooms_remove_single\"><div class=\"std_movement_button\">&lt;&nbsp;</div></button></td>\r\n\t\t\t\t  <td ><select style=\"width:100%\" data-dojo-attach-point=\"newsrooms_select\" size=\"${size}\" class=\"lists\"  data-dojo-attach-event=\"onchange:newsrooms_update_selection\"></select></td>\r\n\t\t\t\t  </tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n",constructor:function(){this.disabled=false;this._extended=false;this._LoadSelectionCall=dojo.hitch(this,this._LoadSelection);this.selectTimer=null;},postCreate:function(){dojo.connect(this.newsrooms_list_select.domNode,"onkeyup",dojo.hitch(this,this.newsrooms_select_event));dojo.connect(this.newsrooms_list,"onchange",dojo.hitch(this,this.newsrooms_update_selection));dojo.connect(this.newsrooms_list,"ondblclick",dojo.hitch(this,this.newsrooms_select_dbl));if(this.preload){this._Send_Request("*");}this.inherited(arguments);},Clear:function(){this._ClearSelectionBox();this._ClearSelectedBox();this.newsrooms_list_select.set("value","");this._Get(this._getValueAttr());this._SelectionOptions();this.inherited(arguments);},_Send_Request:function(_1){dojo.xhrPost(ttl.utilities.makeParams({load:this._LoadSelectionCall,url:"/newsroom/listuserselection",content:{word:_1}}));},newsrooms_select_event:function(){var _2=this.newsrooms_list_select.get("value");if(_2.length>0){if(this.selectTimer){clearTimeout(this.selectTimer);this.selectTimer=null;}this.selectTimer=setTimeout(dojo.hitch(this,this._Send_Request,_2),this.searchTime);}else{if(this.selectTimer){clearTimeout(this.selectTimer);this.selectTimer=null;}this._ClearSelectionBox();this._SelectionOptions();}},_LoadSelection:function(_3){this._ClearSelectionBox();for(var i=0;i<_3.data.length;++i){var _4=_3.data[i];this.newsrooms_list.options[this.newsrooms_list.options.length]=new Option(_4.description,_4.newsroomid);}this._SelectionOptions();},_ClearSelectionBox:function(){this.newsrooms_list.options.length=0;},_ClearSelectedBox:function(){this.newsrooms_select.length=0;},newsrooms_update_selection:function(){this._SelectionOptions();},newsrooms_select_dbl:function(){this.newsrooms_select_single();this._SelectionOptions();},newsrooms_select_all:function(){for(var c=0;c<this.newsrooms_list.options.length;c++){var _5=this.newsrooms_list.options[c];var _6=true;for(var c1=0;c1<this.newsrooms_select.options.length;c1++){if(this.newsrooms_select.options[c1].value==_5.value){_6=false;break;}}if(_6){this.newsrooms_select.options[this.newsrooms_select.options.length]=new Option(_5.text,_5.value);}}this._Get(this._getValueAttr());this.newsrooms_list.options.length=0;this.newsrooms_update_selection();},newsrooms_select_single:function(){for(var c=0;c<this.newsrooms_list.options.length;c++){var _7=this.newsrooms_list.options[c];if(_7.selected){_7.selected=false;var _8=true;for(var c1=0;c1<this.newsrooms_select.options.length;c1++){if(this.newsrooms_select.options[c1].value==_7.value){_8=false;break;}}if(_8){this.newsrooms_select.options[this.newsrooms_select.options.length]=new Option(_7.text,_7.value);this._Get(this._getValueAttr());}}}},newsrooms_remove_all:function(){this.newsrooms_select.options.length=0;this.newsrooms_update_selection();this._Get(this._getValueAttr());},newsrooms_remove_single:function(){for(var c=0;c<this.newsrooms_select.options.length;c++){if(this.newsrooms_select.options[c].selected){this.newsrooms_select.options[c]=null;}}this.newsrooms_update_selection();this._Get(this._getValueAttr());},add_select:function(_9){this.newsrooms_select.options[this.newsrooms_select.options.length]=new Option(_9.description,_9.newsroomid);},_setValueAttr:function(_a){this.Clear();if(_a!=null){var _b=_a.data;var _c=false;if(_b==null||_b==undefined){_b=_a;}for(var _d in _b){var _e=_b[_d];this.newsrooms_select.options[this.newsrooms_select.options.length]=new Option(_e.description,_e.newsroomid);opne=true;}if(_c){this.make_open();}this._Get(this._getValueAttr());}},_getValueAttr:function(){var _f=Array();for(var c=0;c<this.newsrooms_select.options.length;c++){if(this._extended){_f[c]={newsroomid:parseInt(this.newsrooms_select.options[c].value),description:this.newsrooms_select.options[c].text};}else{_f[c]=parseInt(this.newsrooms_select.options[c].value);}}var obj={data:_f};if(this._extended){return obj;}else{var _f=_f.length>0?dojo.toJson(obj):"";this.value=_f;return _f;}},_getCountAttr:function(){return this.newsrooms_select.options.length;},_setExtendedAttr:function(_10){this._extended=_10;},change_filter:function(){this.newsrooms_select();},_SelectionOptions:function(){this.button_all.set("disabled",this.newsrooms_list.length?false:true);this.button_single.set("disabled",this.newsrooms_list.selectedIndex!=-1?false:true);this.button_del_all.set("disabled",this.newsrooms_select.length?false:true);this.button_del_single.set("disabled",this.newsrooms_select.selectedIndex!=-1?false:true);this._up_down();},_up_down:function(){var _11=true;var _12=true;if(this.newsrooms_select.options.length>1&&this.newsrooms_select.selectedIndex!=-1){if(this.newsrooms_select.selectedIndex>0){_11=false;}if(this.newsrooms_select.selectedIndex<this.newsrooms_select.options.length-1){_12=false;}}},_setDisabledAttr:function(_13){this.disabled=_13;},_getDisabledAttr:function(){return this.disabled;},_Get:function(){if(this.selectonly==false){this.inherited(arguments);}},_focus:function(){this.newsrooms_list_select.focus();}});}