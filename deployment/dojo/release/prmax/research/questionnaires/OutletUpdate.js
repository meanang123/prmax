//>>built
require({cache:{"url:research/questionnaires/templates/OutletUpdate.html":"<div >\r\n\t<div data-dojo-props='region:\"top\",style:\"width:100%;height:30px\",\"class\":\"prmaxrowdisplaytitle\"' data-dojo-attach-point=\"blank_cont_view\" data-dojo-type=\"dijit/layout/ContentPane\" >\r\n\t\t<p style=\"color:white;padding:0px;margin:0px;text-align:middle\" data-dojo-attach-point=\"outlet_details_view\"></p>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-attach-point=\"outlet_container\" data-dojo-props='region:\"center\"' >\r\n\t\t<div data-dojo-props='title:\"Title/Address\"' data-dojo-attach-point=\"outlet_main\" data-dojo-type=\"research/questionnaires/OutletEditMainDetails\" data-dojo-props='style:\"width:100%;height:100%;\",\"class\":\"scrollpanel\"'></div>\r\n\t\t<div data-dojo-attach-point=\"outlet_profile_ctrl\" data-dojo-type=\"research/questionnaires/Profile\" data-dojo-props='title:\"Profile\",style:\"width:100%;height:100%\",\"class\":\"scrollpanel\"'></div>\r\n\t\t<div data-dojo-attach-point=\"outlet_coding_ctrl\" data-dojo-type=\"research/questionnaires/Coding\" data-dojo-props='title:\"Coding\",style:\"width:100%;height:100%\",\"class\":\"scrollpanel\"'></div>\r\n\t\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-attach-point=\"outlet_contact_view\" data-dojo-props='title:\"Contacts\",style:\"width:100%;height:100%\",gutters:\"false\"' >\r\n\t\t\t<div data-dojo-attach-point=\"outlet_contact_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:30%;border:1px solid black\",splitter:true,region:\"center\"'></div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"contact_edit_container\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:70%\",splitter:true' >\r\n\t\t\t\t<div data-dojo-props='title:\"blank_cont_view\"' data-dojo-attach-point=\"blank_cont_view\" data-dojo-type=\"dijit/layout/ContentPane\" ></div>\r\n\t\t\t\t<div data-dojo-props='title:\"contact_edit\",\"class\":\"scrollpanel\",style:\"width:100%;height:100%\",prmaxcontext:\"outlet\"' data-dojo-attach-point=\"contact_edit\" data-dojo-type=\"research/questionnaires/EmployeeEdit\"></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"outlet_coverage_ctrl\" data-dojo-type=\"research/questionnaires/Coverage\" data-dojo-props='title:\"Geo. Coverage\",style:\"width:100%;height:100%\",\"class\":\"scrollpanel\"'></div>\r\n\t\t<div data-dojo-attach-point=\"research_ctrl\" data-dojo-type=\"research/questionnaires/Research\" data-dojo-props='title:\"Research\",style:\"width:100%;height:100%\",\"class\":\"scrollpanel\"'></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"delete_ctrl\" data-dojo-type=\"research/questionnaires/EmployeeDelete\" data-dojo-props='region:\"bottom\",style:\"width:1px;height:1px;\"'></div>\r\n\t<div data-dojo-attach-point=\"employee_change_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Add Contact\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_change_ctrl\" data-dojo-type=\"research/employees/EmployeeEdit\" data-dojo-props='style:\"width:600px;height:500px\"' ></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_set_primary_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title :\"Set Primary Contact\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_set_primary_ctrl\" data-dojo-type=\"research/outlets/OutletSetPrimary\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_move_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title :\"Move Contact to another Outlet\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_move_ctrl\" data-dojo-type=\"research/outlets/OutletMoveContact\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_copy_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title :\"Copy Contact to Outlet\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_copy_ctrl\" data-dojo-type=\"research/outlets/OutletCopyContact\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_merge_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title :\"Merge selected Contact to\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_merge_ctrl\" data-dojo-type=\"research/employees/EmployeeMerge\"></div>\r\n\t</div>\r\n\r\n</div>\r\n"}});define("research/questionnaires/OutletUpdate",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../questionnaires/templates/OutletUpdate.html","dijit/layout/BorderContainer","ttl/grid/Grid","ttl/store/JsonRest","dojo/store/Observable","dojo/request","ttl/utilities2","dojo/json","dojo/data/ItemFileReadStore","dojo/_base/lang","dojo/topic","dojo/dom-attr","dijit/layout/TabContainer","research/questionnaires/OutletEditMainDetails","dijit/layout/BorderContainer","dijit/layout/ContentPane","dijit/layout/StackContainer","research/questionnaires/Profile","research/questionnaires/EmployeeEdit","dijit/Dialog","research/questionnaires/Coding","research/questionnaires/Coverage","research/questionnaires/Research","research/questionnaires/EmployeeDelete","research/employees/EmployeeDelete","research/employees/EmployeeEdit","research/outlets/OutletSetPrimary","research/outlets/OutletMoveContact","research/outlets/OutletCopyContact","research/employees/EmployeeMerge"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e){return _1("research.questionnaires.OutletUpdate",[_2,_4],{templateString:_3,gutters:false,constructor:function(){this._load_call_back=_c.hitch(this,this._load_call);this._store=new _7(new _6({target:"/research/admin/projects/journalist_changes",idProperty:"key"}));this._load_new_employee_call_back=_c.hitch(this,this._load_new_employee_call);_d.subscribe(PRCOMMON.Events.Employee_Quest_Add,_c.hitch(this,this._employee_add_event));_d.subscribe(PRCOMMON.Events.Employee_Add,_c.hitch(this,this._employee_add_event));_d.subscribe(PRCOMMON.Events.Employee_Quest_Updated,_c.hitch(this,this._employee_update_event));_d.subscribe("/emp/set_primary",_c.hitch(this,this._employee_set_primary_event));_d.subscribe("/quest/emp_del",_c.hitch(this,this._employee_delete_event));this._row_data=null;this._outletdesks=null;this.std_menu=null;this.std_menu_primary=null;},postCreate:function(){var _f=[{label:" ",field:"isprimary",className:"grid-field-image-view",formatter:this._row_button_small},{label:"Done?",field:"applied",className:"dgrid-column-status-small",formatter:this._action_done_function},{label:"Contact",className:"standard",field:"contactname"},{label:"Job Title",className:"standard",field:"job_title"},{label:"Action",field:"actiontypedescription",className:"dgrid-column-statusl"}];this.grid=new _5({columns:_f,selectionMode:"single",store:this._store});this.outlet_contact_grid_view.set("content",this.grid);this.grid.on(".dgrid-cell:click",_c.hitch(this,this._on_cell_call));this.inherited(arguments);},_row_button_small:function(_10){if(_10==null){return "...";}if(_10){return "<p style=\"background-color:red;padding:0x;margin:0px\">&nbsp; </p>";}return "<img height=\"10px\" width=\"10px\" style=\"padding:0x;margin:0px\" src=\"/prcommon/images/rowctrl.gif\"></img>";},_action_done_function:function(_11){if(_11==1){return "Yes";}return "";},_action_function:function(_12){if(_12!=null){if(_12==3){return "<img height=\"16px\" width=\"16px\" style=\"padding:0x;margin:0px\" src=\"/prcommon/images/delete.gif\"></img>";}else{return "<img src=\"/prcommon/images/view.png\" alt=\"view\" width=\"16\" height=\"16\" style=\"padding:0px;margin:0px\"/>";}}else{return "";}},_on_cell_call:function(e){var _13=this.grid.cell(e);if(_13==null||_13.row==null){return;}if(_13.column.field=="isprimary"){if(_13.row.data.actiontypeid==2||_13.row.data.actiontypeid==-1){this._row_data=_13.row.data;this._show_menu(e,_13.row.data);return;}}if(_13.row.data.actiontypeid==3&&_13.row.data.applied==0){if(_13.row.data.isprimary==true){alert("Cannot Delete as is Primary");}else{this._row_data=_13.row.data;this.delete_ctrl.load(_13.row.data.key,_13.row.data.job_title,_13.row.data.contactname);}}else{if(_13.row.data.actiontypeid==1&&_13.row.data.applied==0){this._row_data=_13.row.data;_8.post("/research/admin/projects/load_new_employee_feedback",_9.make_params({data:{researchprojectitemid:this._researchprojectitemid,objectid:_13.row.data.objectid}})).then(this._load_new_employee_call_back);}else{if(_13.row.data.applied==0&&_13.row.data.actiontypeid==2){this._row_data=_13.row.data;_8.post("/research/admin/projects/load_employee_feedback",_9.make_params({data:{researchprojectitemid:this._researchprojectitemid,objectid:_13.row.data.objectid}})).then(this._load_new_employee_call_back);}else{if(_13.row.data.actiontypeid==-1&&_13.row.data.typeid=="E"){this._row_data=_13.row.data;_8.post("/research/admin/projects/load_employee",_9.make_params({data:{objectid:_13.row.data.objectid}})).then(this._load_new_employee_call_back);}}}}},_load_new_employee_call:function(_14){if(_14.success=="OK"){this.contact_edit.load(_14.data.data,_14.data.user_changes,this._outletdesks);this.contact_edit_container.selectChild(this.contact_edit);}else{alert("Problem Loading Changes");}},_employee_delete_event:function(_15){if(this._row_data!=null){this._row_data.applied=1;this._store.remove(_15);this.contact_edit_container.selectChild(this.blank_cont_view);}},_load_call:function(_16){if(_16.success=="OK"){this.outlet_main.load(_16.data.projectitem,_16.data.outlet,_16.data.user_changes);this.outlet_profile_ctrl.load(_16.data.projectitem,_16.data.outlet,_16.data.user_changes);this.outlet_coding_ctrl.load(_16.data.projectitem,_16.data.outlet,_16.data.user_changes);this.outlet_coverage_ctrl.load(_16.data.projectitem,_16.data.outlet,_16.data.user_changes);this.research_ctrl.load(_16.data.projectitem,_16.data.research,_16.data.user_changes);this.grid.set("query",{researchprojectitemid:_16.data.projectitem.researchprojectitemid});var tmp=_16.data.outlet.outlet.outletid+" - "+_16.data.outlet.outlet.outletname;_e.set(this.outlet_details_view,"innerHTML",tmp);this._outletid=_16.data.outlet.outlet.outletid;this._outletdesks=_16.data.outlet.outletdesks;}},load:function(_17){this.clear();this._researchprojectitemid=_17;_8.post("/research/admin/projects/load_user_feedback",_9.make_params({data:{researchprojectitemid:_17}})).then(this._load_call_back);},clear:function(){this.contact_edit_container.selectChild(this.blank_cont_view);},_employee_add_event:function(key){if(this._row_data!=null){this._row_data.applied=1;this._store.put(this._row_data);this.contact_edit_container.selectChild(this.blank_cont_view);}else{key.typeid="E";key.key=key.typeid+key.employeeid;key.objectid=key.employeeid;key.actiontypeid=-1;this._store.add(key);}},_employee_update_event:function(_18,_19,_1a){if(_1a=="desk"&&this._row_data!=null&&this._row_data!=undefined){this._row_data.applied=1;if(_19!=null){this._row_data.job_title=_19.job_title;this._row_data.contactname=_19.contactname;}this._store.put(this._row_data);this.contact_edit_container.selectChild(this.blank_cont_view);}},_show_menu:function(e,_1b){if(this.std_menu===null){this.std_menu=new dijit.Menu();this.std_menu.addChild(new dijit.MenuItem({label:"Add Contact",onClick:_c.hitch(this,this._add_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.std_menu.addChild(new dijit.MenuItem({label:"Delete Contact",onClick:_c.hitch(this,this._delete_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.std_menu.addChild(new dijit.MenuItem({label:"Set Primary Contact",onClick:_c.hitch(this,this._primary_contact),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.std_menu.startup();}if(this.std_menu_primary===null){this.std_menu_primary=new dijit.Menu();this.std_menu_primary.addChild(new dijit.MenuItem({label:"Add Contact",onClick:_c.hitch(this,this._add_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));this.std_menu_primary.startup();}if(_1b.isprimary==true){this.std_menu_primary._openMyself(e);}else{this.std_menu._openMyself(e);}},_add_employee:function(){this._row_data=null;this.employee_change_ctrl.set("dialog",this.employee_change_dlg);this.employee_change_ctrl.load(-1,this._outletid,"",this._outletdesks);this.employee_change_dlg.show();this.contact_edit_container.selectChild(this.blank_cont_view);},_delete_employee:function(){this.delete_ctrl.load(this._row_data.key,this._row_data.job_title,this._row_data.contactname);},_primary_contact:function(){this.employee_set_primary_ctrl.load(this._row_data.objectid,this._row_data.contactname,this._row_data.job_title,this.employee_set_primary_dlg);this.employee_set_primary_dlg.show();},_employee_set_primary_event:function(){this.grid.set("query",{researchprojectitemid:this._researchprojectitemid});},});});