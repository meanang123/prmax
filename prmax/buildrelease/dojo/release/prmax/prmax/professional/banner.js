/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.professional.banner"]){dojo._hasResource["prmax.professional.banner"]=true;dojo.provide("prmax.professional.banner");dojo.require("prmax.search.SearchCtrl");dojo.require("prmax.DlgCtrl2");dojo.require("prmax.display.CommonBanner");dojo.require("prcommon.crm.tasks.viewer");dojo.require("prmax.customer.activity.viewer");dojo.require("prmax.pressrelease.distributiontemplate.viewer");dojo.require("prmax.prrequest.viewer");dojo.require("prcommon.clippings.questions.globalsetup");dojo.require("prcommon.search.privatechannels.viewer");dojo.declare("prmax.professional.banner",[prmax.display.CommonBanner],{templateString:"<div class=\"stdbanner background_color\" >\r\n\t<div style=\"height:84px;width:10%;float:left;padding:0px;margin:0px\" class=\"background_color\"><img height=\"70px\" width=\"160px\" src=\"/static/images/professional/banner_logo.png\"></img></div>\r\n\t<div data-dojo-type=\"dijit.Toolbar\" data-dojo-props='\"class\":\"dijitToolbarTop adapt_toolbar\",style:\"height:84px;width:62%;float:left;padding:0px;margin:0px;overflow:hidden\"'>\r\n\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_show_start_up\" data-dojo-props='showLabel:true'>\r\n\t\t\t<span><span class=\"main_menu_button\"><i class=\"fa fa-home fa-2x\"></i><p>Home</p></span></span>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_ShowSearchStd\" data-dojo-props='showLabel:true'>\r\n\t\t\t<span><span class=\"main_menu_button\"><i class=\"fa fa-search fa-2x\"></i><p>Search</p></span></span>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.DropDownButton\" data-dojo-props='showLabel:true'>\r\n\t\t\t<span><span class=\"main_menu_button\"><i class=\"fa fa-bar-chart fa-2x\"></i><p>Results</p></span></span>\r\n\t\t\t<div data-dojo-type=\"dijit.Menu\">\r\n\t\t\t    <div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Outlets\"' data-dojo-attach-event=\"onClick:_ShowResultList\" ></div>\r\n\t\t\t    <div data-dojo-attach-point=\"advance_view\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Features\"' data-dojo-attach-event=\"onClick:_ShowAdvanceResult\" ></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:ShowListsPage\" data-dojo-props='showLabel:true'>\r\n\t\t\t<span><span class=\"main_menu_button\"><i class=\"fa fa-list-ul fa-2x\"></i><p>Lists</p></span></span>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_show_crm_viewer\" data-dojo-props='showLabel:true,\"class\":\"prmaxhidden\"' data-dojo-attach-point=\"engbtn\">\r\n\t\t\t<span><span class=\"main_menu_button\"><i class=\"fa fa-user fa-2x\"></i><p>Engagements</p></span></span>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_show_tasks\" data-dojo-props='showLabel:true'>\r\n\t\t\t<span><span class=\"main_menu_button\"><i class=\"fa fa-tasks fa-2x\"></i><p>Tasks</p></span></span>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_show_issues\" data-dojo-props='showLabel:true'>\r\n\t\t\t<span><span class=\"main_menu_button\"><i class=\"fa fa-pencil fa-2x\"></i><p>Issues</p></span></span>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.DropDownButton\" data-dojo-props='showLabel:true' data-dojo-attach-point=\"distribution_menu\" >\r\n\t\t\t<span><span class=\"main_menu_button\"><i class=\"fa fa-share-square-o fa-2x\"></i><p>Distribute</p></span></span>\r\n\t\t\t<div data-dojo-type=\"dijit.Menu\">\r\n\t\t\t    <div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"New\"' data-dojo-attach-event=\"onClick:ShowNewPressRelease\" ></div>\r\n\t\t\t    <div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Drafts\"' data-dojo-attach-event=\"onClick:ShowExistingPressRelease\" ></div>\r\n\t\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Sent\"' data-dojo-attach-event=\"onClick:ShowSentDistributions\" ></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"clippings\" data-dojo-attach-event=\"onClick:_show_clippings\" data-dojo-props='showLabel:true,\"class\":\"prmaxhidden\",style:\"border:none\"'>\r\n\t\t\t<span><span class=\"main_menu_button\"><i class=\"fa fa-paperclip fa-2x\"></i><p>Monitoring</p></span></span>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.DropDownButton\" data-dojo-props='showLabel:true'>\r\n\t\t\t<span><span class=\"main_menu_button\"><i class=\"fa fa-lock fa-2x\"></i><p>Private</p></span></span>\r\n\t\t\t<div data-dojo-type=\"dijit.Menu\">\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_new_outlet\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"New Outlet\"' data-dojo-attach-event=\"onClick:_Outlet\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_new_freelance\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"New Freelance\"' data-dojo-attach-event=\"onClick:_Freelance\" ></div>\r\n\t\t\t\t<div data-dojo-type=\"dijit.MenuSeparator\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"tag_menu\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Tags\"' data-dojo-attach-event=\"onClick:_Tags\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_collateral\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Collateral\"' data-dojo-attach-event=\"onClick:_Collateral\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_exclusions\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Exclusions\"' data-dojo-attach-event=\"onClick:_ExclusionList\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"clients\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Clients\"' data-dojo-attach-event=\"onClick:_Clients\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"newsrooms\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Newsrooms\"' data-dojo-attach-event=\"onClick:_Newsrooms\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_issues\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Issues\"' data-dojo-attach-event=\"onClick:_issues\" data-dojo-attach-point=\"banner_issue_label\"></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_statements\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Statements\"' data-dojo-attach-event=\"onClick:_statements\"></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_questions\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Questions\"' data-dojo-attach-event=\"onClick:_question\"></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_global_analysis\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Global Analysis\"' data-dojo-attach-event=\"onClick:_global_analysis_questions\"></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_documents\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Documents\"' data-dojo-attach-event=\"onClick:_show_documents_view\" ></div>\r\n\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Release Templates\",\"class\":\"prmaxhidden\"' data-dojo-attach-event=\"onClick:_release_templates\" data-dojo-attach-point=\"distribution_template_menu\"></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_private_media_channels\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Private Media Channels\"' data-dojo-attach-event=\"onClick:_privatechannels\" data-dojo-attach-point=\"privatechannels\"></div>\r\n\t\t\t\t<div data-dojo-type=\"dijit.MenuSeparator\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_user_preferences\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"User Preferences\"' data-dojo-attach-event=\"onClick:_Preferences\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_account_details\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Account Details\"' data-dojo-attach-event=\"onClick:_Customers\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_activity_log\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Activity Log\"' data-dojo-attach-event=\"onClick:_Activity\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_user_admin\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",\"disabled\":\"disabled\",label:\"User Admin\"' data-dojo-attach-event=\"onClick:_UserAdmin\" data-dojo-attach-point=\"useradmin\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_financial\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",\"disabled\":\"disabled\",label:\"Financial\"' data-dojo-attach-event=\"onClick:_Financial\" data-dojo-attach-point=\"financial\" ></div>\r\n\t\t\t\t<div data-dojo-type=\"dijit.MenuSeparator\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"pm_prrequests\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"PRRequests\"' data-dojo-attach-event=\"onClick:_pprrequest\"></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"updatum_view\" data-dojo-attach-event=\"onClick:_Updatum\" data-dojo-props='\"class\":\"prmaxhidden\",iconClass:\"fa fa-eye fa-2x\",showLabel:false'></div>\r\n\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_Help\" data-dojo-props='showLabel:true'>\r\n\t\t\t<span><span class=\"main_menu_button\"><i class=\"fa fa-question fa-2x\"></i><p>Help</p></span></span>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"logout\" data-dojo-attach-event=\"onClick:_Logout\" data-dojo-props='showLabel:true,style:\"border:none\"'>\r\n\t\t\t<span><span class=\"main_menu_button\"><i class=\"fa fa-sign-out fa-2x\"></i><p>Logout</p></span></span>\r\n\t\t</div>\r\n\r\n\t</div>\r\n\t<!--\r\n\t<div style=\"height:100px;width:20%;float:right;padding:0px;margin:0px\" class=\"background_color\"><table class=\"background_color\" width=\"100%\" height=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tr align=\"right\" valign=\"bottom\"><td width=\"100%\" class=\"message\">${message}</td><td><a style=\"color:#E5007D\" data-dojo-attach-event=\"onclick:_Logout\">Logout</a></td></tr></table></div>\r\n\t-->\r\n\t<div data-dojo-type=\"prmax.pressrelease.newrelease\" data-dojo-attach-point=\"newrelease\"></div>\r\n\t<div data-dojo-type=\"prmax.pressrelease.selectrelease\" data-dojo-attach-point=\"selectrelease\"></div>\r\n</div>\r\n",_show_start_up:function(){this.loadLinks();var _1=this.mainpanel.getPage("std_start_view");if(this.page!==null){this.mainpanel.showPage(_1);}},show_coverage:function(){this._Updatum();},_show_tasks:function(){this.loadLinks();var _2={key:"tasks.html",href:"/layout/tasks",style:"width:100%;height:100%"};var _3=this.mainpanel.getPage("tasks.html");if(_3==null){_3=this.mainpanel.addPage(_2);ttl.utilities.resize(_3);}else{this.mainpanel.showPage(_3);}},_show_issues:function(){this.loadLinks();var _4={key:"issues.html",href:"/layout/issues",style:"width:100%;height:100%"};var _5=this.mainpanel.getPage("issues.html");if(_5==null){_5=this.mainpanel.addPage(_4);ttl.utilities.resize(_5);}else{this.mainpanel.showPage(_5);}},_show_clippings:function(){this.loadLinks();var _6={key:"clippings.html",href:"/clippings/open_clipping_view",style:"width:100%;height:100%;padding:0px;margin:0px;overflow:hidden;"};var _7=this.mainpanel.getPage("clippings.html");if(_7==null){_7=this.mainpanel.addPage(_6);ttl.utilities.resize(_7);}else{this.mainpanel.showPage(_7);}},});}