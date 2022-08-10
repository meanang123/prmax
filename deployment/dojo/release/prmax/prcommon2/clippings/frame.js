//>>built
require({cache:{"url:prcommon2/clippings/templates/frame.html":"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\", style:\"height:50px;width:100%;overflow:hidden;background-color:${back_colour};border-bottom:2px solid white\", \"class\":\"std_menu_view\"'>\r\n\t\t<div data-dojo-attach-point=\"logo_view\" style=\"float:left\"><img height=\"50px\" width=\"160px\" src=\"/static/images/adept/banner_prmax_logo.png\"></img>&nbsp;&nbsp;&nbsp;</div>\r\n\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-pie-chart fa-3x\",showLabel:false,label:\"Show Summary\"' data-dojo-attach-event=\"onClick:_summary_btn_event\"></div>\r\n\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-line-chart fa-3x\",showLabel:false,label:\"Time\"' data-dojo-attach-event=\"onClick:_time_btn_event\"></div>\r\n\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-info-circle fa-3x\",showLabel:false,label:\"Show Details\"' data-dojo-attach-event=\"onClick:_details_btn_event\"></div>\r\n\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-plus fa-3x\",showLabel:false,label:\"Add Private Clipping\"' data-dojo-attach-event=\"onClick:_add_btn_event\"></div>\r\n\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-sliders fa-3x\",showLabel:false,label:\"Options\"' data-dojo-attach-event=\"onClick:_options_btn_event\" data-dojo-attach-point=\"options_btn\"></div>\r\n\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-columns fa-3x\",showLabel:false,label:\"Dashboard\"' data-dojo-attach-event=\"onClick:_dashboard_btn_event\" data-dojo-attach-point=\"dashboard_btn\"></div>\r\n\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-cog fa-3x\",showLabel:false,label:\"Dashboard Settings\"' data-dojo-attach-event=\"onClick:_dashboardsettings_btn_event\" data-dojo-attach-point=\"dashboardsettings_btn\"></div>\r\n\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxhidden\",iconClass:\"fa fa-envelope-o fa-3x\",showLabel:false,label:\"Sent Clippings Emails\"' data-dojo-attach-event=\"onClick:_email_btn_event\" data-dojo-attach-point=\"emailsbtn\"></div>\r\n\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxhidden\",iconClass:\"fa fa-print fa-3x\",showLabel:false,label:\"Output\"' data-dojo-attach-event=\"onClick:_output_std_btn_event\" data-dojo-attach-point=\"outputbtn\"></div>\r\n\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxhidden\",iconClass:\"fa fa-check fa-3x\",showLabel:false,label:\"Select/Deselect All Clippings\"' data-dojo-attach-event=\"onClick:_selectall_btn_event\" data-dojo-attach-point=\"selectallbtn\"></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='region:\"center\",gutters:false' >\r\n\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"controls\" data-dojo-props=\"region:'center',preload:false\">\r\n\t\t\t<div data-dojo-attach-point=\"lineschart\" data-dojo-type=\"prcommon2/clippings/charts/lineschart\" data-dojo-props='style:\"width:100%;height:100%\",selected:\"selected\",back_colour:\"${back_panel_colour}\",fore_color:\"${fore_color}\"'></div>\r\n\t\t\t<div data-dojo-attach-point=\"clippings_view\" data-dojo-type=\"prcommon2/clippings/detailedviewer\" data-dojo-props='style:\"width:100%;height:100%\",preload:true'></div>\r\n\t\t\t<div data-dojo-attach-point=\"piechart\" data-dojo-type=\"prcommon2/clippings/charts/piechart\" data-dojo-props='style:\"width:100%;height:100%\",back_colour:\"${back_panel_colour}\",fore_color:\"${fore_color}\"'></div>\r\n\t\t\t<div data-dojo-attach-point=\"add_private\" data-dojo-type=\"prcommon2/clippings/edit_private\" class=\"scrollpanel\"></div>\r\n\t\t\t<div data-dojo-attach-point=\"options_view\" data-dojo-type=\"prcommon2/clippings/optionsviewer\" class=\"scrollpanel\"></div>\r\n\t\t\t<div data-dojo-attach-point=\"dashboard_view\" data-dojo-type=\"prcommon2/clippings/dashboard\" class=\"scrollpanel\"></div>\r\n\t\t\t<div data-dojo-attach-point=\"dashboardsettings_view\" data-dojo-type=\"prcommon2/clippings/dashboardsettings\" class=\"scrollpanel\"></div>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"email_dlg\" data-dojo-type=\"dijit/Dialog\" title=\"Email Clippings\" data-dojo-props='style:\"width:500px\"'>\r\n\t\t\t<div data-dojo-type=\"prcommon2/clippings/emails\" data-dojo-attach-point=\"emails_ctrl\"></div>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"output_std_dlg\" data-dojo-type=\"dijit/Dialog\" title=\"Output\" data-dojo-props='style:\"width:500px;height:300px\"'>\r\n\t\t\t<div data-dojo-type=\"prcommon2/clippings/output_std\" data-dojo-attach-point=\"output_std_ctrl\"></div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"}});define("prcommon2/clippings/frame",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../clippings/templates/frame.html","dijit/layout/BorderContainer","dojo/dom-geometry","dojo/_base/lang","ttl/store/JsonRest","dojo/store/Observable","ttl/grid/Grid","ttl/utilities2","dojo/topic","dojo/request","dojo/dom-attr","dojo/dom-class","dojox/data/JsonRestStore","dijit/layout/StackContainer","dijit/layout/ContentPane","dijit/layout/TabContainer","dijit/Toolbar","dijit/form/Button","prcommon2/clippings/charts/piechart","prcommon2/clippings/charts/lineschart","prcommon2/clippings/filter","prcommon2/clippings/detailedviewer","prcommon2/clippings/edit_private","prcommon2/clippings/optionsviewer","prcommon2/clippings/dashboard","prcommon2/clippings/dashboardsettings","prcommon2/clippings/emails","prcommon2/clippings/output_std","prcommon2/clippings/add_server","dijit/form/ValidationTextBox","dijit/form/DateTextBox","dijit/form/NumberTextBox","dijit/form/CurrencyTextBox","dijit/form/Textarea"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e){return _1("prcommon2.clippings.frame",[_2,_4],{templateString:_3,gutters:false,as_frame:0,back_colour:"black",back_panel_colour:"black",fore_color:"lightblue",constructor:function(){this._active_page=null;_b.subscribe("/clipping/change_view",_6.hitch(this,this._change_view_event));this._selectall_call_back=_6.hitch(this,this._selectall_call);},postCreate:function(){if(this.as_frame==1){_e.add(this.logo_view,"prmaxhidden");}this.inherited(arguments);this._active_page=this.lineschart;this.inherited(arguments);},_show_hide_details:function(_f){this.controls.selectChild(_f);this._active_page=_f;},_details_btn_event:function(){this._change_view_event("clippings_view");},_summary_btn_event:function(){_e.add(this.emailsbtn.domNode,"prmaxhidden");_e.add(this.outputbtn.domNode,"prmaxhidden");_e.add(this.selectallbtn.domNode,"prmaxhidden");this._show_hide_details(this.piechart);},_time_btn_event:function(){_e.add(this.emailsbtn.domNode,"prmaxhidden");_e.add(this.outputbtn.domNode,"prmaxhidden");_e.add(this.selectallbtn.domNode,"prmaxhidden");this._show_hide_details(this.lineschart);},_refesh_chart_event:function(){if(this._active_page){this._active_page.refesh_view();}},_add_btn_event:function(){_e.add(this.emailsbtn.domNode,"prmaxhidden");_e.add(this.outputbtn.domNode,"prmaxhidden");_e.add(this.selectallbtn.domNode,"prmaxhidden");this.add_private.clear();this.controls.selectChild(this.add_private);this._active_page=null;},_email_btn_event:function(){this.emails_ctrl.load(this.email_dlg);this.email_dlg.show();},_output_std_btn_event:function(){this.output_std_ctrl.load(this.output_std_dlg);this.output_std_dlg.show();},_change_view_event:function(_10){switch(_10){case "clippings_view":_e.remove(this.outputbtn.domNode,"prmaxhidden");_e.remove(this.emailsbtn.domNode,"prmaxhidden");_e.remove(this.selectallbtn.domNode,"prmaxhidden");this._show_hide_details(this.clippings_view);break;case "linechart":_e.add(this.emailsbtn.domNode,"prmaxhidden");_e.add(this.outputbtn.domNode,"prmaxhidden");_e.add(this.selectallbtn.domNode,"prmaxhidden");this._show_hide_details(this.lineschart);break;case "newclipping":_e.add(this.emailsbtn.domNode,"prmaxhidden");_e.add(this.outputbtn.domNode,"prmaxhidden");_e.add(this.selectallbtn.domNode,"prmaxhidden");this._add_btn_event();break;}},_options_btn_event:function(){_e.add(this.emailsbtn.domNode,"prmaxhidden");_e.add(this.outputbtn.domNode,"prmaxhidden");_e.add(this.selectallbtn.domNode,"prmaxhidden");this.controls.selectChild(this.options_view);this._active_page=null;},_dashboard_btn_event:function(){_e.add(this.emailsbtn.domNode,"prmaxhidden");_e.add(this.outputbtn.domNode,"prmaxhidden");_e.add(this.selectallbtn.domNode,"prmaxhidden");this.controls.selectChild(this.dashboard_view);this.dashboard_view.load(PRMAX.utils.settings.cid);this._active_page=null;},_dashboardsettings_btn_event:function(){_e.add(this.emailsbtn.domNode,"prmaxhidden");_e.add(this.outputbtn.domNode,"prmaxhidden");_e.add(this.selectallbtn.domNode,"prmaxhidden");this.controls.selectChild(this.dashboardsettings_view);this.dashboardsettings_view.load(PRMAX.utils.settings.cid,1);this._active_page=null;},_selectall_btn_event:function(){var _11=this.clippings_view.filter_view.get("filterlimited");_c.post("/clippings/select_deselect_all_user_selection",_a.make_params({data:_11})).then(this._selectall_call_back);},_selectall_call:function(_12){this.clippings_view.clippings_grid.set("query",this.clippings_view.filter_view.get("filterlimited"));}});});