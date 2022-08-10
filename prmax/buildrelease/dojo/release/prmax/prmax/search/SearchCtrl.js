/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.search.SearchCtrl"]){dojo._hasResource["prmax.search.SearchCtrl"]=true;dojo.provide("prmax.search.SearchCtrl");dojo.require("prcommon.search.Countries");dojo.declare("prmax.search.SearchCtrl",null,{constructor:function(){this.advance_mode=0;this.mode_append_search=1;this.mode_new_search=0;this.search_forms=["std_search_employee_form","std_search_freelance_form","std_search_outlet_form","std_search_quick_form","std_search_mps_form","std_search_advance_form","std_search_crm_form"];this.search_tabs=["std_search_employee","std_search_freelance","std_search_outlet","std_search_quick","std_search_mps","std_search_advance","std_search_crm"];this.mode=PRMAX.utils.settings.searchappend;dojo.subscribe(PRCOMMON.Events.Search_Total,dojo.hitch(this,this._SearchCountEvent));this._SearchCountCallBack=dojo.hitch(this,this._SearchCount);},onLoadSearchControl:function(){dojo.connect(dijit.byId("std_search_clear"),"onClick",dojo.hitch(this,this.Clear));dojo.connect(dijit.byId("std_search_search"),"_onClick",dojo.hitch(this,this.doSearch));dojo.connect(dijit.byId("std_search_last"),"onClick",dojo.hitch(this,this._LoadCriteria));this._LoadCallBack=dojo.hitch(this,this._Results);this.tabContainer=dijit.byId("std_search_tabcontainer");this.search_dialog=dijit.byId("search_dialog");this._search_cancel=dijit.byId("std_search_search");this._search_append=dijit.byId("search_append");this._search_partial=dijit.byId("search_partial");this._std_search_search=dijit.byId("std_search_search");dojo.connect(this._search_append,"onClick",dojo.hitch(this,this._ChangeMode));dojo.connect(dijit.byId("std_search_total_button"),"onClick",dojo.hitch(this,this._SearchFindActualTotal));this.SetAppendMode();for(var _1=1;_1<6;_1++){var _2=ttl.utilities.getTabButton(this.tabContainer,_1);dojo.subscribe(this.tabContainer.id+"-selectChild",dojo.hitch(this,this.onSelectTab));}for(var _1 in this.search_tabs){var _3=this.search_tabs[_1];dojo.connect(dijit.byId(_3),"onLoad",dojo.hitch(this,this._Test,_3));}},_Test:function(_4){this.Clear();this.focus();dojo.connect(dijit.byId(_4+"_form"),"onSubmit",dojo.hitch(this,this._Submit,_4));},_Submit:function(_5,_6){this._std_search_search.makeBusy();try{this.doSearch(_6);}finally{this._std_search_search.cancel();}},_LoadCriteria:function(){this.Clear();var _7=dijit.byId(this.tabContainer.selectedChildWidget.id+"_form");_7.setExtendedMode(false);_7.set("value",this.content);_7.setExtendedMode(false);},_SaveCriteria:function(){var _8=dijit.byId(this.tabContainer.selectedChildWidget.id+"_form");_8.setExtendedMode(true);try{this.content=_8.get("value");}finally{_8.setExtendedMode(false);}},_PartialMatch:function(){var _9={partial:this._search_partial.get("value"),search:this.tabContainer.selectedChildWidget.id};dojo.publish(PRCOMMON.Events.Search_PartialMatch,[_9]);},_ChangeMode:function(){this.mode=this._search_append.get("checked")?this.mode_append_search:this.mode_new_search;this._setTitle();},SetAppendMode:function(){this._search_append.set("checked",this.mode==this.mode_new_search?false:true);this._setTitle();},Clear:function(){this._search_cancel.cancel();for(var _a in this.search_forms){var _b=dijit.byId(this.search_forms[_a]);if(_b){dojo.every(_b.getDescendants(),function(_c){if(_c.Clear!=null){_c.Clear();}return true;});}this.mode=PRMAX.utils.settings.searchappend;this._search_append.set("checked",this.mode);}},_Results:function(_d){if(_d.success=="FA"){alert("No Result Found");this._search_cancel.cancel();return;}ttl.utilities.showMessageStd("Please Wait Loading Page ..............",1000);dojo.publish(PRCOMMON.Events.SearchSession_Changed,[_d.data,this.mode,this.advance_mode]);this._SaveCriteria();if(_d.data.total==0){alert("No Result Found");}else{this.search_dialog.hide();}this._search_cancel.cancel();},doSearchError:function(){ttl.utilities.errorchecker(arguments);this._search_cancel.cancel();},doSearch:function(){this._Search(this.tabContainer.selectedChildWidget.id+"_form");},_Search:function(_e){var _f=dijit.byId(_e);_f.setExtendedMode(false);var _10=_f.get("value");var _11=dijit.byId("search_partial");if(this._IsEmpty(_10)==true){alert("No Search Criteria Specified");this._search_cancel.cancel();return;}else{if(_e=="std_search_outlet_form"){var _12=dijit.byId("search_outlet_roles");if(_12!=null&&_12.get("value").length>0&&_12.get("IsDefault")==true&&this._SearchCriteriaCount(_10)==1){alert("This search will return all outlets. Please select another criteria e.g. Media Channel");this._search_cancel.cancel();return;}}}_10["mode"]=this.mode?0:1;_10["search_partial"]=_11?_11.checked?2:0:2;ttl.utilities.showMessageStd("Searching ..............",1000);dojo.xhrPost(ttl.utilities.makeParams({load:this._LoadCallBack,url:"/search/dosearch",content:_10}));},_IsEmpty:function(_13){var _14=_13["search_type"];for(var _15 in _13){if(_15.indexOf(_14)!=-1){if(_13[_15].length!=0){return false;}}}return true;},_SearchCriteriaCount:function(_16){var _17=_16["search_type"];var _18=0;for(var _19 in _16){if(_19.indexOf(_17)!=-1){if(_16[_19].length!=0){_18+=1;}}}return _18;},_show:function(){this.focus();},show_search_form:function(_1a){if(this.search_dialog==undefined){var _1b=document.createElement("div");var _1c="/layout/std_search";if(_1a!=null){_1c=_1c+="?mode=features";}document.body.appendChild(_1b);var ww=new dijit.Dialog({id:"search_dialog",href:_1c,title:"Search",style:"width:700px;height:500px;overflow:hidden",onLoad:dojo.hitch(this,this.onLoadSearchControl),onDownloadError:function(_1d){ttl.utilities.errorchecker(_1d);return this.errorMessage;}},_1b);this.search_dialog=dijit.byId("search_dialog");dojo.connect(this.search_dialog,"show",dojo.hitch(this.search_dialog,this._show));}else{this.SetAppendMode();this.Clear();}return this.search_dialog;},_setTitle:function(){var ret="Search ";if(this.mode==this.mode_new_search){ret+=" New List";}else{ret+=" Append to List";}this.search_dialog.titleNode.innerHTML=ret;},_SearchCountEvent:function(_1e){},_SearchFindActualTotal:function(){var _1f=dijit.byId(this.tabContainer.selectedChildWidget.id+"_form");_1f.setExtendedMode(false);var _20=_1f.get("value");_20["mode"]=this.mode==1?0:1;if(this._IsEmpty(_20)){return;}var _21=dijit.byId("search_partial");_20["search_partial"]=_21?_21.checked?2:0:0;this._search_transaction=PRCOMMON.utils.uuid.createUUID();_20["transaction"]=this._search_transaction;dojo.xhrPost(ttl.utilities.makeParams({load:this._SearchCountCallBack,url:"/search/dosearchcount",content:_20}));},_SearchCount:function(_22){},startup_fields:{"std_search_quick":"std_search_quick_outletname","std_search_outlet":"std_search_outlet_outlet_name","std_search_mps":"std_search_mps_name","std_search_freelance":"std_search_freelance_name","std_search_employee":"std_search_employee_name_ext"},onSelectTab:function(_23){if(this.startup_fields[_23.id]!==null&&this.startup_fields[_23.id]!=undefined){dijit.byId(this.startup_fields[_23.id]).focus();}},focus:function(){switch(this.tabContainer.selectedChildWidget.id){case "std_search_quick":dijit.byId("std_search_quick_outletname").focus();break;case "std_search_outlet":undefined;dijit.byId("std_search_outlet_outlet_name").focus();break;case "std_search_employee":dijit.byId("std_search_employee_name_ext").focus();break;case "std_search_freelance":dijit.byId("std_search_freelance_name").focus();break;}},StartUpAdvance:function(){try{this.tabContainer.selectChild(dijit.byId("std_search_advance"));}catch(e){}},_setAdvanceModeAttr:function(_24){this.advance_mode=_24;},_getAdvanceModeAttr:function(){return this.advance_mode;}});}