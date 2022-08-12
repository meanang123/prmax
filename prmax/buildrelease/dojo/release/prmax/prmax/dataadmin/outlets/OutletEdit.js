/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.dataadmin.outlets.OutletEdit"]){dojo._hasResource["prmax.dataadmin.outlets.OutletEdit"]=true;dojo.provide("prmax.dataadmin.outlets.OutletEdit");dojo.require("prmax.dataadmin.outlets.AdvanceView");dojo.declare("prmax.dataadmin.outlets.OutletEdit",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div >\r\n\t<div  dojoAttachPoint=\"frame\" dojotype=\"dijit.layout.BorderContainer\"  style=\"width:99%;height:100%;overflow: hidden\" gutters=\"false\">\r\n\t\t<div dojoType=\"dijit.layout.ContentPane\" region=\"top\" style=\"height:42px;width:100%;overflow:hidden\" class=\"searchresults\">\r\n\t\t\t<div style=\"height:40px;width:100%;overflow:hidden\" class=\"searchresults\">\r\n\t\t\t\t<div class=\"dijitToolbarTop\" dojoType=\"dijit.Toolbar\" style=\"float:left:height:100%;width:100%\" >\r\n\t\t\t\t\t<div dojoAttachEvent=\"onClick:_ShowDetails\" dojoType=\"dijit.form.Button\" iconClass=\"PrmaxResultsIcon PrmaxResultsEmpty\" showLabel=\"true\" label=\"Details\"></div>\r\n\t\t\t\t\t<div dojoAttachEvent=\"onClick:_ShowContacts\" dojoType=\"dijit.form.Button\" iconClass=\"PrmaxResultsIcon PrmaxResultsEmpty\" showLabel=\"true\" label=\"Contacts\" dojoAttachPoint=\"contact_view_btn\"></div>\r\n\t\t\t\t\t<div dojoAttachEvent=\"onClick:_ShowProfile\" dojoType=\"dijit.form.Button\" iconClass=\"PrmaxResultsIcon PrmaxResultsEmpty\" showLabel=\"true\" label=\"Profile\" ></div>\r\n\t\t\t\t\t<div dojoAttachEvent=\"onClick:_ShowAudit\" dojoType=\"dijit.form.Button\" iconClass=\"PrmaxResultsIcon PrmaxResultsEmpty\" showLabel=\"true\" label=\"Audit\"></div>\r\n\t\t\t\t\t<div dojoAttachEvent=\"onClick:_ShowResearch\" dojoType=\"dijit.form.Button\" iconClass=\"PrmaxResultsIcon PrmaxResultsEmpty\" showLabel=\"true\" label=\"Research\"></div>\r\n\t\t\t\t\t<div dojoAttachEvent=\"onClick:_ShowPrn\" dojoType=\"dijit.form.Button\" iconClass=\"PrmaxResultsIcon PrmaxResultsEmpty\" showLabel=\"true\" label=\"Prn\"></div>\r\n\t\t\t\t\t<div dojoAttachEvent=\"onClick:_ShowAdvance\" dojoType=\"dijit.form.Button\" iconClass=\"PrmaxResultsIcon PrmaxResultsEmpty\" showLabel=\"true\" label=\"Feature\"></div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div dojoType=\"dijit.layout.StackContainer\" dojoAttachPoint=\"outlet_container\" region=\"center\"  doLayout=\"true\" >\r\n\t\t\t<div title=\"Details\" dojoType=\"dijit.layout.ContentPane\" dojoAttachPoint=\"outlet_details_view\">\r\n\t\t\t\t<div dojoAttachPoint=\"outlet_main\" dojotype=\"prmax.dataadmin.outlets.OutletEditMainDetails\" style=\"width:100%;height:100%;overflow:auto;\"></div>\r\n\t\t\t</div>\r\n\t\t\t<div title=\"Contacts\" dojoType=\"dijit.layout.BorderContainer\" dojoAttachPoint=\"outlet_contact_view\" style=\"width:100%;height:100%\" gutters=\"false\" >\r\n\t\t\t\t<div dojoAttachPoint=\"outlet_contact_grid\" dojoType=\"dojox.grid.DataGrid\"   query=\"{ }\" rowsPerPage=\"500\" style=\"width:100%;height:30%;border:1px solid black\" splitter=\"true\" region=\"center\"></div>\r\n\t\t\t\t<div dojoType=\"dijit.layout.StackContainer\" dojoAttachPoint=\"contact_edit_container\" region=\"bottom\" style=\"width:100%;height:70%\" splitter=\"true\" >\r\n\t\t\t\t\t<div title=\"blank_cont_view\" dojoAttachPoint=\"blank_cont_view\" dojoType=\"dijit.layout.ContentPane\" region=\"bottom\" selected ></div>\r\n\t\t\t\t\t<div title =\"contact_edit\" dojoAttachPoint=\"contact_edit\" dojoType=\"prmax.dataadmin.employees.EmployeeEdit\" style=\"border:1px solid black\"></div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div title=\"Profile\" dojoType=\"dijit.layout.ContentPane\" dojoAttachPoint=\"outlet_profile_view\" style=\"width:100%;height:100%\" >\r\n\t\t\t\t<div dojoAttachPoint=\"outlet_profile_ctrl\" dojotype=\"prmax.dataadmin.Profile\" style=\"width:100%;height:100%\"></div>\r\n\t\t\t</div>\r\n\t\t\t<div title=\"Audit\" dojoType=\"dijit.layout.ContentPane\" dojoAttachPoint=\"outlet_audit_view\" style=\"width:100%;height:100%\" >\r\n\t\t\t\t<div dojoAttachPoint=\"outlet_audit_ctrl\" dojoType=\"prmax.dataadmin.AuditViewer\" objectisbase=\"true\" objecttypeid=\"1\" style=\"width:100%;height:100%\"></div>\r\n\t\t\t</div>\r\n\t\t\t<div title=\"Research\" dojoType=\"dijit.layout.ContentPane\" dojoAttachPoint=\"outlet_research_view\" style=\"width:100%;height:100%\" >\r\n\t\t\t\t<div dojoAttachPoint=\"outlet_research_ctrl\" dojoType=\"prmax.dataadmin.ResearchDetails\" style=\"width:100%;height:100%\"></div>\r\n\t\t\t</div>\r\n\t\t\t<div title=\"Prn\" dojoType=\"dijit.layout.ContentPane\" dojoAttachPoint=\"outlet_prn_view\" style=\"width:100%;height:100%\" >\r\n\t\t\t\t<div dojoAttachPoint=\"outlet_prn_ctrl\" dojoType=\"prmax.dataadmin.outlets.OutletEditPrn\" style=\"width:100%;height:100%\"></div>\r\n\t\t\t</div>\r\n\t\t\t<div title=\"Features\" dojoType=\"dijit.layout.ContentPane\" dojoAttachPoint=\"outlet_advance_view\" style=\"width:100%;height:100%\" >\r\n\t\t\t\t<div dojoAttachPoint=\"outlet_advance_ctrl\" dojoType=\"prmax.dataadmin.outlets.AdvanceView\" style=\"width:100%;height:100%\"></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div dojoAttachPoint=\"employee_delete_dlg\" dojoType=\"dijit.Dialog\" title =\"Delete Outlet Contact\">\r\n\t\t<div dojoAttachPoint=\"employee_delete_ctrl\" dojoType=\"prmax.dataadmin.employees.EmployeeDelete\"></div>\r\n\t</div>\r\n\t<div dojoAttachPoint=\"employee_change_dlg\" dojoType=\"dijit.Dialog\" title =\"Add/Update\">\r\n\t\t<div dojoAttachPoint=\"employee_change_ctrl\" dojoType=\"prmax.dataadmin.employees.EmployeeEdit\"></div>\r\n\t</div>\r\n\t<div dojoAttachPoint=\"employee_set_primary_dlg\" dojoType=\"dijit.Dialog\" title =\"Set Primary Contact\">\r\n\t\t<div dojoAttachPoint=\"employee_set_primary_ctrl\" dojoType=\"prmax.dataadmin.outlets.OutletSetPrimary\"></div>\r\n\t</div>\r\n</div>\r\n",constructor:function(){this._LoadCallBack=dojo.hitch(this,this._LoadCall);this._UpdatedCallBack=dojo.hitch(this,this._UpdatedCall);this._GetEntryCallBack=dojo.hitch(this,this._getContactEntry);this.private_menu=null;this.private_menu_limited=null;this.outlet_contact_model=new prcommon.data.QueryWriteStore({url:"/employees/contactlist?extended=1",onError:ttl.utilities.globalerrorchecker,nocallback:true});dojo.subscribe(PRCOMMON.Events.Employee_Deleted,dojo.hitch(this,this._EmployeeDeletedEvent));dojo.subscribe(PRCOMMON.Events.Outlet_Deleted,dojo.hitch(this,this._OutletDeletedEvent));dojo.subscribe(PRCOMMON.Events.Dialog_Close,dojo.hitch(this,this._DialogCloseEvent));dojo.subscribe(PRCOMMON.Events.Employee_Add,dojo.hitch(this,this._EmployeeAddEvent));dojo.subscribe(PRCOMMON.Events.Employee_Updated,dojo.hitch(this,this._EmployeeUpdateEvent));},postCreate:function(){this.outlet_contact_grid.set("structure",this.outletContact_View);this.outlet_contact_grid._setStore(this.outlet_contact_model);this.outlet_contact_grid["onStyleRow"]=dojo.hitch(this,ttl.GridHelpers.onStyleRow);this.outlet_contact_grid.onRowContextMenu=dojo.hitch(this,this.onRowContextMenu);this.baseonCellClick=this.outlet_contact_grid.onCellClick;this.outlet_contact_grid.onCellClick=dojo.hitch(this,this.onCellClick);this.outlet_contact_grid.onRowClick=dojo.hitch(this,this.onSelectRow);this.inherited(arguments);},onSelectRow:function(e){this.outlet_contact_grid.selection.clickSelectEvent(e);},resize:function(){this.frame.resize(arguments[0]);},onRowContextMenu:function(e){this.outlet_contact_grid.selection.clickSelectEvent(e);this._Menu(e);},_Menu:function(e){this._row=this.outlet_contact_grid.getItem(e.rowIndex);if(this.delete_menu){this.delete_menu=new dijit.Menu();this.delete_menu.startup();}if(this.private_menu===null){this.private_menu=new dijit.Menu();this.private_menu.addChild(new dijit.MenuItem({label:"Delete Contact",onClick:dojo.hitch(this,this._DeleteEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.private_menu.addChild(new dijit.MenuItem({label:"Add Contact",onClick:dojo.hitch(this,this._AddEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.private_menu.addChild(new dijit.MenuItem({label:"Set Primary Contact",onClick:dojo.hitch(this,this._PrimaryContact),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.private_menu.startup();}if(this.private_menu_limited===null){this.private_menu_limited=new dijit.Menu();this.private_menu_limited.addChild(new dijit.MenuItem({label:"Add Contact",onClick:dojo.hitch(this,this._AddEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.private_menu_limited.startup();}if(this._row.prmaxstatusid==2){this.delete_menu._openMyself(e);}else{if(this._row.i.prn_primary){this.private_menu_limited._openMyself(e);}else{this.private_menu._openMyself(e);}}},onCellClick:function(e){this.outlet_contact_grid.selection.clickSelectEvent(e);this.inherited(arguments);this._row=this.outlet_contact_grid.getItem(e.rowIndex);if(e.cellIndex==2){this._Menu(e);}else{this.contact_edit.Load(this._row.i.employeeid,this._row.i.outletid);this.contact_edit_container.selectChild(this.contact_edit);}},_PrimaryContact:function(){this.employee_set_primary_ctrl.Load(this._row.i.employeeid,this._row.i.contactname,this._row.job_title);this.employee_set_primary_dlg.show();},_EditEmployee:function(){this.employee_change_ctrl.Load(this._row.i.employeeid,this._outletid);this.employee_change_dlg.show();},_DeleteEmployee:function(){this.employee_delete_ctrl.Load(this._row.i.employeeid,this._row.i.job_title,this._row.i.contactname);this.employee_delete_dlg.show();},_AddEmployee:function(){this.employee_change_ctrl.Load(-1,this._outletid);this.employee_change_dlg.show();},outletContact_View:{cells:[[{name:"Contact",width:"200px",field:"contactname"},{name:"Job Title",width:"200px",field:"job_title"},{name:" ",width:"15px",field:"",formatter:ttl.utilities.formatRowCtrl},{name:"Source",width:"50px",field:"sourcename"},{name:"Status",width:"50px",field:"prmaxstatusid",formatter:ttl.utilities.formatDeletedCtrl}]]},_LoadCall:function(_1){if(_1.success=="OK"){this.outlet_main.Load(this._outletid,_1.outlet);this.outlet_profile_ctrl.Load(this._outletid,1,_1.outlet.outlet.profile);this.outlet_research_ctrl.Load(this._outletid,_1.outlet.outlet.outlettypeid);this.outlet_prn_ctrl.Load(this._outletid,_1.outlet);this.outlet_advance_ctrl.Load(this._outletid);this.contact_edit_container.selectChild(this.blank_cont_view);this.contact_edit.Clear();}},Load:function(_2){this._outletid=_2;this.outlet_audit_ctrl.Load(this._outletid);if(this._outletid==-1){this.Clear();}else{this.outlet_contact_grid.setQuery(ttl.utilities.getPreventCache({outletid:this._outletid}));dojo.xhrPost(ttl.utilities.makeParams({load:this._LoadCallBack,url:"/outlets/research_outlet_edit_get",content:{outletid:_2}}));}},Clear:function(){this.outlet_main.Clear();this.outlet_contact_grid.setQuery(ttl.utilities.getPreventCache({}));this.outlet_profile_ctrl.Clear();this.outlet_prn_ctrl.Clear();},destroy:function(){try{this.inherited(arguments);}catch(e){}},_ShowDetails:function(){this.outlet_container.selectChild(this.outlet_details_view);},_ShowContacts:function(){this.outlet_container.selectChild(this.outlet_contact_view);},_ShowAudit:function(){this.outlet_container.selectChild(this.outlet_audit_view);},_ShowProfile:function(){this.outlet_container.selectChild(this.outlet_profile_view);},_ShowResearch:function(){this.outlet_container.selectChild(this.outlet_research_view);},_ShowPrn:function(){this.outlet_container.selectChild(this.outlet_prn_view);},_ShowAdvance:function(){this.outlet_container.selectChild(this.outlet_advance_view);},_EmployeeDeletedEvent:function(_3){this.employee=null;var _4={identity:_3.employeeid,onItem:this._GetEntryCallBack};this.outlet_contact_model.fetchItemByIdentity(_4);if(this.employee!==null){this.outlet_contact_model.deleteItem(this.employee);}},_EmployeeUpdateEvent:function(_5){if(_5==null){this.outlet_contact_grid.setQuery(ttl.utilities.getPreventCache({outletid:this._outletid}));}else{this.employee=null;var _6={identity:_5.employeeid,onItem:this._GetEntryCallBack};this.outlet_contact_model.fetchItemByIdentity(_6);if(this.employee!==null){this.outlet_contact_model.setValue(this.employee,"job_title",_5.job_title,true);this.outlet_contact_model.setValue(this.employee,"contactname",_5.contactname,true);}}},_EmployeeAddEvent:function(_7){_7.sourcename="PRmax";this.outlet_contact_model.newItem(_7);},_OutletDeletedEvent:function(_8){this.Clear();},_getContactEntry:function(){this.employee=arguments[0];},_DialogCloseEvent:function(_9){if(_9=="emp_del"){this.employee_delete_dlg.hide();}if(_9=="emp_cha"){this.employee_change_dlg.hide();}if(_9=="out_pri"){this.employee_set_primary_dlg.hide();}}});}