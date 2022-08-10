/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.levelcert.banner"]){dojo._hasResource["prmax.levelcert.banner"]=true;dojo.provide("prmax.levelcert.banner");dojo.require("prmax.search.SearchCtrl");dojo.require("prmax.DlgCtrl2");dojo.require("prmax.display.CommonBanner");dojo.declare("prmax.levelcert.banner",[prmax.display.CommonBanner],{templateString:"<div class=\"stdbanner\" style=\"background-color: #e62c1f;\">\r\n\t<div style=\"height:100%;width:10%;float:left;padding:0px;margin:0px\" class=\"background_color\"></div>\r\n\t<div data-dojo-type=\"dijit.Toolbar\" data-dojo-props='\"class\":\"adapt_toolbar dijitToolbarTop\",style:\"height:100%;width:62%;float:left;padding:0px;margin:0px\"'>\r\n\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_ShowSearchStd\" data-dojo-props='iconClass:\"PrmaxBannerIcon PrmaxBannerSearch\",showLabel:false,style:\"border:none\"'>Search</div>\r\n\t\t<div data-dojo-type=\"dijit.form.DropDownButton\" data-dojo-props='iconClass:\"PrmaxBannerIcon PrmaxBannerView\",showLabel:false,style:\"border:none\"'>\r\n\t\t\t<span>View Results</span>\r\n\t\t\t<div data-dojo-type=\"dijit.Menu\">\r\n\t\t\t    <div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Outlets\"' data-dojo-attach-event=\"onClick:_ShowResultList\" ></div>\r\n\t\t\t    <div data-dojo-attach-point=\"advance_view\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Features\"' data-dojo-attach-event=\"onClick:_ShowAdvanceResult\" ></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:ShowListsPage\" data-dojo-props='iconClass:\"PrmaxBannerIcon PrmaxBannerLists\",showLabel:false,style:\"border:none\"'>Lists</div>\r\n\t\t<div data-dojo-type=\"dijit.form.DropDownButton\" data-dojo-props='iconClass:\"PrmaxBannerIcon PrmaxBannerDistribute\",showLabel:false,style:\"border:none\"' data-dojo-attach-point=\"distribution_menu\" >\r\n\t\t\t<span>Distribute</span>\r\n\t\t\t<div data-dojo-type=\"dijit.Menu\">\r\n\t\t\t    <div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"New\"' data-dojo-attach-event=\"onClick:ShowNewPressRelease\" ></div>\r\n\t\t\t    <div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Drafts\"' data-dojo-attach-event=\"onClick:ShowExistingPressRelease\" ></div>\r\n\t\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Sent\"' data-dojo-attach-event=\"onClick:ShowSentDistributions\" ></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.DropDownButton\" data-dojo-props='iconClass:\"PrmaxBannerIcon PrmaxBannerPrivate\",showLabel:false,style:\"border:none\"'>\r\n\t\t\t<span>Private</span>\r\n\t\t\t<div data-dojo-type=\"dijit.Menu\">\r\n\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"New Outlet\"' data-dojo-attach-event=\"onClick:_Outlet\" ></div>\r\n\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"New Freelance\"' data-dojo-attach-event=\"onClick:_Freelance\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"tag_menu\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Tags\"' data-dojo-attach-event=\"onClick:_Tags\" ></div>\r\n\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Collateral\"' data-dojo-attach-event=\"onClick:_Collateral\" ></div>\r\n\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Exclusions\"' data-dojo-attach-event=\"onClick:_ExclusionList\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"clients\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Clients\"' data-dojo-attach-event=\"onClick:_Clients\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"newsrooms\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Newsrooms\"' data-dojo-attach-event=\"onClick:_Newsrooms\" ></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"project_menu\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Projects\"' data-dojo-attach-event=\"onClick:_Projects\" ></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.DropDownButton\" data-dojo-props='iconClass:\"PrmaxBannerIcon PrmaxBannerSettings\",showLabel:false,style:\"border:none\"'>\r\n\t\t    <span>Settings</span>\r\n\t\t    <div data-dojo-type=\"dijit.Menu\" >\r\n\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"User Preferences\"' data-dojo-attach-event=\"onClick:_Preferences\" ></div>\r\n\t\t        <div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Customer Details\"' data-dojo-attach-event=\"onClick:_Customers\" ></div>\r\n\t\t        <div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"disabled\":\"disabled\",label:\"User Admin\"' data-dojo-attach-event=\"onClick:_UserAdmin\" data-dojo-attach-point=\"useradmin\" ></div>\r\n\t\t        <div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"disabled\":\"disabled\",label:\"Financial\"' data-dojo-attach-event=\"onClick:_Financial\" data-dojo-attach-point=\"financial\" ></div>\r\n\t\t     </div>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"updatum_view\" data-dojo-attach-event=\"onClick:_Updatum\" data-dojo-props='\"class\":\"prmaxhidden\",iconClass:\"PrmaxBannerIcon PrmaxBannerMonitoring\",showLabel:false'></div>\r\n\r\n\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_Help\" data-dojo-props='iconClass:\"PrmaxBannerIcon PrmaxBannerHelp\",showLabel:false'></div>\r\n\t</div>\r\n\t<div style=\"height:100%;width:20%;float:left;padding:0px;margin:0px\" class=\"background_color\"><table class=\"background_color\" width=\"100%\" height=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tr align=\"right\" valign=\"bottom\"><td class=\"message\">${message}</td></tr></table></div>\r\n\t<div style=\"height:100%;width:8%;float:left;padding:0px;margin:0px\" class=\"background_color\">\r\n\t\t<div data-dojo-type=\"dijit.Toolbar\" data-dojo-props='style:\"float:right\",\"class\":\"dijitToolbarTop adapt_toolbar adept_logout_toolbar\"'>\r\n\t\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_Logout\" data-dojo-props='iconClass:\"PrmaxBannerIcon PrmaxBannerLogout\",\"class\":\"adept_logout_btn\",showLabel:false'>Logout</div>\r\n\t\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='href:\"/maintenance/global_data_store\",style:\"width:1px;height:1px\"'></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"prmax.pressrelease.newrelease\" data-dojo-attach-point=\"newrelease\"></div>\r\n\t<div data-dojo-type=\"prmax.pressrelease.selectrelease\" data-dojo-attach-point=\"selectrelease\"></div>\r\n</div>\r\n"});}