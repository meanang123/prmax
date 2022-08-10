//>>built
require({cache:{"url:prcommon2/clippings/templates/selecttone.html":"<div data-dojo-attach-point=\"tones_node\" class=\"dijitInline dijitLeft dijitDownArrowButton dijitSelectFixedWidth dijitValidationTextBoxFixedWidth dijit dijitReset dijitSelect dijitValidationTextBox\">\r\n\t<p style=\"border:1px solid white;color:black;width:180px\" data-dojo-attach-point=\"selected_tones\">&nbsp;</p>\r\n\t<div class=\"dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton dijitArrowButtonContainer\" data-dojo-attach-point=\"_buttonNode\" role=\"presentation\" data-dojo-attach-event=\"onClick:_toggle\"><input class=\"dijitReset dijitInputField dijitArrowButtonInner\" value=\"▼ \" type=\"text\" tabindex=\"-1\" readonly=\"readonly\" role=\"button presentation\" aria-hidden=\"true\"></div>\r\n\t<div data-dojo-attach-point=\"tone_view\" style=\"height:6em;width:12em\" data-dojo-type=\"dijit/TooltipDialog\" data-dojo-attach-event=\"onBlur:_close_tooltip\">\r\n\t\t<div style=\"float:right\" data-dojo-attach-event='onClick:_close_pop_up'><i class=\"fa fa-close\"></i></div>\r\n\t\t<label><input data-dojo-attach-point=\"very_pos\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='type:\"checkbox\",checked:true,value:\"1\",tvalue:1,sname:\"VPos\"' data-dojo-attach-event=\"onClick:_change_tones\" />Very Positive</label><br/>\r\n\t\t<label><input data-dojo-attach-point=\"pos\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='type:\"checkbox\",checked:true,value:\"2\",tvalue:2,sname:\"Pos\"' data-dojo-attach-event=\"onClick:_change_tones\"/>Positive</label><br/>\r\n\t\t<label><input data-dojo-attach-point=\"neutral\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='type:\"checkbox\",checked:true,value:\"3\",tvalue:3,sname:\"Neu\"' data-dojo-attach-event=\"onClick:_change_tones\"/>Neutral</label><br/>\r\n\t\t<label><input data-dojo-attach-point=\"neg\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='type:\"checkbox\",checked:true,value:\"4\",tvalue:4,sname:\"Neg\"' data-dojo-attach-event=\"onClick:_change_tones\"/>Negative</label><br/>\r\n\t\t<label><input data-dojo-attach-point=\"very_neg\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='type:\"checkbox\",checked:true,value:\"5\",tvalue:5,sname:\"VNeg\"' data-dojo-attach-event=\"onClick:_change_tones\"/>Very Negative</label><br/>\r\n\t\t<hr/>\r\n\t\t<div style=\"width:100%;text-align:center\">\r\n\t\t\t<button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Select All\"' data-dojo-attach-event=\"onClick:_select_all\"></button>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n"}});define("prcommon2/clippings/selecttone",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../clippings/templates/selecttone.html","ttl/utilities2","dojo/topic","dojo/_base/lang","dojo/dom-attr","dojo/dom-class","dijit/popup","dijit/focus","dijit/form/CheckBox","dijit/TooltipDialog"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a){return _1("prcommon2.clippings.selecttone",[_2],{templateString:_3,name:"",value:"",constructor:function(){this.is_popup=false;this._close_popup_call=_6.hitch(this,this._close_popup);},postCreate:function(){_9.moveOffScreen(this.tone_view);this.inherited(arguments);_7.set(this.selected_tones,"innerHTML","ALL Tones");this._all_labels=[this.very_pos,this.pos,this.neutral,this.neg,this.very_neg];},_toggle:function(_b){if(this.is_popup==false){_9.open({popup:this.tone_view,around:this.tones_node,x:_b.x,y:_b.y,onClose:this._close_popup_call,});this.is_popup=true;this.tone_view.focus();}else{this.is_popup=false;_9.close(this.tone_view);}},_close_tooltip:function(){this._getValueAttr();this.is_popup=false;_9.close(this.tone_view);},_close_popup:function(){this._getValueAttr();this.is_popup=false;},_getValueAttr:function(){this.tones=[];for(var _c in this._all_labels){if(this._all_labels[_c].get("checked")){this.tones.push(this._all_labels[_c].get("tvalue"));}}this._get_selected_tones_text();return this.tones;},_setValueAttr:function(_d){if(_d!=null&&_d!=""){for(var _e in this._all_labels){this._all_labels[_e].set("checked",false);}for(var _e in _d){switch(_d[_e]){case 1:case "1":this.very_pos.set("checked",true);break;case 2:case "2":this.pos.set("checked",true);break;case 3:case "3":this.neutral.set("checked",true);break;case 4:case "4":this.neg.set("checked",true);break;case 5:case "5":this.very_neg.set("checked",true);break;}}this._getValueAttr();}},_get_selected_tones_text:function(){var _f="";for(var key in this._all_labels){if(this._all_labels[key].get("checked")){_f+=" "+this._all_labels[key].get("sname");}}if(this.tones.length==5){_f="ALL Tones";}if(this.tones.length==0){_f="No Selection";}_7.set(this.selected_tones,"innerHTML",_f);},_change_tones:function(btn){this._getValueAttr();},isValid:function(){this._getValueAttr();return this.tones.length==0?false:true;},_select_all:function(){for(var key in this._all_labels){this._all_labels[key].set("checked",true);}this._getValueAttr();},clear:function(){for(var key in this._all_labels){this._all_labels[key].set("checked",true);}this._getValueAttr();},_getDisplayedValueAttr:function(){return _7.get(this.selected_tones,"innerHTML");},_close_pop_up:function(){this._close_tooltip();}});});