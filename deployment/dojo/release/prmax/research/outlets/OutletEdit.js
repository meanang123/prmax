//>>built
require({cache:{"url:research/outlets/templates/OutletEdit.html":"<div>\r\n\t<div data-dojo-props='region:\"top\",style:\"width:100%;height:30px\",\"class\":\"prmaxrowdisplaytitle\"' data-dojo-attach-point=\"blank_cont_view\" data-dojo-type=\"dijit/layout/ContentPane\" >\r\n\t\t<p style=\"color:white;padding:0px;margin:0px;text-align:middle\" data-dojo-attach-point=\"outlet_details_view\"></p>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-attach-point=\"outlet_container\" data-dojo-props='region:\"center\"' >\r\n\t\t<div data-dojo-props='title:\"Title/Address\"' data-dojo-attach-point=\"outlet_main\" data-dojo-type=\"research/outlets/OutletEditMainDetails\" style=\"width:100%;height:100%;overflow:auto;\"></div>\r\n\t\t<div data-dojo-attach-point=\"outlet_profile_ctrl\" data-dojo-type=\"research/outlets/Profile\" data-dojo-props='title:\"Profile\",style:\"width:100%;height:100%\",\"class\":\"scrollpanel\"'></div>\r\n\t\t<div data-dojo-attach-point=\"outlet_coding_ctrl\" data-dojo-type=\"research/outlets/Coding\" data-dojo-props='prefix:\"${prefix}\", title:\"Related to/Coding\",style:\"width:100%;height:100%\",\"class\":\"scrollpanel\"'></div>\r\n\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"contact_grid\" data-dojo-props='title:\"Contacts\",style:\"width:100%;height:100%\",gutters:\"false\"' >\r\n\t\t\t<div data-dojo-attach-point=\"outlet_contact_no_edit_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:100%;border:1px solid black\",region:\"center\"'></div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-attach-point=\"outlet_contact_view\" data-dojo-props='style:\"width:100%;height:100%\",gutters:\"false\"' >\r\n\t\t\t\t<div data-dojo-attach-point=\"outlet_contact_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:30%;border:1px solid black\",splitter:true,region:\"center\"'></div>\r\n\t\t\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"contact_edit_container\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:70%\",splitter:true' >\r\n\t\t\t\t\t<div data-dojo-props='title:\"blank_cont_view\"' data-dojo-attach-point=\"blank_cont_view\" data-dojo-type=\"dijit/layout/ContentPane\" ></div>\r\n\t\t\t\t\t<div data-dojo-props='title:\"contact_edit\",\"class\":\"scrollpanel\"' data-dojo-attach-point=\"contact_edit\" data-dojo-type=\"research/employees/EmployeeEdit\"></div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"outlet_advance_ctrl\" data-dojo-type=\"research/outlets/AdvanceView\" data-dojo-props='title:\"Features\",style:\"width:100%;height:100%\"'></div>\r\n\t\t<div data-dojo-attach-point=\"outlet_research_ctrl\" data-dojo-type=\"research/ResearchDetails\" data-dojo-props='title:\"Research\",style:\"width:100%;height:100%\",\"class\":\"scrollpanel\"'></div>\r\n\t\t<div data-dojo-attach-point=\"outlet_audit_ctrl\" data-dojo-type=\"research/audit/AuditViewer\" data-dojo-props='title:\"Audit\",objectisbase:true,objecttypeid:1,style:\"width:100%;height:100%\"'></div>\r\n\t\t<div data-dojo-attach-point=\"outlet_desk_ctrl\" data-dojo-type=\"research/outlets/OutletDesks\" data-dojo-props='title:\"Desks\",style:\"width:100%;height:100%\"'></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_delete_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Delete Outlet Contact\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_delete_ctrl\" data-dojo-type=\"research/employees/EmployeeDelete\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_change_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Add Contact\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_change_ctrl\" data-dojo-type=\"research/employees/EmployeeEdit\" data-dojo-props='style:\"width:600px;height:500px\"' ></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_set_primary_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title :\"Set Primary Contact\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_set_primary_ctrl\" data-dojo-type=\"research/outlets/OutletSetPrimary\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_move_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title :\"Move Contact to another Outlet\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_move_ctrl\" data-dojo-type=\"research/outlets/OutletMoveContact\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_copy_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title :\"Copy Contact to Outlet\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_copy_ctrl\" data-dojo-type=\"research/outlets/OutletCopyContact\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_merge_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title :\"Merge selected Contact to\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_merge_ctrl\" data-dojo-type=\"research/employees/EmployeeMerge\"></div>\r\n\t</div>\r\n</div>\r\n"}});define("research/outlets/OutletEdit",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../outlets/templates/OutletEdit.html","dijit/layout/BorderContainer","ttl/grid/Grid","ttl/store/JsonRest","dojo/store/Observable","dojo/request","ttl/utilities2","dojo/json","dojo/data/ItemFileReadStore","dojo/_base/lang","dojo/topic","dojo/dom-attr","dojo/dom-class","dijit/layout/TabContainer","research/outlets/OutletEditMainDetails","dijit/layout/BorderContainer","dijit/layout/ContentPane","dijit/layout/StackContainer","research/employees/EmployeeEdit","research/outlets/Profile","research/outlets/Coding","research/audit/AuditViewer","research/ResearchDetails","research/outlets/AdvanceView","dijit/Dialog","research/employees/EmployeeDelete","research/outlets/OutletSetPrimary","research/employees/EmployeeEdit","research/employees/EmployeeDelete","research/outlets/OutletDesks","research/outlets/OutletMoveContact","research/outlets/OutletCopyContact","research/employees/EmployeeMerge","research/employees/ContactMerge",],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f){return _1("research.outlets.OutletEdit",[_2,_4],{templateString:_3,gutters:false,prefix:"edit",constructor:function(){this.private_menu=null;this.std_menu=null;this.private_menu_limited=null;this.deleted_menu=null;this._outletdesks=0;this.outlet_contact_model=new _7(new _6({target:"/research/admin/employees/contactlist_rest",idProperty:"employeeid"}));_d.subscribe(PRCOMMON.Events.Employee_Deleted,_c.hitch(this,this._employee_deleted_event));_d.subscribe(PRCOMMON.Events.Employee_Add,_c.hitch(this,this._employee_add_event));_d.subscribe(PRCOMMON.Events.Employee_Updated,_c.hitch(this,this._employee_update_event));_d.subscribe("/emp/set_primary",_c.hitch(this,this._employee_set_primary_event));_d.subscribe("/coding/update",_c.hitch(this,this._outlet_update_event));_d.subscribe("/employee/delete_request",_c.hitch(this,this._employee_deleted_request_event));this._load_call_back=_c.hitch(this,this._load_call);},postCreate:function(){var _10=[{label:" ",className:"grid-field-icon-view",field:"prn_primary",formatter:this._row_button_small},{label:"Contact",className:"dgrid-column-contact",field:"contactname"},{label:"Job Title",className:"dgrid-column-contact",field:"job_title"},{label:"Desk Name",className:"dgrid-column-status",field:"deskname"},{label:"Source",className:"dgrid-column-status-small",field:"sourcename"},{label:"Status",className:"dgrid-column-status-small",field:"prmaxstatusid",formatter:_9.format_deleted_ctrl}];var _11=[{label:" ",className:"grid-field-icon-view",field:"prn_primary",formatter:this._row_button_small,editable:false},{label:"Contact",className:"dgrid-column-contact",field:"contactname",editable:false},{label:"Job Title",className:"dgrid-column-contact",field:"job_title",editable:false},{label:"Desk Name",className:"dgrid-column-status",field:"deskname",editable:false},{label:"Source",className:"dgrid-column-status-small",field:"sourcename",editable:false},{label:"Status",className:"dgrid-column-status-small",field:"prmaxstatusid",formatter:_9.format_deleted_ctrl,editable:false}];this.outlet_contact_grid=new _5({columns:_10,selectionMode:"single",store:this.outlet_contact_model});this.outlet_contact_no_edit_grid=new _5({columns:_11,selectionMode:"single",store:this.outlet_contact_model,editable:false});this.outlet_contact_grid_view.set("content",this.outlet_contact_grid);this.outlet_contact_no_edit_view.set("content",this.outlet_contact_no_edit_grid);this.outlet_contact_grid.on(" .dgrid-cell:click",_c.hitch(this,this._on_cell_call));this.outlet_contact_grid.on(".dgrid-row:contextmenu",_c.hitch(this,this.on_row_context_menu));this.employee_delete_ctrl.set("dialog",this.employee_delete_dlg);this.employee_change_ctrl.set("dialog",this.employee_change_dlg);this.employee_set_primary_ctrl.set("dialog",this.employee_set_primary_dlg);this.inherited(arguments);},_row_button_small:function(_12){if(_12==null){return "...";}if(_12){return "<p style=\"background-color:red;padding:0x;margin:0px\">&nbsp; </p>";}return "<img height=\"10px\" width=\"10px\" style=\"padding:0x;margin:0px\" src=\"/prcommon/images/rowctrl.gif\"></img>";},on_row_context_menu:function(e){this._menu(e);e.preventDefault();},_menu:function(e){this._row=this.outlet_contact_grid.row(e).data;if(this.std_menu===null){this.std_menu=new dijit.Menu();this.std_menu.addChild(new dijit.MenuItem({label:"Add Contact",onClick:_c.hitch(this,this._add_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.std_menu.startup();}if(this.deleted_menu===null){this.deleted_menu=new dijit.Menu();this.deleted_menu.addChild(new dijit.MenuItem({label:"Add Contact",onClick:_c.hitch(this,this._add_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.deleted_menu.addChild(new dijit.MenuItem({label:"Delete Contact",onClick:_c.hitch(this,this._delete_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.deleted_menu.startup();}if(this.private_menu===null){this.private_menu=new dijit.Menu();this.private_menu.addChild(new dijit.MenuItem({label:"Delete Contact",onClick:_c.hitch(this,this._delete_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.private_menu.addChild(new dijit.MenuItem({label:"Add Contact",onClick:_c.hitch(this,this._add_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.private_menu.addChild(new dijit.MenuItem({label:"Set Primary Contact",onClick:_c.hitch(this,this._primary_contact),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.private_menu.addChild(new dijit.MenuItem({label:"Move to Publication",onClick:_c.hitch(this,this._move_to_other_outlet)}));this.private_menu.addChild(new dijit.MenuItem({label:"Copy to Publication",onClick:_c.hitch(this,this._copy_to_other_outlet)}));this.private_menu.addChild(new dijit.MenuItem({label:"Merge Contact to ",onClick:_c.hitch(this,this._merge_contact)}));this.private_menu.startup();}if(this.private_menu_limited===null){this.private_menu_limited=new dijit.Menu();this.private_menu_limited.addChild(new dijit.MenuItem({label:"Add Contact",onClick:_c.hitch(this,this._add_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.private_menu_limited.addChild(new dijit.MenuItem({label:"Copy to Publication",onClick:_c.hitch(this,this._copy_to_other_outlet)}));this.private_menu_limited.startup();}if(this._row.prmaxstatusid==2){this.deleted_menu._openMyself(e);}else{if(this._row.prn_primary){this.private_menu_limited._openMyself(e);}else{this.private_menu._openMyself(e);}}},_merge_contact:function(){this.employee_merge_ctrl.load(this._row.employeeid,this._outletid,this._row.job_title,this._row.contactname,this.employee_merge_dlg);},_on_cell_call:function(e){var _13=this.outlet_contact_grid.cell(e);if(_13!=null){this._row=_13.row.data;if(_13.column.field=="prn_primary"){this._menu(e);}else{this.contact_edit.load(this._row.employeeid,this._row.outletid,this.id,this._outletdesks);this.contact_edit_container.selectChild(this.contact_edit);}}},_move_to_other_outlet:function(){this.employee_move_ctrl.load(this._row.employeeid,this._row.job_title+":"+this._row.contactname,this.employee_move_dlg,this._outletid);this.employee_move_dlg.show();},_copy_to_other_outlet:function(){this.employee_copy_ctrl.load(this._row.employeeid,this._row.job_title+":"+this._row.contactname,this.employee_copy_dlg,this._outletid);this.employee_copy_dlg.show();},_primary_contact:function(){this.employee_set_primary_ctrl.load(this._row.employeeid,this._row.contactname,this._row.job_title,this.employee_set_primary_dlg);this.employee_set_primary_dlg.show();},_delete_employee:function(){this.employee_delete_ctrl.load(this._row.employeeid,this._row.job_title,this._row.contactname,this.employee_delete_dlg);this.employee_delete_dlg.show();},_add_employee:function(){this.employee_change_ctrl.load(-1,this._outletid,"",this._outletdesks);this.employee_change_dlg.show();},_load_call:function(_14){if(_14.success=="OK"){this._outletdesks=_14.outlet.outletdesks;if(_14.outlet.profile.profile!=null&&_14.outlet.profile.profile.seriesparentid&&_14.outlet.researchdetails.no_sync==false){this.contact_grid.selectChild(this.outlet_contact_no_edit_view);this.outlet_contact_no_edit_grid.set("query",{outletid:this._outletid});this.outlet_main.address1.set("disabled",true);this.outlet_main.address2.set("disabled",true);this.outlet_main.postcode.set("disabled",true);this.outlet_main.townname.set("disabled",true);this.outlet_main.county.set("disabled",true);this.outlet_main.tel.set("disabled",true);this.outlet_main.fax.set("disabled",true);}else{this.contact_grid.selectChild(this.outlet_contact_view);this.outlet_contact_grid.set("query",{outletid:this._outletid,extended:1});this.outlet_main.address1.set("disabled",false);this.outlet_main.address2.set("disabled",false);this.outlet_main.postcode.set("disabled",false);this.outlet_main.townname.set("disabled",false);this.outlet_main.county.set("disabled",false);this.outlet_main.tel.set("disabled",false);this.outlet_main.fax.set("disabled",false);}this.outlet_main.load(this._outletid,_14.outlet,_14.outlet.profile);if(_14.outlet.serieschildren.length>0){_f.remove(this.outlet_main.synchrbtn.domNode,"prmaxhidden");}else{_f.add(this.outlet_main.synchrbtn.domNode,"prmaxhidden");}this.outlet_profile_ctrl.load(this._outletid,_14.outlet,_14.outlet.profile);this.outlet_coding_ctrl.load(this._outletid,_14.outlet,_14.outlet.profile,this.prefix);this.outlet_research_ctrl.load(this._outletid,_14.outlet.outlet.outlettypeid);this.outlet_desk_ctrl.load(this._outletid,_14.outlet.outlet.outlettypeid);this.outlet_advance_ctrl.load(this._outletid);this.contact_edit_container.selectChild(this.blank_cont_view);this.contact_edit.clear();var tmp=_14.outlet.outlet.outletid+" - "+_14.outlet.outlet.outletname;_e.set(this.outlet_details_view,"innerHTML",tmp);}},load:function(_15,_16){this._outletid=_15;if(_16!=""&&_16!=undefined){this.prefix=_16;}this.outlet_audit_ctrl.load(this._outletid);if(this._outletid==-1){this.clear();}else{_8.post("/research/admin/outlets/research_outlet_edit_get",_9.make_params({data:{outletid:_15}})).then(this._load_call_back);}},clear:function(){this.outlet_main.clear();this.outlet_contact_grid.set("query","");this.outlet_profile_ctrl.clear();_e.set(this.outlet_details_view,"innerHTML","");},_employee_deleted_event:function(_17){if(_17.has_deleted){this.outlet_contact_model.remove(_17.employeeid);}else{this.outlet_contact_grid.set("query",{outletid:this._outletid,extended:1});}this.contact_edit_container.selectChild(this.blank_cont_view);},_employee_update_event:function(_18){if(_18==null){this.outlet_contact_grid.set("query",{outletid:this._outletid,extended:1});}else{this.outlet_contact_model.put(_18);}},_employee_add_event:function(_19){_19.sourcename="PRmax";this.outlet_contact_model.add(_19);},_outlet_deleted_event:function(_1a){this.clear();},_employee_deleted_request_event:function(_1b,_1c){if(this.id==_1c){this._delete_employee();}},_outlet_update_event:function(_1d){if(_1d.outlet.profile.profile!=null&&_1d.outlet.profile.profile.seriesparentid&&_1d.outlet.researchdetails.no_sync==false){this.contact_grid.selectChild(this.outlet_contact_no_edit_view);this.outlet_contact_no_edit_grid.set("query",{outletid:this._outletid});this.outlet_main.address1.set("disabled",true);this.outlet_main.address2.set("disabled",true);this.outlet_main.postcode.set("disabled",true);this.outlet_main.townname.set("disabled",true);this.outlet_main.county.set("disabled",true);this.outlet_main.tel.set("disabled",true);this.outlet_main.fax.set("disabled",true);}else{this.contact_grid.selectChild(this.outlet_contact_view);this.outlet_contact_grid.set("query",{outletid:this._outletid,extended:1});this.outlet_main.address1.set("disabled",false);this.outlet_main.address2.set("disabled",false);this.outlet_main.postcode.set("disabled",false);this.outlet_main.townname.set("disabled",false);this.outlet_main.county.set("disabled",false);this.outlet_main.tel.set("disabled",false);this.outlet_main.fax.set("disabled",false);}if(_1d.outlet.serieschildren.length>0){_f.remove(this.outlet_main.synchrbtn.domNode,"prmaxhidden");}else{_f.add(this.outlet_main.synchrbtn.domNode,"prmaxhidden");}},_employee_set_primary_event:function(){this.outlet_contact_no_edit_grid.set("query",{outletid:this._outletid});this.outlet_contact_grid.set("query",{outletid:this._outletid,extended:1});}});});