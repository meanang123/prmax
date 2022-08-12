/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.geographical.GeographicalEdit"]){dojo._hasResource["prmax.geographical.GeographicalEdit"]=true;dojo.provide("prmax.geographical.GeographicalEdit");dojo.declare("prmax.geographical.GeographicalEdit",[dijit._Widget,dijit._Templated,dijit._Container],{widgetsInTemplate:true,templateString:"<div class=\"dojogeographicalPane\" dojoAttachPoint=\"containerNode\" >\r\n\t<form class=\"prmaxdefault\" dojoAttachPoint=\"form\" dojoType=\"dijit.form.Form\" onSubmit=\"return false\">\r\n\t<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Name</td><td><input dojoType=\"dijit.form.ValidationTextBox\"name=\"geographicalname\" dojoAttachPoint=\"geographicalname\" trim=\"true\" required=\"true\" maxlength=\"85\" style=\"width:98%\" type=\"text\"  ></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Type</td><td><select dojoAttachPoint=\"geographicallookuptypeid\" name=\"geographicallookuptypeid\" dojotype =\"dijit.form.FilteringSelect\" dojoAttachEvent =\"onChange:_TypeChanged\" searchAttr=\"name\" labelType=\"html\" style=\"width:98%\" /></td></tr>\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"left\" >Parent</td></tr>\r\n\t\t<tr><td colspan=\"2\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t<tr ><td colspan=\"3\" ><span class=\"prmaxrowtag\">Select</span><input class=\"prmaxfocus prmaxinput\" type=\"text\" style=\"width:200px;padding-bottom:3px\" dojoType=\"dijit.form.TextBox\" dojoAttachPoint=\"geographical_list_select\" /></td></tr>\r\n\t\t<tr><td width=\"46%\"><select style=\"width:100%\" dojoAttachPoint=\"geographical_list\" size=\"7\" class=\"lists\" multiple=\"multiple\" ></select></td>\r\n\t\t\t\t<td>\r\n\t\t\t\t\t<button class=\"button_add_all\" style=\"padding:0px;margin:0px\" dojoAttachPoint=\"button_all\" disabled=\"true\" type=\"button\" dojoAttachEvent=\"onClick:_GeographicalSelectAll\" dojoType=\"dijit.form.Button\"><div class=\"std_movement_button\">&gt;&gt;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_add_single\" style=\"padding:0px;margin:0px\" dojoAttachPoint=\"button_single\" disabled=\"true\" type=\"button\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:_GeographicalSelectSingle\"><div class=\"std_movement_button\">&gt;&nbsp;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_del_all\" style=\"padding:0px;margin:0px\" dojoAttachPoint=\"button_del_all\" disabled=\"true\" type=\"button\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:_GeographicalRemoveAll\"><div class=\"std_movement_button\">&lt;&lt;</div></button><br/>\r\n\t\t\t\t\t<button class=\"button_del_single\" style=\"padding:0px;margin:0px\" dojoAttachPoint=\"button_del_single\" disabled=\"true\" type=\"button\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:_GeographicalRemoveSingle\"><div class=\"std_movement_button\">&lt;&nbsp;</div></button>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t<td  width=\"46%\"><select style=\"width:100%\" dojoAttachPoint=\"geographical_select\" size=\"7\" class=\"lists\" multiple=\"multiple\" dojoAttachEvent=\"onchange:_GeographicalUpdateSelection\"></select></td>\r\n\t\t</tr></table></td></tr>\r\n\t</table>\r\n\t<div dojoAttachPoint=\"child_view\">\r\n\t\t<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"left\" >Children</td></tr>\r\n\t\t\t<tr><td colspan=\"2\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t<tr ><td colspan=\"3\" ><span class=\"prmaxrowtag\">Select</span><input class=\"prmaxfocus prmaxinput\" type=\"text\" style=\"width:200px;padding-bottom:3px\" dojoType=\"dijit.form.TextBox\" dojoAttachPoint=\"child_list_select\" /></td></tr>\r\n\t\t\t<tr><td width=\"46%\"><select style=\"width:100%\" dojoAttachPoint=\"child_list\" size=\"7\" class=\"lists\" multiple=\"multiple\" ></select></td>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<button class=\"button_add_all\"  style=\"padding:0px;margin:0px\" dojoAttachPoint=\"child_btn_all\" disabled=\"true\" type=\"button\" dojoAttachEvent=\"onClick:_ChildSelectAll\" dojoType=\"dijit.form.Button\"><div class=\"std_movement_button\">&gt;&gt;</div></button><br/>\r\n\t\t\t\t\t\t<button class=\"button_add_single\" style=\"padding:0px;margin:0px\" dojoAttachPoint=\"child_btn_single\" disabled=\"true\" type=\"button\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:_ChildSelectSingle\"><div class=\"std_movement_button\">&gt;&nbsp;</div></button><br/>\r\n\t\t\t\t\t\t<button class=\"button_del_add\" style=\"padding:0px;margin:0px\" dojoAttachPoint=\"child_btn_del_all\" disabled=\"true\" type=\"button\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:_ChildRemoveAll\"><div class=\"std_movement_button\">&lt;&lt;</div></button><br/>\r\n\t\t\t\t\t\t<button class=\"button_del_single\" style=\"padding:0px;margin:0px\" dojoAttachPoint=\"child_btn_del_single\" disabled=\"true\" type=\"button\" dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:_ChildRemoveSingle\"><div class=\"std_movement_button\">&lt;&nbsp;</div></button>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t<td  width=\"46%\"><select style=\"width:100%\" dojoAttachPoint=\"child_select\" size=\"7\" class=\"lists\" multiple=\"multiple\" dojoAttachEvent=\"onchange:_ChildUpdateSelection\"></select></td>\r\n\t\t\t</tr></table></td></tr>\r\n\t\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t</table>\r\n\t</div>\r\n\t<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t<tr><td colspan=\"2\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t<td align=\"left\"><button  style=\"padding:0px;margin:0px\" dojoAttachPoint=\"transfer\" type=\"button\" dojoAttachEvent=\"onClick:_Transfere\" dojoType=\"dijit.form.Button\" label=\"Show Transfer Coverage\"></button></td>\r\n\t\t<td><class=\"prmaxhidden\" button  style=\"padding:0px;margin:0px\" dojoAttachPoint=\"deletebtn\" type=\"button\" dojoAttachEvent=\"onClick:_Delete\" dojoType=\"dijit.form.Button\" label=\"Delete\"></button></td>\r\n\t\t<td align=\"right\"><button  style=\"padding:0px;margin:0px\" dojoAttachPoint=\"save\" type=\"button\" dojoAttachEvent=\"onClick:_Save\" dojoType=\"dijit.form.Button\" label=\"Save\"></button></td>\r\n\t\t</tr></table></tr></td>\r\n\t</table>\r\n\t</form>\r\n\t<div class=\"prmaxhidden\" dojoAttachPoint=\"show_transfer\" style=\"padding-top:5px\">\r\n\t\t<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t<tr><td colspan=\"3\" class=\"prmaxrowdisplaytitle\">Move Coverage to a New Area</td></tr>\r\n\t\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t\t<tr ><td colspan=\"3\" ><span class=\"prmaxrowtag\">Select</span><input class=\"prmaxfocus prmaxinput\" type=\"text\" style=\"width:200px;padding-bottom:3px\" dojoType=\"dijit.form.TextBox\" dojoAttachPoint=\"transfer_list_select\" /></td></tr>\r\n\t\t<tr><td width=\"46%\"><select style=\"width:100%\" dojoAttachPoint=\"transfer_list\" size=\"7\" class=\"lists\" ></select></td>\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr><td align=\"left\"><button  style=\"padding:0px;margin:0px\" dojoAttachPoint=\"transfer_do\" disabled=\"disabled\" type=\"button\" dojoAttachEvent=\"onClick:_Transfere_Do\" dojoType=\"dijit.form.Button\" label=\"Do Transfer Coverage To\"></button></td>\r\n\t\t</tr></table></td></tr>\r\n\r\n </div>\r\n",constructor:function(){this.geographical_types=new dojo.data.ItemFileReadStore({url:"/common/lookups?searchtype=geographicallookuptypes&typesonly=0"});this._CollectDetailsCallBack=dojo.hitch(this,this._CollectDetailsCall);this._AddCallBack=dojo.hitch(this,this._AddCall);this._UpdateCallBack=dojo.hitch(this,this._UpdateCall);this._LoadSelectionCallBack=dojo.hitch(this,this._LoadSelectionCall);this._LoadChildSelectionCallBack=dojo.hitch(this,this._LoadChildSelectionCall);this._TransferSelectionCallBack=dojo.hitch(this,this._TransferSelectionCall);this._DeleteCallBack=dojo.hitch(this,this._DeleteCall);this._TransferCallBack=dojo.hitch(this,this._TransferCall);this._geographicalid=-1;},postCreate:function(){this.geographicallookuptypeid.store=this.geographical_types;dojo.connect(this.geographical_list_select.domNode,"onkeyup",dojo.hitch(this,this._GeographicalSelect));dojo.connect(this.child_list_select.domNode,"onkeyup",dojo.hitch(this,this._ChildGeogSelect));dojo.connect(this.geographical_list,"onchange",dojo.hitch(this,this._GeographicalUpdateSelection));dojo.connect(this.geographical_list,"ondblclick",dojo.hitch(this,this._GeographicalSelectDbl));dojo.connect(this.geographical_select,"ondblclick",dojo.hitch(this,this._GeographicalSelectDeleteDbl));dojo.connect(this.geographical_select,"onchange",dojo.hitch(this,this._GeographicalUpdateSelection));dojo.connect(this.child_list,"onchange",dojo.hitch(this,this._ChildUpdateSelection));dojo.connect(this.child_list,"ondblclick",dojo.hitch(this,this._ChildSelectDbl));dojo.connect(this.child_select,"ondblclick",dojo.hitch(this,this._ChildSelectDeleteDbl));dojo.connect(this.child_select,"onchange",dojo.hitch(this,this._ChildUpdateSelection));dojo.connect(this.transfer_list_select.domNode,"onkeyup",dojo.hitch(this,this._TransferSelect));dojo.connect(this.transfer_list,"onchange",dojo.hitch(this,this._TransferSelectionOptions));},_GeographicalUpdateSelection:function(){this._SelectionOptions();},_ChildUpdateSelection:function(){this._ChildSelectionOptions();},_GeographicalSelectDbl:function(){this._GeographicalSelectSingle();this._SelectionOptions();},_GeographicalSelectAll:function(){for(var c=0;c<this.geographical_list.options.length;c++){var _1=this.geographical_list.options[c];var _2=true;for(var c1=0;c1<this.geographical_select.options.length;c1++){if(this.geographical_select.options[c1].value==_1.value){_2=false;break;}}if(_2){this.geographical_select.options[this.geographical_select.options.length]=new Option(_1.text,_1.value);}}this.geographical_list.options.length=0;this._GeographicalUpdateSelection();},_GeographicalSelectSingle:function(){for(var c=0;c<this.geographical_list.options.length;c++){var _3=this.geographical_list.options[c];if(_3.selected){_3.selected=false;var _4=true;for(var c1=0;c1<this.geographical_select.options.length;c1++){if(this.geographical_select.options[c1].value==_3.value){_4=false;break;}}if(_4){this.geographical_select.options[this.geographical_select.options.length]=new Option(_3.text,_3.value);}}}this._GeographicalUpdateSelection();},_GeographicalRemoveAll:function(){this.geographical_select.options.length=0;this._GeographicalUpdateSelection();},_GeographicalSelectDeleteDbl:function(_5){if(_5!=null&&_5.originalTarget!=null&&_5.originalTarget.index!=null){this.geographical_select.options[_5.originalTarget.index]=null;this._GeographicalUpdateSelection();}else{this._GeographicalRemoveSingle();}},_GeographicalRemoveSingle:function(){for(var c=0;c<this.geographical_select.options.length;c++){if(this.geographical_select.options[c].selected){this.geographical_select.options[c]=null;}}this._GeographicalUpdateSelection();},_LoadSelectionCall:function(_6){if(this._transactionid==_6.transactionid){this._ClearSelectionBox();for(var i=0;i<_6.data.length;++i){var _7=_6.data[i];this.geographical_list.options[this.geographical_list.options.length]=new Option(_7[0],_7[1]);}this._SelectionOptions();}},_LoadChildSelectionCall:function(_8){if(this._transactionid_child==_8.transactionid){this._ClearChildSelectionBox();for(var i=0;i<_8.data.length;++i){var _9=_8.data[i];this.child_list.options[this.child_list.options.length]=new Option(_9[0],_9[1]);}this._ChildSelectionOptions();}},_GeographicalSelect:function(){var _a=this.geographical_list_select.get("value");if(_a.length>0){this._transactionid=PRCOMMON.utils.uuid.createUUID();var _b=parseInt(this.geographicallookuptypeid.get("value"));if(_b==3){_b=6;}dojo.xhrPost(ttl.utilities.makeParams({load:this._LoadSelectionCallBack,url:"/geographical/listbytype",content:{word:_a,parentonly:1,filter:_b,transactionid:this._transactionid,cascade_region:1,extended_mode:true}}));}else{this._ClearSelectionBox();this._SelectionOptions();}},_ChildGeogSelect:function(){var _c=this.child_list_select.get("value");if(_c.length>0){this._transactionid_child=PRCOMMON.utils.uuid.createUUID();var _d=parseInt(this.geographicallookuptypeid.get("value"))-1;if(_d==5){_d=3;}dojo.xhrPost(ttl.utilities.makeParams({load:this._LoadChildSelectionCallBack,url:"/geographical/listbytype",content:{word:_c,filter:_d,transactionid:this._transactionid_child,cascade_region:2,extended_mode:true}}));}else{this._ClearChildSelectionBox();this._ChildSelectionOptions();}},_CollectDetailsCall:function(_e){if(_e.success=="OK"){this._MakeEdit();this._geographicalid=_e.data.geographical.geographicalid;this.geographicalname.set("value",_e.data.geographical.geographicalname);this.geographicallookuptypeid.set("value",_e.data.geographical.geographicallookuptypeid);for(var i=0;i<_e.data.parents.length;++i){var _f=_e.data.parents[i];this.geographical_select.options[this.geographical_select.options.length]=new Option(_f.geographicalname,_f.parentgeographicalareaid);}for(var i=0;i<_e.data.children.length;++i){var _f=_e.data.children[i];this.child_select.options[this.child_select.options.length]=new Option(_f.geographicalname,_f.childgeographicalareaid);}this._TypeChanged();}else{alert("Problem getting Details");}},Load:function(_10){this._Clear();this._geographicalid=_10;if(this._geographicalid>0){dojo.xhrPost(ttl.utilities.makeParams({load:this._CollectDetailsCallBack,url:"/geographical/getdetails",content:{geographicalid:this._geographicalid}}));}else{this._MakeNew();}},_Transfere:function(){dojo.toggleClass(this.show_transfer,"prmaxhidden");},_DeleteCall:function(_11){if(_11.success=="OK"){dojo.publish(PRCOMMON.Events.Geographical_Area_Delete,[_11.data]);}else{alert("Problem Deleting area");}},_Delete:function(){if(confirm("Delete Area")){dojo.xhrPost(ttl.utilities.makeParams({load:this._DeleteCallBack,url:"/geographical/delete_geographical",content:{geographicalid:this._geographicalid}}));}},_AddCall:function(_12){if(_12.success=="OK"){dojo.publish(PRCOMMON.Events.Geographical_Area_Add,[_12.data]);alert("Area Added");dojo.publish(PRCOMMON.Events.Dialog_Close,["gadd"]);}else{alert("Problem Adding Geographical Area");}},_UpdateCall:function(_13){if(_13.success=="OK"){dojo.publish(PRCOMMON.Events.Geographical_Area_Update,[_13.data]);alert("Updating Geographical Area");}else{if(_13.success=="DU"){alert("Area Already Exists");}else{alert("Problem Updating Geographical Area");}}},_Save:function(){if(ttl.utilities.formValidator(this.form)==false){alert("Not all required field filled in");return;}var _14=this.form.get("value");_14["geographicalid"]=this._geographicalid;var _15=Array();var _16=Array();for(var x=0;x<this.geographical_select.options.length;x++){_15[x]=parseInt(this.geographical_select.options[x].value);}_14["parents"]=dojo.toJson(_15);for(var x=0;x<this.child_select.options.length;x++){_16[x]=parseInt(this.child_select.options[x].value);}_14["children"]=dojo.toJson(_16);if(this._geographicalid==-1){dojo.xhrPost(ttl.utilities.makeParams({load:this._AddCallBack,url:"/geographical/add",content:_14}));}else{dojo.xhrPost(ttl.utilities.makeParams({load:this._UpdateCallBack,url:"/geographical/update",content:_14}));}},_Clear:function(){this.geographicalname.get("value","");this.geographical_select.options.length=0;this.geographical_list.options.length=0;this.child_select.options.length=0;this.child_list.options.length=0;this.geographicallookuptypeid.set("value",1);this._ClearSelectionBox();this._SelectionOptions();this._ClearChildSelectionBox();this._ChildSelectionOptions();this._ClearTransferSelectionBox();this._TransferSelectionOptions();dojo.addClass(this.show_transfer,"prmaxhidden");this.geographicalname.focus();},_MakeNew:function(){dojo.style(this.transfer.domNode,"display","none");dojo.style(this.deletebtn.domNode,"display","none");this.save.set("label","Add");},_MakeEdit:function(){dojo.style(this.transfer.domNode,"display","");dojo.style(this.deletebtn.domNode,"display","");this.save.set("label","Save");},_ClearSelectionBox:function(){this.geographical_list.options.length=0;},_ClearChildSelectionBox:function(){this.child_list.options.length=0;},_SelectionOptions:function(){this.button_all.set("disabled",this.geographical_list.length?false:true);this.button_single.set("disabled",this.geographical_list.selectedIndex!=-1?false:true);this.button_del_all.set("disabled",this.geographical_select.length?false:true);this.button_del_single.set("disabled",this.geographical_select.selectedIndex!=-1?false:true);},_ChildSelectionOptions:function(){this.child_btn_all.set("disabled",this.child_list.length?false:true);this.child_btn_single.set("disabled",this.child_list.selectedIndex!=-1?false:true);this.child_btn_del_all.set("disabled",this.child_select.length?false:true);this.child_btn_del_single.set("disabled",this.child_select.selectedIndex!=-1?false:true);},_TransferSelectionCall:function(_17){if(this._transactionid==_17.transactionid){this._ClearTransferSelectionBox();for(var i=0;i<_17.data.length;++i){var _18=_17.data[i];this.transfer_list.options[this.transfer_list.options.length]=new Option(_18[0]+"("+_18[1]+")",_18[1]);}this._TransferSelectionOptions();}},_TransferSelect:function(){var _19=this.transfer_list_select.get("value");if(_19.length>0){this._transactionid=PRCOMMON.utils.uuid.createUUID();dojo.xhrPost(ttl.utilities.makeParams({load:this._TransferSelectionCallBack,url:"/geographical/listbytype",content:{word:_19,filter:-1,transactionid:this._transactionid,extended_mode:true}}));}else{this._ClearTransferSelectionBox();this._TransferSelectionOptions();}},_ClearTransferSelectionBox:function(){this.transfer_list.options.length=0;},_TransferSelectionOptions:function(){this.transfer_do.set("disabled",this.transfer_list.selectedIndex!=-1?false:true);},_TransferCall:function(_1a){if(_1a.success=="OK"){dojo.publish(PRCOMMON.Events.Coverage_Moved,[]);alert("Coverage Moved");}else{alert("Problem Moving Coverage");}},_Transfere_Do:function(){if(confirm("Move Coverage to "+this.transfer_list.options[this.transfer_list.selectedIndex].text+"?")){dojo.xhrPost(ttl.utilities.makeParams({load:this._TransferCallBack,url:"/geographical/move_coverage",content:{fromgeographicalid:this._geographicalid,togeographicalid:this.transfer_list.options[this.transfer_list.selectedIndex].value}}));}},_TypeChanged:function(){var v=this.geographicallookuptypeid.get("value");if(v==1){dojo.addClass(this.child_view,"prmaxhidden");}else{dojo.removeClass(this.child_view,"prmaxhidden");}},_ChildSelectAll:function(){for(var c=0;c<this.child_list.options.length;c++){var _1b=this.child_list.options[c];var _1c=true;for(var c1=0;c1<this.child_select.options.length;c1++){if(this.child_select.options[c1].value==_1b.value){_1c=false;break;}}if(_1c){this.child_select.options[this.child_select.options.length]=new Option(_1b.text,_1b.value);}}this.child_list.options.length=0;this._ChildUpdateSelection();},_ChildSelectSingle:function(){for(var c=0;c<this.child_list.options.length;c++){var _1d=this.child_list.options[c];if(_1d.selected){_1d.selected=false;var _1e=true;for(var c1=0;c1<this.child_select.options.length;c1++){if(this.child_select.options[c1].value==_1d.value){_1e=false;break;}}if(_1e){this.child_select.options[this.child_select.options.length]=new Option(_1d.text,_1d.value);}}}this._ChildUpdateSelection();},_ChildRemoveAll:function(){this.child_select.options.length=0;this._ChildUpdateSelection();},_ChildSelectDbl:function(){this._ChildSelectSingle();this._ChildSelectionOptions();},_ChildSelectDeleteDbl:function(_1f){if(_1f!=null&&_1f.originalTarget!=null&&_1f.originalTarget.index!=null){this.child_select.options[_1f.originalTarget.index]=null;this._ChildUpdateSelection();}else{this._ChildRemoveSingle();}},_ChildRemoveSingle:function(){for(var c=0;c<this.child_select.options.length;c++){if(this.child_select.options[c].selected){this.child_select.options[c]=null;}}this._ChildUpdateSelection();}});}