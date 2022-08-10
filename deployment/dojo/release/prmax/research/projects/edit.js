//>>built
require({cache:{"url:research/projects/templates/edit.html":"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-attach-point=\"controls\" data-dojo-props='region:\"top\",style:\"height:44px;width:100%;overflow:hidden\"'>\r\n\t\t<div data-dojo-attach-point=\"researchprojectname\" class=\"dijitToolbar prmaxrowdisplaylarge\" style=\"float:left;height:99%;width:25%;padding:0px;margin:0px\">Project Name</div>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"fa fa-filter fa-3x\",label:\"Filter\",showLabel:true'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Filter\" data-dojo-attach-event=\"execute: _execute_filter\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr><td>Type</td><td><select data-dojo-attach-point=\"filter_researchprojectstatusid\" name=\"researchprojectstatusid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='searchAttr:\"name\",labelType:\"html\"' /></td></tr>\r\n\t\t\t\t\t\t<tr><td>Outlet Name</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_outletname\" data-dojo-props='type:\"text\",name:\"outletname\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>Email Address</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_emailaddress\" data-dojo-props='type:\"text\",name:\"emailaddress\"' ></td></tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick:_clear_filter\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"submit\",name:\"submit\"'>Filter by</button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-attach-event=\"onClick:_list_of_projects\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-list-alt fa-3x\"'><span>Goto Project List</span></div>\r\n\t\t\t<div data-dojo-attach-event=\"onClick:_show_info\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-info fa-3x\"'><span>Project Status</span></div>\r\n\t\t\t<div data-dojo-attach-event=\"onClick:_show_add\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-plus fa-3x\"'><span>Add to Project</span></div>\r\n\t\t\t<div data-dojo-attach-event=\"onClick:_do_refresh\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-refresh fa-3x\"'><span>Refresh</span></div>\r\n\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dojox/layout/ExpandoPane\" data-dojo-props='title:\"Outlets\",region:\"left\",maxWidth:175,style:\"width:40%;height:100%;overflow:hidden\",splitter:true'>\r\n\t\t<div data-dojo-attach-point=\"grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"height:100%;width:100%\"'></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"zone\" data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-props='region:\"center\"'>\r\n\t\t<div data-dojo-attach-point=\"blank\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='title:\"blank\"'></div>\r\n\t\t<div data-dojo-attach-point=\"outletwizard\" data-dojo-type=\"research/questionnaires/OutletUpdate\" data-dojo-props='title:\"outletwizard\",style:\"height:100%;width:100%\"'></div>\r\n\t\t<div data-dojo-attach-point=\"deskwizard\" data-dojo-type=\"research/questionnaires/DeskUpdate\" data-dojo-props='title:\"deskwizard\",style:\"height:100%;width:100%\"'></div>\r\n\t\t<div data-dojo-attach-point=\"outletedit\" data-dojo-type=\"research/outlets/OutletEdit\" data-dojo-props='prefix:\"${prefix}\",title:\"outlet\",style:\"width:100%;height:100%\",\"class\":\"bordered\"'></div>\r\n\t\t<div data-dojo-attach-point=\"freelanceedit\" data-dojo-type=\"research/freelance/FreelanceEdit\" data-dojo-props='title:\"freelance\",style:\"width:100%;height:100%\",\"class\":\"bordered\"'></div>\r\n\t\t<div data-dojo-attach-point=\"freelancewizard\" data-dojo-type=\"research/questionnaires/FreelanceEdit\" data-dojo-props='title:\"freelance\",style:\"width:100%;height:100%\",\"class\":\"bordered\"'></div>\r\n\t\t<div data-dojo-attach-point=\"info_page\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='title:\"info_page\",style:\"width:100%;height:100%\",\"class\":\"bordered\"'></div>\r\n\t\t<div data-dojo-attach-point=\"statusedit\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='title:\"status_edit\",style:\"width:100%;height:100%\",\"class\":\"bordered\"'>\r\n\t\t\t<br/>\r\n\t\t\t<form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onsubmit:\"return false;\",\"class\":\"prmaxdefault\"'>\r\n\t\t\t\t<input data-dojo-attach-point=\"researchprojectitemid\" data-dojo-props='name:\"researchprojectitemid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\"  border =\"0\">\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"200px\">New Status</td><td ><select data-dojo-attach-point=\"researchprojectstatusid\" data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='name:\"researchprojectstatusid\",searchAttr:\"name\",labelType:\"html\",\"class\":\"prmaxrequired\"'/></td></tr>\r\n<!--\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Update Researched Date</td><td><input data-dojo-attach-point=\"researcheddate\" data-dojo-props='name:\"researcheddate\",type:\"checkbox\"' data-dojo-type=\"dijit/form/CheckBox\"></td></tr>\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Notes</td><td><div class=\"stdtextframe\" ><textarea data-dojo-attach-point=\"notes\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"notes\",style:\"width:99%;height:99%\"'  ></textarea></div></td></tr>\r\n-->\r\n\t\t\t\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t\t\t\t<tr>\r\n<!--\r\n\t\t\t\t\t\t<td align=\"left\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_update_record_complete\" data-dojo-props='type:\"button\",label:\"Complete\"'></button></td>\r\n-->\r\n\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_update_record\" data-dojo-props='type:\"button\",label:\"Update\"'></button></td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t\t</form>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"append_select\" data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='title:\"append_select\",gutters:false,style:\"width:100%;height:100%\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='region:\"top\",style:\"width:100%;height:40%;overflow:hidden\",gutters:false'>\r\n\t\t\t\t<div data-dojo-attach-point=\"search_tabcont\" data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\"'>\r\n\t\t\t\t\t<div data-dojo-attach-point=\"search_tab_outlet\" data-dojo-type=\"prcommon2/search/OutletSearch\" data-dojo-props='style:\"height:100%;overflow:auto;overflow-x:hidden\",\"class\":\"scrollpanel\",title:\"Outlet\"'></div>\r\n\t\t\t\t\t<div data-dojo-attach-point=\"search_tab_freelance\" data-dojo-type=\"prcommon2/search/FreelanceSearch\" data-dojo-props='style:\"height:100%;overflow:auto;overflow-x:hidden\",\"class\":\"scrollpanel\",title:\"Freelance\"'></div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:15%;padding-top:10px\"'>\r\n\t\t\t\t\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse: collapse;\" >\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-point=\"search_append\" data-dojo-attach-event=\"onClick:_search_append\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='\"class\":\"prmaxbutton\",iconClass:\"fa fa-search-plus\",busyLabel:\"Adding\"'>Append Results too Project</button></td>\r\n\t\t\t\t\t\t\t<td><button data-dojo-attach-event=\"onClick:_clear_search\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxbutton\",label:\"Clear Results\"' ></button></td>\r\n\t\t\t\t\t\t\t<td><button data-dojo-attach-event=\"onClick:_clear_search_criteria\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxbutton\",label:\"Clear Criteria\"' ></button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-attach-point=\"searchbutton\" data-dojo-attach-event=\"onClick:_search\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='\"class\":\"prmaxbutton\",iconClass:\"fa fa-search-plus\",busyLabel:\"Searching...\",label:\"Search\"'></button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-attach-point=\"grid_append_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\",splitter:true'></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"resend_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Send Questionnaires Link\"'>\r\n\t\t<form data-dojo-attach-point=\"form_resend\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onsubmit:\"return false;\",\"class\":\"prmaxdefault\"'>\r\n\t\t\t<input data-dojo-attach-point=\"researchprojectitemid2\" data-dojo-props='name:\"researchprojectitemid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t\t<table class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\"  border =\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"120px\">Email</td><td style=\"width:450px\"><input data-dojo-attach-point=\"email\"  data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",style:\"width:98%\",maxlength:70'></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Subject</td><td><input data-dojo-props='\"class\":\"prmaxrequired\",name:\"subject\",type:\"text\",trim:true,required:true' data-dojo-attach-point=\"subject\" data-dojo-type=\"dijit/form/ValidationTextBox\"/></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">From User</td><td><select data-dojo-attach-point=\"iuserid\" data-dojo-props='name:\"iuserid\",autoComplete:\"true\",style:\"width:15em\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\"></select></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" valign=\"top\" align=\"right\">Body</td><td><div style=\"height:300px\" class=\"dialogprofileframelarge\"><textarea data-dojo-attach-point=\"bodytext\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"bodytext\",style:\"width:99%;height:99%\"'></textarea></div></td></tr>\r\n\r\n\t\t\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t\t\t<tr><td colspan=\"2\" align=\"right\"><button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-point=\"sendbtn\" data-dojo-attach-event=\"onClick:_send_email_record\" data-dojo-props='type:\"button\",busyLabel:\"Sending\"'>Send</button></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\r\n</div>\r\n"}});define("research/projects/edit",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../projects/templates/edit.html","dijit/layout/BorderContainer","ttl/grid/Grid","ttl/store/JsonRest","dojo/store/Observable","dojo/request","ttl/utilities2","dojo/json","dojo/topic","dojo/_base/lang","dojo/dom-attr","dojo/data/ItemFileReadStore","dojox/layout/ExpandoPane","dijit/layout/StackContainer","dijit/layout/ContentPane","research/projects/outletwizard","research/outlets/OutletEdit","research/freelance/FreelanceEdit","research/questionnaires/OutletUpdate","research/questionnaires/DeskUpdate","research/questionnaires/FreelanceEdit","dijit/form/ValidationTextBox","dojox/validate/regexp","dijit/form/ValidationTextBox","dijit/form/Button","dijit/form/DropDownButton","dijit/TooltipDialog","dijit/form/FilteringSelect","prcommon2/search/FreelanceSearch","research/outlets/OutletEdit"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e){return _1("research.projects.edit",[_2,_4],{templateString:_3,gutters:false,prefix:"project",constructor:function(){this.model=new _7(new _6({target:"/research/admin/projects/projects_members",idProperty:"researchprojectitemid"}));this.researchprojectstatus=new _e({url:"/common/lookups?searchtype=researchprojectstatus&nofilter=1"});this._search_store=new _7(new _6({target:"/search/list_rest?searchtypeid=5&research=1",idProperty:"sessionsearchid"}));this._users=new _e({url:"/common/lookups?searchtype=users&group=dataadmin&nofilter"});this._update_call_back=_c.hitch(this,this._update_call);this._resend_call_back=_c.hitch(this,this._resend_call);this._load_research_call_back=_c.hitch(this,this._load_research_call);this._load_call_back=_c.hitch(this,this._load_call);this._append_call_back=_c.hitch(this,this._append_call);this._clear_search_call_back=_c.hitch(this,this._clear_search_call);this._delete_search_row_call_back=_c.hitch(this,this._delete_search_row_call);this._delete_project_item_call_back=_c.hitch(this,this._delete_project_item_call);this._load_project_item_call_back=_c.hitch(this,this._load_project_item_call);this.std_menu=null;this.full_menu=null;this.resend_menu=null;this.wizard_menu=null;},postCreate:function(){var _f=[{label:" ",field:"menu",className:"grid-field-image-view",formatter:_9.format_row_ctrl},{label:"OutletID",className:"dgrid-column-status-small",field:"outletid"},{label:"Outlet",className:"standard",field:"outletname"},{label:"Desk",className:"standard",field:"deskname"},{label:"Status",className:"standard",field:"researchprojectstatusdescription"},{label:"Firstname",className:"standard",field:"firstname"},{label:"Surname",className:"standard",field:"surname"}];this.grid=new _5({columns:_f,selectionMode:"single",store:this.model});this.grid_view.set("content",this.grid);this.grid.on(" .dgrid-cell:click",_c.hitch(this,this._on_cell_call));this.researchprojectstatusid.set("store",PRCOMMON.utils.stores.Research_Project_Status());this.filter_researchprojectstatusid.set("store",this.researchprojectstatus);this.filter_researchprojectstatusid.set("value",-1);this.iuserid.set("store",this._users);this.iuserid.set("value",-1);var _10=[{label:"  ",className:"grid-field-image-view",field:"sessionsearchid",formatter:_9.format_row_ctrl},{label:"Name",className:"standard",field:"outletname"},{label:"Desk",className:"standard",field:"deskname"},{label:"Contact",className:"standard",field:"contactname"},{label:"Source",className:"dgrid-column-type-small",field:"sourcename"},{label:"Id",className:"dgrid-column-nbr-right",field:"outletid"}];this.grid_search=new _5({columns:_10,selectionMode:"none",store:this._search_store});this.grid_append_view.set("content",this.grid_search);this.grid_search.on(".dgrid-row:click",_c.hitch(this,this._search_on_cell_call));this.inherited(arguments);},_on_cell_call:function(e){var _11=this.grid.cell(e);if(_11.row==undefined||_11.row.data==undefined){return;}this._data=_11.row.data;if(_11.column.field=="menu"){this._show_menu(e);}else{if(this._data.researchprojectstatusid==3&&this._data.wizard){this._wizard();}else{this._edit_item();}}},_delete_project_item_call:function(_12){if(_12.success=="OK"){this.model.remove(_12.researchprojectitemid);alert("Item Deleted");this.zone.selectChild(this.blank);}else{alert("Problem Deleting Item");}},_show_menu:function(evt){var _13=null;if(this._data.resend=="R"&&(this._data.wizard||this._data.researchprojectstatusid=="3")){if(this.full_menu===null){this.full_menu=new dijit.Menu();this.full_menu.addChild(new dijit.MenuItem({label:"Delete",onClick:_c.hitch(this,this._delete_item)}));this.full_menu.addChild(new dijit.MenuItem({label:"Full Edit",onClick:_c.hitch(this,this._edit_item)}));this.full_menu.addChild(new dijit.MenuItem({label:"Status",onClick:_c.hitch(this,this._complete)}));this.full_menu.addChild(new dijit.MenuItem({label:"Resend",onClick:_c.hitch(this,this._resend)}));this.full_menu.addChild(new dijit.MenuItem({label:"Customer Feedback",onClick:_c.hitch(this,this._wizard)}));this.full_menu.addChild(new dijit.MenuItem({label:"Show Questionnaire",onClick:_c.hitch(this,this._show_quest)}));this.full_menu.startup();}_13=this.full_menu;}else{if(this._data.resend=="R"&&this._data.wizard==""){if(this.resend_menu===null){this.resend_menu=new dijit.Menu();this.resend_menu.addChild(new dijit.MenuItem({label:"Delete",onClick:_c.hitch(this,this._delete_item)}));this.resend_menu.addChild(new dijit.MenuItem({label:"Full Edit",onClick:_c.hitch(this,this._edit_item)}));this.resend_menu.addChild(new dijit.MenuItem({label:"Status",onClick:_c.hitch(this,this._complete)}));this.resend_menu.addChild(new dijit.MenuItem({label:"Resend",onClick:_c.hitch(this,this._resend)}));this.resend_menu.addChild(new dijit.MenuItem({label:"Show Questionnaire",onClick:_c.hitch(this,this._show_quest)}));this.resend_menu.startup();}_13=this.resend_menu;}else{if(this._data.resend!="R"&&(this._data.wizard||this._data.researchprojectstatusid=="3")){if(this.wizard_menu===null){this.wizard_menu=new dijit.Menu();this.wizard_menu.addChild(new dijit.MenuItem({label:"Delete",onClick:_c.hitch(this,this._delete_item)}));this.wizard_menu.addChild(new dijit.MenuItem({label:"Full Edit",onClick:_c.hitch(this,this._edit_item)}));this.wizard_menu.addChild(new dijit.MenuItem({label:"Status",onClick:_c.hitch(this,this._complete)}));this.wizard_menu.addChild(new dijit.MenuItem({label:"Customer Feedback",onClick:_c.hitch(this,this._wizard)}));this.wizard_menu.addChild(new dijit.MenuItem({label:"Show Questionnaire",onClick:_c.hitch(this,this._show_quest)}));this.wizard_menu.startup();}_13=this.wizard_menu;}else{if(this.std_menu===null){this.std_menu=new dijit.Menu();this.std_menu.addChild(new dijit.MenuItem({label:"Delete",onClick:_c.hitch(this,this._delete_item)}));this.std_menu.addChild(new dijit.MenuItem({label:"Full Edit",onClick:_c.hitch(this,this._edit_item)}));this.std_menu.addChild(new dijit.MenuItem({label:"Status",onClick:_c.hitch(this,this._complete)}));this.std_menu.addChild(new dijit.MenuItem({label:"Show Questionnaire",onClick:_c.hitch(this,this._show_quest)}));this.std_menu.startup();}_13=this.std_menu;}}}_13._openMyself(evt);},_show_quest:function(){var tmp=PRMAX.Settings.questionnaireurl+this._data.researchprojectitemid+"/quest";window.open(tmp,"_blank");},_wizard:function(){if(this._data.wizard){if(this._data.prmax_outletgroupid=="freelance"){this.freelancewizard.load(this._data.researchprojectitemid);this.zone.selectChild(this.freelancewizard);}else{if(this._data.outletdeskid){this.deskwizard.load(this._data.researchprojectitemid);this.zone.selectChild(this.deskwizard);}else{this.outletwizard.load(this._data.researchprojectitemid);this.zone.selectChild(this.outletwizard);}}}},_resend:function(){this.researchprojectitemid2.set("value",this._data.researchprojectitemid);_8.post("/research/admin/projects/project_item_details",_9.make_params({data:{researchprojectitemid:this._data.researchprojectitemid}})).then(this._load_research_call_back);},_delete_item:function(){if(confirm("Delete Project Item")){_8.post("/research/admin/projects/project_item_delete",_9.make_params({data:{researchprojectitemid:this._data.researchprojectitemid}})).then(this._delete_project_item_call_back);}},_edit_item:function(){if(this._data.prmax_outletgroupid=="freelance"){this.zone.selectChild(this.freelanceedit);this.freelanceedit.load(this._data.outletid);}else{this.zone.selectChild(this.outletedit);this.outletedit.load(this._data.outletid,this.prefix);}},_complete:function(){_8.post("/research/admin/projects/project_item_details",_9.make_params({data:{researchprojectitemid:this._data.researchprojectitemid}})).then(this._load_project_item_call_back);},_load_project_item_call:function(_14){if(_14.success=="OK"){this.researchprojectitemid.set("value",_14.data.item.researchprojectitemid);this.researchprojectstatusid.set("value",_14.data.item.researchprojectstatusid);this.zone.selectChild(this.statusedit);}else{alert("Please complete the Research details.");}},_search_on_cell_call:function(e){var _15=this.grid_search.cell(e);if(_15.column.id=="0"){if(confirm("Remove from results?")){_8.post("/search/delete_session_row",_9.make_params({data:{searchtypeid:5,sessionsearchid:_15.row.data.sessionsearchid}})).then(this._delete_search_row_call_back);}}},_delete_search_row_call:function(_16){if(_16.success=="OK"){this._search_store.remove(_16.sessionsearchid);}},_load_research_call:function(_17){if(_17.success=="OK"){this.subject.set("value",_17.data.subject);this.email.set("value",_17.data.email);this.bodytext.set("value","\n<LINK TO DATABASE>\n");this.sendbtn.cancel();this.resend_dlg.show();}},load:function(_18){this.researchprojectid=_18.researchprojectid;this.grid.set("query",{researchprojectid:_18.researchprojectid});_d.set(this.researchprojectname,"innerHTML",_18.researchprojectname);this.zone.selectChild(this.blank);},_clear:function(){this.researchprojectitemid.set("researchprojectitemid",-1);this.researchprojectstatusid.set("value",1);},_update_call:function(_19){if(_19.success=="OK"){this.model.put(_19.data);alert("Record Updated");}else{alert("Problem");}},_update_record:function(){_8.post("/research/admin/projects/project_item_update",_9.make_params({data:this.form.get("value")})).then(this._update_call_back);},_update_record_complete:function(){_8.post("/research/admin/projects/project_item_update_complete",_9.make_params({data:{researchprojectitemid:this.researchprojectitemid.get("value")}})).then(this._update_call_back);},_send_email_record:function(){if(_9.form_validator(this.form_resend)==false){alert("Not all required field filled in");throw "N";}var tmp=this.bodytext.get("value");if(tmp.indexOf("<LINK TO DATABASE>")===-1){alert("Missing Link to database");this.bodytext.set("value",tmp+"\n<LINK TO DATABASE>");throw "N";}var _1a=this.form_resend.get("value");_8.post("/research/admin/projects/project_quest_resend",_9.make_params({data:_1a})).then(this._resend_call_back);},_resend_call:function(_1b){if(_1b.success=="OK"){this.model.put(_1b.data);alert("Questionairre Link Resent");this.resend_dlg.hide();this.sendbtn.cancel();}else{alert("Problem");}this.sendbtn.cancel();},_clear_filter:function(){this.filter_researchprojectstatusid.set("value",-1);this.filter_outletname.set("value","");this.filter_emailaddress.set("value","");},_execute_filter:function(){var _1c={researchprojectid:this.researchprojectid};if(arguments[0].researchprojectstatusid!="-1"){_1c["researchprojectstatusid"]=arguments[0].researchprojectstatusid;}if(arguments[0].outletname!=""){_1c["outletname"]=arguments[0].outletname;}if(arguments[0].emailaddress!=""){_1c["emailaddress"]=arguments[0].emailaddress;}this.grid.set("query",_1c);},_list_of_projects:function(){_b.publish("/projects/list");},_show_info:function(){this.info_page.set("href","/research/admin/projects/projects_status?researchprojectid="+this.researchprojectid);this.zone.selectChild(this.info_page);},_delete_search_row_call:function(_1d){if(_1d.success=="OK"){this._search_store.remove(_1d.sessionsearchid);}},_clear_search_call:function(_1e){if(_1e.success=="OK"){this._load_search_call();}},_clear_search:function(){this.grid_search.set("query",{});_8.post("/search/sessionclear",_9.make_params({data:{searchtypeid:5}})).then(this._clear_search_call_back);},_clear_search_criteria:function(){this.search_tab_outlet.clear();this.search_tab_freelance.clear();},_get_form:function(){var _1f=null;dojo.every(this.search_tabcont.selectedChildWidget.getChildren(),function(_20){if(_20.formid!=null){_1f=_20;}});return _1f;},_search:function(){var _21=this._get_form();_21.setExtendedMode(false);var _22=_21.get("value");_22["mode"]=1;_22["search_partial"]=2;_22["searchtypeid"]=5;_8.post("/search/dosearch",_9.make_params({data:_22})).then(this._load_call_back);},_load_call:function(_23){this.searchbutton.cancel();this.grid_search.set("query",{});},_search_append:function(){if(confirm("Append to Project")){_8.post("/research/admin/projects/projects_append",_9.make_params({data:{researchprojectid:this.researchprojectid}})).then(this._append_call_back);}else{this.search_append.cancel();}},_append_call:function(_24){if(_24.success=="OK"){this.grid.set("query",{researchprojectid:this.researchprojectid});alert("Search Appended");this.grid_search.set("query",{});}else{alert("Problem");}this.search_append.cancel();},_show_add:function(){this.zone.selectChild(this.append_select);},_do_refresh:function(){this.grid.set("query",{researchprojectid:this.researchprojectid});}});});