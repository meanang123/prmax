/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.advance.listsview"]){dojo._hasResource["prcommon.advance.listsview"]=true;dojo.provide("prcommon.advance.listsview");dojo.require("prcommon.advance.newlist");dojo.require("prcommon.advance.renamelist");dojo.declare("prcommon.advance.listsview",[ttl.BaseWidget],{widgetsInTemplate:true,display:"Feature",templateString:"<div>\r\n<div dojoAttachPoint=\"borderCtrl\" dojotype=\"dijit.layout.BorderContainer\" style=\"width:100%;height:100%\" >\r\n\t<div dojoType=\"dijit.layout.ContentPane\" region=\"top\" style=\"width:100%;height:38px\" class=\"std_menu_view\">\r\n\t\t\t<div style=\"height:43px;width:100%;overflow:hidden;padding:0px;margin:0px\" class=\"std_menu_view\">\r\n\t\t\t\t<div style=\"height:100%;width:15%;float:left;padding:0px;margin:0px\" class=\"prmaxrowdisplaylarge\" dojoAttachPoint=\"displayNode\"></div>\r\n\t\t\t\t\t<div class=\"dijitToolbarTop\" dojoType=\"dijit.Toolbar\" style=\"float:left;height:100%;width:85%;padding:0px;margin:0px\" >\r\n\t\t\t\t\t\t<div dojoAttachEvent=\"onClick:_New\" dojoType=\"dijit.form.Button\" dojoAttachPoint=\"svl_new\" iconClass=\"fa fa-plus fa-3x\" showLabel=\"false\">New</div>\r\n\t\t\t\t\t\t<div dojoAttachEvent=\"onClick:_Delete\" dojoType=\"dijit.form.Button\" dojoAttachPoint=\"svl_delete\" iconClass=\"fa fa-trash fa-3x\" disabled=\"disabled\"  showLabel=\"false\">Delete</div>\r\n\t\t\t\t\t\t<div dojoAttachEvent=\"onClick:_Open\" dojoType=\"dijit.form.Button\" dojoAttachPoint=\"svl_open\"  iconClass=\"fa fa-folder-open fa-3x\" disabled=\"disabled\"   showLabel=\"true\">Open</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t</div>\r\n\t<div dojoType=\"dijit.layout.ContentPane\" region=\"left\" style=\"width:50%; \" splitter=\"true\" >\r\n\t\t<div dojoAttachPoint=\"listGrid\" dojoType=\"dojox.grid.DataGrid\"   query=\"{ }\" rowsPerPage=\"50\" style=\"width:100%;height:100%\" ></div>\r\n\t</div>\r\n\t<div dojoType=\"dijit.layout.ContentPane\" stlye=\"height:100%width:50%\" region=\"center\" >\r\n\t\t<div dojoType=\"dijit.TitlePane\" title=\"List Info\" dojoAttachPoint=\"list_info_pane\" style=\"width: 100%;display: none\">\r\n\t\t\t<table width=\"100%\" style=\"border-collapse:collapse\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr><td width=\"20%\">Name:</td><td width=\"70%\"><span dojoAttachPoint=\"svl_name_field\"></span></td><td width=\"90px\" rowspan=\"5\"><div style=\"width:120px;height:130px;padding-right:10px;padding-bottom:3px\">\r\n\t\t\t\t\t<div dojoAttachEvent=\"onClick:_DeleteSingle\" disabled=\"disabled\" dojoType=\"dijit.form.Button\" dojoAttachPoint=\"svl_list_delete\" ><div style=\"width:98px\" class=\"prmaxbutton\">Delete</div></div>\r\n\t\t\t\t\t<div dojoAttachEvent=\"onClick:_Rename\" disabled=\"disabled\" dojoType=\"dijit.form.Button\" dojoAttachPoint=\"svl_list_rename\" ><div style=\"width:98px\" class=\"prmaxbutton\">Rename</div></div>\r\n\t\t\t\t\t<div dojoAttachEvent=\"onClick:_OpenSingle\" disabled=\"disabled\" dojoType=\"dijit.form.Button\" dojoAttachPoint=\"svl_list_open\"><div style=\"width:98px\" class=\"prmaxbutton\">Open</div></div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</td></tr>\r\n\t\t\t\t<tr><td>Nbr Entries:</td><td><span dojoAttachPoint=\"svl_count_field\"></span></td></tr>\r\n\t\t\t\t<tr><td colspan=\"3\">&nbsp;</td></tr>\r\n\t\t\t\t<tr><td colspan=\"3\">&nbsp;</td></tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n\t<div dojoType=\"dijit.Dialog\" dojoAttachPoint=\"svl_list_new_dlg\" title=\"New List\" >\r\n\t\t<div dojoType=\"prcommon.advance.newlist\" dojoAttachPoint=\"svl_list_new_ctrl\"></div>\r\n\t</div>\r\n\t<div dojoType=\"dijit.Dialog\" dojoAttachPoint=\"adv_rename_dlg\" title=\"Rename\" >\r\n\t\t<div dojoType=\"prcommon.advance.renamelist\" dojoAttachPoint=\"adv_rename_ctrl\"></div>\r\n\t</div>\r\n</div>\r\n</div>\r\n",constructor:function(){this.layoutListList=[this.view1];this.advancefeatureslistid=-1;this.onLoadListCall=dojo.hitch(this,this.onLoadDisplayCtrl);this.onOpenListCallBack=dojo.hitch(this,this.onOpenListCall);this._DetailsCallBack=dojo.hitch(this,this.ListDetailsCallBack);this._OnAddListCallBack=dojo.hitch(this,this._AddListCall);this._styleCallBack=dojo.hitch(this,this._StyleCallBackFunc);this._OnEnableToolbarCallBack=dojo.hitch(this,this._SelectionChanged);this._OnDeleteListsCallBack=dojo.hitch(this,this._OnDeleteListsCall);this._getModelItemCall=dojo.hitch(this,this._getModelItem);dojo.subscribe(PRCOMMON.Events.Dialog_Close,dojo.hitch(this,this._CloseEvent));dojo.subscribe(PRCOMMON.Events.Feature_List_Add,dojo.hitch(this,this._AddEvent));dojo.subscribe(PRCOMMON.Events.Feature_List_Update,dojo.hitch(this,this._UpdateEvent));dojo.subscribe(PRCOMMON.Events.Feature_List_Delete,dojo.hitch(this,this._DeleteEvent));this._store_loaded=false;},postCreate:function(){this.modelList=new prcommon.data.QueryWriteStore({url:"/advance/lists",tableid:6,oncallback:dojo.hitch(this,this._SelectionChanged),onError:ttl.utilities.globalerrorchecker});this.listGrid.set("structure",this.layoutListList);this.listGrid._setStore(this.modelList);this.baseonCellClick=this.listGrid.onCellClick;this.listGrid.onCellClick=dojo.hitch(this,this.onCellClick);this.listGrid.onCellDblClick=dojo.hitch(this,this._OnRowDblClick);this._newlist_callback=dojo.hitch(this,this._newlistcall);this._EnableToolbar();if(PRMAX.utils.settings.productid==PRCOMMON.Constants.PRMAX_Pro){dojo.removeClass(this.svl_reports_full.domNode,"prmaxhidden");dojo.removeClass(this.menu_filter.domNode,"prmaxhidden");}dojo.attr(this.displayNode,"innerHTML",this.display);this.inherited(arguments);},_AddExistingToList:function(){this.svl_list_proj_dlg_form.submit();},_EnableToolbar:function(){dojo.xhrPost(ttl.utilities.makeParams({load:this._OnEnableToolbarCallBack,url:"/advance/listmaintcount"}));},onCellClick:function(e){if(e.cellIndex>0){this.onSelectRow(e);}else{if(e.cellIndex==0){var _1=this.listGrid.getItem(e.rowIndex);this.modelList.setValue(_1,"selected",!_1.i.selected,true);}else{this.baseonCellClick(e);}}},_OnRowDblClick:function(e){this._row=this.listGrid.getItem(e.rowIndex);this.advancefeatureslistid=this._row.i.advancefeatureslistid;this.loadListDetails(this.advancefeatureslistid);this._OpenLists(1,[this.advancefeatureslistid,0]);},_getModelItemProject:function(){this.projectid=arguments[0].i.projectid;},_DeleteSingle:function(){if(confirm("Delete List ("+this.svl_name_field.innerHTML+")?")){dojo.xhrPost(ttl.utilities.makeParams({load:this._OnDeleteListsCallBack,url:"/advance/deletelist",content:{advancefeatureslistid:this.advancefeatureslistid}}));}},_Delete:function(){if(confirm("Delete Selected Lists")){dojo.xhrPost(ttl.utilities.makeParams({load:this._OnDeleteListsCallBack,url:"/advance/deleteselection"}));}},_OnDeleteListsCall:function(_2){if(_2.success=="OK"){var _3=[this.advancefeatureslistid];if(_2.lists!=null){_3=_2.lists;}this._EnableToolBarCall(false);dojo.publish(PRCOMMON.Events.Feature_List_Delete,[_3]);this.advancefeatureslistid=-1;this._ShowHideDetails();this.listGrid.selection.clear();}else{alert("Problem");}},onOpenListCall:function(_4){dojo.publish(PRCOMMON.Events.Advance_Session_Changed,[_4.data]);dijit.byId("std_banner_control").ShowResultList("advance_view","advancefeatureslistid="+_4.data.listid);},_OpenSingle:function(){this._OpenLists(1,[this.advancefeatureslistid,0]);},_Open:function(){this._OpenLists(1,[-1,-1]);},_OpenLists:function(_5,_6){var _7={overwrite:_5,lists:dojo.toJson(_6),selected:-1};dojo.xhrPost(ttl.utilities.makeParams({load:this.onOpenListCallBack,url:"/advance/open",content:_7}));},_Rename:function(){this.adv_rename_ctrl.Load(this._row.i.advancefeatureslistid);this.adv_rename_dlg.set("title","Rename List - "+this._row.i.advancefeatureslistdescription);this.adv_rename_dlg.show();},_New:function(){this.svl_list_new_ctrl.Load();this.svl_list_new_dlg.show();},refresh:function(){this.advancefeatureslistid=-1;this._EnableSingleListControls(false);this.listGrid.selection.clear();this._ShowHideDetails();this.listGrid.showMessage(this.listGrid.loadingMessage);var _8=ttl.utilities.getPreventCache();this.listGrid.setQuery(_8);this._EnableToolbar();},view1:{cells:[[{name:" ",width:"15px",styles:"text-align: center;",width:"20px",field:"selected",formatter:ttl.utilities.formatButtonCell},{name:"Name",width:"auto",field:"advancefeatureslistdescription"},{name:"Qty",width:"50px",field:"qty"}]]},loadListDetails:function(_9){dojo.xhrPost(ttl.utilities.makeParams({load:this._DetailsCallBack,url:"/advance/info",content:{advancefeatureslistid:_9}}));},_EnableSingleListControls:function(_a){var _b=_a?false:true;this.svl_list_rename.set("disabled",_b);this.svl_list_delete.set("disabled",_b);this.svl_list_open.set("disabled",_b);},ListDetailsCallBack:function(_c){this._ShowHideDetails();this._EnableSingleListControls(true);this._ListDisplayBasicDetails(_c.data);},_ListDisplayBasicDetails:function(_d){this._EnableSingleListControls(true);dojo.attr(this.svl_name_field,"innerHTML",_d.advance.advancefeatureslistdescription);dojo.attr(this.svl_count_field,"innerHTML",(_d.qty)?_d.qty.toString():"0");},onSelectRow:function(e){this._row=this.listGrid.getItem(e.rowIndex);this.advancefeatureslistid=this._row.i.advancefeatureslistid;this.loadListDetails(this.advancefeatureslistid);this.listGrid.selection.clickSelectEvent(e);},onStyleRow:function(_e){ttl.GridHelpers.onStyleRow(_e);},_StyleCallBackFunc:function(_f){return (_f.i.advancefeatureslistid==thisadvancefeatureslistid)?true:false;},_EnableToolBarCall:function(_10){var _11=_10?false:true;this.svl_delete.set("disabled",_11);this.svl_open.set("disabled",_11);},_ShowHideDetails:function(){var _12=this.advancefeatureslistid==-1?"none":"block";this.list_info_pane.domNode.style.display=_12;},_SelectionChanged:function(_13){this._EnableToolBarCall(_13.data.selected>0?true:false);},resize:function(){this.borderCtrl.resize(arguments[0]);},_getModelItem:function(){if(arguments[0].i.i!=null){this.tmp_row=arguments[0].i;}else{this.tmp_row=arguments[0];}},_CloseEvent:function(){this.svl_list_new_dlg.hide();this.adv_rename_dlg.hide();},_AddEvent:function(_14){this.modelList.newItem(_14);},_UpdateEvent:function(_15){this.tmp_row=null;var _16={identity:_15.advancefeatureslistid,onItem:this._getModelItemCall};this.modelList.fetchItemByIdentity(_16);if(this.tmp_row){this.modelList.SetNoCallBackMode(true);this.modelList.setValue(this.tmp_row,"advancefeatureslistdescription",_15.advancefeatureslistdescription,true);this.modelList.SetNoCallBackMode(false);}dojo.attr(this.svl_name_field,"innerHTML",_15.advancefeatureslistdescription);},_DeleteEvent:function(_17){for(var key in _17){this.tmp_row=null;var _18={identity:_17[key],onItem:this._getModelItemCall};this.modelList.fetchItemByIdentity(_18);if(this.tmp_row){this.modelList.deleteItem(this.tmp_row);}}}});}