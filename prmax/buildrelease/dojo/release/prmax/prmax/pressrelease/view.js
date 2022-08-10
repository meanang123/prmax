/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.pressrelease.view"]){dojo._hasResource["prmax.pressrelease.view"]=true;dojo.provide("prmax.pressrelease.view");dojo.require("prmax.pressrelease.Duplicate");dojo.require("prmax.pressrelease.newrelease");dojo.require("prmax.pressrelease.saveasstanding");dojo.require("prmax.pressrelease.briefreport");dojo.require("prmax.pressrelease.rename");dojo.require("prmax.pressrelease.output");dojo.require("prcommon.crm.add");dojo.require("prcommon.date.daterange");dojo.declare("prmax.pressrelease.view",[ttl.BaseWidget],{widgetsInTemplate:true,types:0,templateString:"<div>\r\n\t<div data-dojo-attach-point=\"borderControl\" data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\"' >\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"top\",style:\"height:42px;width:100%;overflow:hidden\",\"class\":\"std_menu_view\"'>\r\n\t\t\t<div style=\"height:40px;width:100%;overflow:hidden\" class=\"std_menu_view\">\r\n\t\t\t\t<div data-dojo-type=\"dijit.Toolbar\" data-dojo-props='\"class\":\"dijitToolbarTop\",style:\"float:left;height:100%;width:150px\"' >\r\n\t\t\t\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_AddDistributions\" data-dojo-attach-point=\"addbutton\" data-dojo-props='label:\"New\",iconClass:\"fa fa-plus fa-3x\",showLabel:false'></div>\r\n\t\t\t\t\t<div data-dojo-type=\"dijit.form.DropDownButton\" data-dojo-attach-point=\"menu_filter\" data-dojo-props='iconClass:\"fa fa-filter fa-3x\",showLabel:false,label:\"Filter By\"'>\r\n\t\t\t\t\t\t<div data-dojo-type=\"dijit.TooltipDialog\" data-dojo-attach-event=\"execute:_execute_filter\" data-dojo-props='style:\"width:500px\"'>\r\n\t\t\t\t\t\t\t<table border=\"0\" cellspacing=\"1\" cellpadding=\"1\" width=\"100%\">\r\n\t\t\t\t\t\t\t\t<tr><td class=\"prmaxlabeltag\">Name</td><td><input data-dojo-type=\"dijit.form.TextBox\" data-dojo-attach-point=\"namefilter\" data-dojo-props='name:\"namefilter\"'/></td></tr>\r\n\t\t\t\t\t\t\t\t<tr><td class=\"prmaxlabeltag\">Sent</td>\r\n\t\t\t\t\t\t\t\t\t<td><select data-dojo-type=\"dijit.form.ComboBox\" data-dojo-props='style:\"width:7em;color:black\",value:\"All\",autocomplete:false' data-dojo-attach-point=\"option\" data-dojo-attach-event=\"onChange:_OptionChanged\">\r\n\t\t\t\t\t\t\t\t\t\t<option>Display All</option>\r\n\t\t\t\t\t\t\t\t\t\t<option>Display Draft</option>\r\n\t\t\t\t\t\t\t\t\t\t<option>Display Sent</option>\r\n\t\t\t\t\t\t\t\t\t\t</select></td>\r\n\t\t\t\t\t\t\t\t\t<!--\t\r\n\t\t\t\t\t\t\t\t\t<td data-dojo-attach-point=\"option2_label1\" class=\"prmaxhidden\">Sent in the Last</td><td data-dojo-attach-point=\"option2_label2\" class=\"prmaxhidden\" ><select data-dojo-type=\"dijit.form.ComboBox\" data-dojo-props='style:\"width:7em;color:black\",value:\"6 Months\",autocomplete:false' data-dojo-attach-point=\"option2\" data-dojo-attach-event=\"onChange:_OptionChanged\"><option>6 Months</option><option>Year</option><option>All</option></select></td></tr>\r\n\t\t\t\t\t\t\t\t\t-->\t\r\n\t\t\t\t\t\t\t\t<tr><td data-dojo-attach-point=\"drange_label\" class=\"prmaxlabeltag\">Dates</td><td colspan=\"2\"><div data-dojo-type=\"prcommon.date.daterange\" data-dojo-attach-point=\"drange\" data-dojo-props='value:\"\",name:\"drange\"'></div></td></tr>\r\n\t\t\t\t\t\t\t\t<tr><td data-dojo-attach-point=\"client_label\">Client</td><td><select data-dojo-props='name:\"clientid\",autoComplete:true,searchAttr:\"clientname\",labelType:\"html\",style:\"color:black\"' data-dojo-type=\"dijit.form.FilteringSelect\" data-dojo-attach-point=\"clientid\"></select></td></tr>\r\n\t\t\t\t\t\t\t\t<tr><td><br/><br/></td></tr>\r\n\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t<td align=\"left\" colspan=\"2\"><button data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_clear_filter\" data-dojo-props='type:\"button\"' >Clear Filter</button></td>\r\n\t\t\t\t\t\t\t\t\t<td>&nbsp;</td>\r\n\t\t\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"submit\",name:\"submit\"'>Filter</button></td>\r\n\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t</table>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_Output\" data-dojo-attach-point=\"outputbtn\" data-dojo-props='label:\"Output\",iconClass:\"fa fa-print fa-3x\",showLabel:false'></div>\r\n\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"center\"'>\r\n\t\t\t<div data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\"' >\r\n\t\t\t\t<div data-dojo-attach-point=\"grid\" data-dojo-type=\"dojox.grid.DataGrid\" data-dojo-props='query:{ },rowsPerPage:30,region:\"left\",style:\"width:40%;height:100%\",sortFields:[{attribute:\"display_sent_time\",descending:true}],splitter:true'></div>\r\n\t\t\t\t<div data-dojo-type=\"dijit.layout.StackContainer\" data-dojo-attach-point=\"controls\" data-dojo-props='region:\"center\",doLayout:true'>\r\n\t\t\t\t\t<div data-dojo-attach-point=\"blank_view\" data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='title:\"blank\",selected:\"selected\"'></div>\r\n\t\t\t\t\t<div data-dojo-attach-point=\"main_view\" data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='title:\"main\",style:\"width:100%;height:100%\"'>\r\n\t\t\t\t\t\t<div data-dojo-type=\"dijit.layout.StackContainer\" data-dojo-attach-point=\"cont_stack\" data-dojo-props='region:\"center\",doLayout:true'>\r\n\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\",title:\"distribution\"' data-dojo-attach-point=\"distribution_view\">\r\n\t\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:105px;overflow:auto;overflow-x:hidden\"'>\r\n\t\t\t\t\t\t\t\t\t<p class=\"prmaxrowdisplaylarge\" style=\"text-align:center;padding:2px;border:1px soldid red\" data-dojo-attach-point=\"listname_display\"></p><br/></br>\r\n\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_DeleteRelease\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-trash\",label:\"Delete\",showLabel:false'></button>\r\n\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_brief_check_list\" data-dojo-attach-point=\"show_brief\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-print\",\"class\":\"prmaxhidden\",label:\"Print\",showLabel:false'></button>\r\n\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_Show_Email\"   data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"show_email\" data-dojo-props='iconClass:\"fa fa-envelope\",\"class\":\"prmaxhidden\",label:\"Email\",showLabel:true'></button>\r\n\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_Show_List\" data-dojo-attach-point=\"show_list\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-eye\",\"class\":\"prmaxhidden\",label:\"Distribution\"'></button>\r\n\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_RenameRelease\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-repeat\",label:\"Rename\"'></button>\r\n\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_Pull_Release\" data-dojo-attach-point=\"pull_release\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-pencil-square-o\",\"class\":\"prmaxhidden\",label:\"Edit Release\",showLabel:false'></button>\r\n\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_DuplicateRelease\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-floppy-o\",label:\" Duplicate\"'></button>\r\n\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_SaveToStanding\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-floppy-o\",label:\"Media List\"'></button>\r\n\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_show_analysis\" data-dojo-attach-point=\"show_analysis\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-eye\",\"class\":\"prmaxhidden\",label:\"Analysis\"'></button>\r\n\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_Refresh_Show_List\" data-dojo-attach-point=\"refresh_show_list\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-repeat\",\"class\":\"prmaxhidden\",label:\"Refresh\"'></button>\r\n\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_Show_Seo_Release\" data-dojo-attach-point=\"seo_show\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-eye\",\"class\":\"prmaxhidden\",label:\"SEO\"'></button>\r\n\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_Show_Clippings\" data-dojo-attach-point=\"show_clippings\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-eye\",\"class\":\"prmaxhidden\",label:\"Clippings\"'></button>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.layout.StackContainer\" data-dojo-attach-point=\"controls2\" data-dojo-props='region:\"center\",doLayout:true'>\r\n\t\t\t\t\t\t\t\t\t<div data-dojo-attach-point=\"grid2\" data-dojo-type=\"dojox.grid.DataGrid\" data-dojo-props='title:\"grid_view\",query:{ },rowsPerPage:100,style:\"width:100%;height:100%\"'></div>\r\n\t\t\t\t\t\t\t\t\t<div data-dojo-attach-point=\"grid_clips\" data-dojo-type=\"dojox.grid.DataGrid\" data-dojo-props='title:\"grid_view\",query:{ },rowsPerPage:100,style:\"width:100%;height:100%\"'></div>\r\n\t\t\t\t\t\t\t\t\t<div data-dojo-attach-point=\"sent_view\" data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='title:\"sent_view\",style:\"width:100%;height:100%\"'></div>\r\n\t\t\t\t\t\t\t\t\t<div data-dojo-attach-point=\"analysis_view\" data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='title:\"analysis_view\",style:\"width:100%;height:100%\"'></div>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\",title:\"seo_view\",\"class\":\"seoview\"' data-dojo-attach-point=\"seo_view\">\r\n\t\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\",\"class\":\"dijitToolbarTop\"'>\r\n\t\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_Show_Distribution\" data-dojo-attach-point=\"_show_distribution\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"PRMaxStdIcon PRMaxShowDistributionIcon\"'></button>\r\n\t\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_Widthdraw_Seo_Release\" data-dojo-attach-point=\"withdraw_release\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"PRMaxStdIcon PRMaxDeleteIcon\"'></button>\r\n\t\t\t\t\t\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_Update_Seo_Release\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"PRMaxStdIcon PRMaxUpdateIcon\"'></button>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"center\",splitter:true,\"class\":\"scrollpane\"' >\r\n\t\t\t\t\t\t\t\t\t<div data-dojo-type=\"prmax.pressrelease.seo.edit\" data-dojo-attach-point=\"seopressrelease\" data-dojo-props='style:\"width:100%;height:100%\",\"class\":\"scrollpane\"' ></div>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"rename_dialog\" data-dojo-props='title:\"Rename Distribution\",style:\"width:400px;height:200px\"'>\r\n\t\t<div data-dojo-type=\"prmax.pressrelease.rename\" data-dojo-attach-point=\"rename_ctrl\"></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Duplicate Distribution\",style:\"width:400px;height:180px\"' data-dojo-attach-point=\"duplcatedlg\">\r\n\t\t<div data-dojo-type=\"prmax.pressrelease.Duplicate\" data-dojo-attach-point=\"duplicatectrl\"></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Save As New Media List\"' data-dojo-attach-point=\"saveasstandingdlg\">\r\n\t\t<div data-dojo-type=\"prmax.pressrelease.saveasstanding\" data-dojo-attach-point=\"saveasstandingctrl\"></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Email Response Message\"' data-dojo-attach-point=\"msg_dialog\">\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-attach-point=\"msgctrl\" data-dojo-props='style:\"height:400px;width:600px\",\"class\":\"scrollpane\"'></div>\r\n\t\t<button data-dojo-attach-event=\"onClick:_CancelShow\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\"' >Close</button>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Brief Report\"' data-dojo-attach-point=\"report_dialog\">\r\n\t\t<div data-dojo-type=\"prmax.pressrelease.briefreport\" data-dojo-attach-point=\"report_ctrl\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"crm_dlg\" data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"New Engagement\", style:\"width:600px;height:700px\"'>\r\n\t\t<div data-dojo-attach-point=\"crm_add\" data-dojo-type=\"prcommon.crm.add\"></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Output\"' data-dojo-attach-point=\"dlg_output\">\r\n\t\t<div data-dojo-attach-point=\"outputctrl\" data-dojo-type=\"prmax.pressrelease.output\" data-dojo-props='style:\"width:450px;height:220px\"' ></div>\r\n\t</div>\t\r\n</div>\r\n",startup_mode:"Display All",constructor:function(){this.model=new prcommon.data.QueryWriteStore({url:"/emails/templates_list_grid",nocallback:true});this.model2=new prcommon.data.QueryWriteStore({url:"/emails/distribution_view"});this.model_clips=new prcommon.data.QueryWriteStore({url:"/clippings/list_clippings_emailtemplate"});this._clients=new dojox.data.JsonRestStore({target:"/clients/rest_combo",idAttribute:"id"});this._DeleteReleaseCallBack=dojo.hitch(this,this._DeleteReleaseCall);this._ShowDetailsCallBack=dojo.hitch(this,this._ShowDetailsCall);this._PullReleaseCallBack=dojo.hitch(this,this._PullReleaseCall);this._Load_Seo_Call_Back=dojo.hitch(this,this._Load_Seo_Call);this._WithDrawCallBack=dojo.hitch(this,this._WithDrawCall);if(PRMAX.utils.settings.seo==true){this.view["cells"][0][6]={name:"Seo Release",width:"60px",field:"seopressrelease_display"};}if(PRMAX.utils.settings.crm==true){this.view["cells"][0].push({name:PRMAX.utils.settings.issue_description,width:"120px",field:"issuename"});}dojo.subscribe("/pr/rename",dojo.hitch(this,this._rename_event));dojo.subscribe("/update/distribution_label",dojo.hitch(this,this._UpdateDistributionLabelEvent));},postCreate:function(){dojo.attr(this.client_label,"innerHTML",PRMAX.utils.settings.client_name);dojo.attr(this.rename_dialog,"title","Rename "+PRMAX.utils.settings.distribution_description);dojo.attr(this.duplcatedlg,"title","Duplicate "+PRMAX.utils.settings.distribution_description);dojo.attr(this.show_list,"label",PRMAX.utils.settings.distribution_description);this.view["cells"][0][5]["name"]=PRMAX.utils.settings.client_name;this.grid.set("structure",this.view);this.grid2.set("structure",this.view2);this.grid_clips.set("structure",this.view_clips);this.grid["onStyleRow"]=dojo.hitch(this,this._OnStyleRow);this.grid["onCellClick"]=dojo.hitch(this,this.onCellClick);this.grid2["onCellClick"]=dojo.hitch(this,this._OnCellClick2);this.grid._setStore(this.model);this.grid2._setStore(this.model2);this.grid_clips._setStore(this.model_clips);this.clientid.set("store",this._clients);this.clientid.set("value",-1);if(this.startup_mode!="All"){this.option.set("value",this.startup_mode);this.grid.setQuery(ttl.utilities.getPreventCache({restrict:this.option.get("value"),drange:this.drange.get("value")}));}if(PRMAX.utils.settings.useemail==false||PRMAX.utils.settings.isdemo==true){dojo.addClass(this.addbutton.domNode,"prmaxhidden");}this.inherited(arguments);},_OnStyleRow:function(_1){ttl.GridHelpers.onStyleRow(_1);},_DeleteReleaseCall:function(_2){if(_2.success=="OK"){this.model.deleteItem(this._row);alert("Distrbution Deleted");this._ClearAndHideDetails();}else{alert("Press Release lists cannot be deleted without first deleting the Press Release");}},onCellClick:function(e){this.grid.selection.clickSelectEvent(e);this._row=this.grid.getItem(e.rowIndex);dojo.xhrPost(ttl.utilities.makeParams({load:this._ShowDetailsCallBack,url:"/emails/templates_get_min",content:{emailtemplateid:this._row.i.emailtemplateid}}));},_OnCellClick2:function(e){this.grid2.selection.clickSelectEvent(e);this._row2=this.grid2.getItem(e.rowIndex);if(this._row2.i.hasmsg&&e.cellIndex==6){this.msgctrl.set("href",dojo.string.substitute("/emails/distribution_details?listmemberdistributionid=${listmemberdistributionid}",{listmemberdistributionid:this._row2.i.listmemberdistributionid}));this.msg_dialog.show();}if(e.cellIndex==0&&PRMAX.utils.settings.crm==true){this.crm_add.set("dialog",this.crm_dlg);this.crm_add.clear();this.crm_add.load(this._row2.i.outletid,this._row2.i.outletname,this._row2.i.employeeid,this._row2.i.contactname,this._row2.i.contactid,this._emailtemplateid);this.crm_dlg.show();this.crm_dlg.resize();}},_CancelShow:function(){this.msgctrl.set("content","");this.msg_dialog.hide();},_ShowDetailsCall:function(_3){if(_3.success=="OK"){this._list_view=true;dojo.removeClass(this.show_email.domNode,"prmaxhidden");dojo.removeClass(this.refresh_show_list.domNode,"prmaxhidden");dojo.removeClass(this.show_clippings.domNode,"prmaxhidden");if(PRMAX.utils.settings.has_ct==true){dojo.removeClass(this.show_analysis.domNode,"prmaxhidden");}dojo.attr(this.listname_display,"innerHTML",this._row.i.emailtemplatename);this._emailtemplateid=_3.data.emailtemplateid;this.grid2.setQuery(ttl.utilities.getPreventCache({emailtemplateid:_3.data.emailtemplateid}));this.grid_clips.setQuery(ttl.utilities.getPreventCache({emailtemplateid:_3.data.emailtemplateid}));this.controls.selectChild(this.main_view);this.controls2.selectChild(this.grid2);this.sent_view.set("href","/emails/templates_text?emailtemplateid="+_3.data.emailtemplateid);this.analysis_view.set("href","/emails/templates_analysis?emailtemplateid="+this._row.i.emailtemplateid);if(_3.data.pull){dojo.removeClass(this.pull_release.domNode,"prmaxhidden");}else{dojo.addClass(this.pull_release.domNode,"prmaxhidden");}this.cont_stack.selectChild(this.distribution_view);if(PRMAX.utils.settings.seo==true){this.seopressrelease.Clear();if(_3.data.seopressrelease){dojo.removeClass(this.seo_show.domNode,"prmaxhidden");}else{dojo.addClass(this.seo_show.domNode,"prmaxhidden");}}if(this._row.i.pressreleasestatusid==2){dojo.removeClass(this.show_brief.domNode,"prmaxhidden");}else{dojo.addClass(this.show_brief.domNode,"prmaxhidden");}}},_ClearAndHideDetails:function(){this.controls.selectChild(this.blank_view);dojo.attr(this.listname_display,"innerHTML","");this.grid2.setQuery(ttl.utilities.getPreventCache({}));this.controls2.selectChild(this.grid2);this.sent_view.set("content","");this.analysis_view.set("content","");},_DeleteRelease:function(){if(confirm("Delete "+this._row.i.emailtemplatename+"?")){var _4=true;if(confirm("Retain Collateral as global?")){_4=false;}dojo.xhrPost(ttl.utilities.makeParams({load:this._DeleteReleaseCallBack,url:"/emails/template_delete",content:{emailtemplateid:this._row.i.emailtemplateid,delete_collateral:_4}}));}},_RenameRelease:function(){this.rename_ctrl.load(this._row.i.emailtemplateid,this.rename_dialog);},view:{cells:[[{name:"Description",width:"300px",field:"emailtemplatename"},{name:"Time Sent",width:"120px",field:"display_sent_time"},{name:"Schedule Delivery",width:"120px",field:"embargo_display"},{name:"Nbr",width:"40px",field:"nbr"},{name:"Status",width:"60px",field:"status"},{name:"Client",width:"60px",field:"clientname"}]]},view2:{cells:[[{name:" ",width:"12px",field:"h",formatter:ttl.utilities.format_row_ctrl},{name:"Outlet",width:"200px",field:"outletname"},{name:"Job title",width:"150px",field:"job_title"},{name:"Contact",width:"150px",field:"contactname"},{name:"Email",width:"150px",field:"emailaddress"},{name:"Status",width:"60px",field:"status"},{name:" ",width:"2em",field:"hasmsg",formatter:ttl.utilities.genericView}]]},view_clips:{cells:[[{name:"Date",width:"60px",field:"clip_source_date_display"},{name:"Title",width:"300px",field:"clip_title"},{name:"Outlet",width:"120px",field:"outletname"},{name:"Client",width:"120px",field:"clientname"},{name:"Issue",width:"120px",field:"issuename"}]]},resize:function(){this.borderControl.resize(arguments[0]);},_AddDistributions:function(){dijit.byId("std_banner_control").ShowNewPressRelease();},Clear:function(){this.grid.setQuery(ttl.utilities.makeParams({}));},_OptionChanged:function(){if(this.option.get("value")=="Display Sent"){dojo.removeClass(this.drange_label,"prmaxhidden");dojo.removeClass(this.drange.domNode,"prmaxhidden");}else{dojo.addClass(this.drange_label,"prmaxhidden");dojo.addClass(this.drange.domNode,"prmaxhidden");}},refresh:function(_5){if(_5){this.option.set("value",_5);}this.grid.setQuery(ttl.utilities.getPreventCache({restrict:this.option.get("value"),clientid:this.clientid.get("value"),drange:this.drange.get("value")}));this._ClearAndHideDetails();},_DuplicateRelease:function(){this.duplicatectrl.Load(this.duplcatedlg,this._row.i.emailtemplateid);this.duplcatedlg.show();},_SaveToStanding:function(){this.saveasstandingctrl.Load(this.saveasstandingdlg,this._row.i.emailtemplateid);this.saveasstandingdlg.show();},_Show_List:function(){this._list_view=true;this.controls2.selectChild(this.grid2);this._swap_view();},_Show_Email:function(){this._list_view=false;this.controls2.selectChild(this.sent_view);this._swap_view();},_swap_view:function(){if(this._list_view==true){dojo.addClass(this.show_list.domNode,"prmaxhidden");dojo.removeClass(this.show_email.domNode,"prmaxhidden");}else{dojo.removeClass(this.show_list.domNode,"prmaxhidden");dojo.addClass(this.show_email.domNode,"prmaxhidden");}},_Refresh_Show_List:function(){this.grid2.setQuery(ttl.utilities.getPreventCache({emailtemplateid:this._row.i.emailtemplateid}));},_Pull_Release:function(){if(confirm("Return Release ("+this._row.i.emailtemplatename+")to Draft for Editing?")){dojo.xhrPost(ttl.utilities.makeParams({load:this._PullReleaseCallBack,url:"/emails/template_pull",content:{emailtemplateid:this._row.i.emailtemplateid}}));}},_PullReleaseCall:function(_6){if(_6.success=="OK"){alert("Release returned to Drafts for Editing.");this.controls.selectChild(this.blank_view);this._OptionChanged();}else{if(_6.success=="EX"){alert("Release Already Sent");}else{alert("Problem Pulling Release");}}},_Show_Seo_Release:function(){dojo.xhrPost(ttl.utilities.makeParams({load:this._Load_Seo_Call_Back,url:"/emails/seorelease/get",content:{seoreleaseid:this._row.i.seoreleaseid}}));},_Load_Seo_Call:function(_7){if(_7.success=="OK"){this.seopressrelease.Load(_7.data.emailtemplateid,_7.data);this.cont_stack.selectChild(this.seo_view);}else{}},_Update_Seo_Release:function(){if(confirm("Update SEO Release")){this.seopressrelease.Save();}},_Show_Distribution:function(){this.cont_stack.selectChild(this.distribution_view);},_WithDrawCall:function(_8){if(_8.success=="OK"){dojo.addClass(this.seo_show.domNode,"prmaxhidden");this.cont_stack.selectChild(this.distribution_view);this.model.setValue(this._row,"seopressrelease_display","",true);}else{alert("Problem withdrawing Press Release");}},_Widthdraw_Seo_Release:function(){if(confirm("Withdraw Release")){dojo.xhrPost(ttl.utilities.makeParams({load:this._WithDrawCallBack,url:"/emails/seorelease/withdraw",content:{emailtemplateid:this._row.i.emailtemplateid}}));}},_brief_check_list:function(){this.report_ctrl.load(this._row.i.listid,this.report_dialog);this.report_dialog.show();},_change_client:function(){this.refresh();},_rename_event:function(_9){this.model.setValue(this._row,"emailtemplatename",_9.emailtemplatename,true);this.model.setValue(this._row,"clientname",_9.clientname,true);this.model.setValue(this._row,"issuename",_9.issuename,true);},_show_analysis:function(){this.controls2.selectChild(this.analysis_view);},_execute_filter:function(){var _a={restrict:this.option.get("value"),clientid:this.clientid.get("value"),drange:this.drange.get("value")};var _b=this.namefilter.get("value");if(_b.length){_a["emailtemplatename"]=_b;}this.grid.setQuery(ttl.utilities.getPreventCache(_a));},_clear_filter:function(){this.clientid.set("value",-1);this.option.set("value","Display All");this.namefilter.set("value","");},_Show_Clippings:function(){this.controls2.selectChild(this.grid_clips);},_clear_filter:function(){this.clientid.set("value",-1);this.option.set("value","Display All");this.namefilter.set("value","");},_UpdateDistributionLabelEvent:function(){dojo.attr(this.rename_dialog,"title","Rename "+PRMAX.utils.settings.distribution_description);dojo.attr(this.duplcatedlg,"title","Duplicate "+PRMAX.utils.settings.distribution_description);dojo.attr(this.show_list,"label",PRMAX.utils.settings.distribution_description);},_Output:function(){this.outputctrl.clear();this.outputctrl.set("dialog",this.dlg_output);this.dlg_output.show();}});}