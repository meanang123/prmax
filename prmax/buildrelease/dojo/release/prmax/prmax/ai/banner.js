/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.ai.banner"]){dojo._hasResource["prmax.ai.banner"]=true;dojo.provide("prmax.ai.banner");dojo.require("prmax.ai.listsview");dojo.require("prmax.search.SearchCtrl");dojo.require("prmax.DlgCtrl2");dojo.require("prmax.display.CommonBanner");dojo.declare("prmax.ai.banner",[prmax.display.CommonBanner],{templateString:"<div class=\"stdbanner\">\r\n\t<div style=\"height:100%;width:9%;float:left;padding-left:2px;padding-top:2px;background-color:#dae4ed;\"><img height=\"40px\" width=\"100%\"  src=\"/static/images/banner_prmax_logo.gif\"></img></div>\r\n\t<div  class=\"dijitToolbarTop\" dojoType=\"dijit.Toolbar\" style=\"height:100%;width:62%;float:left;\">\r\n\t\t<div dojoType=\"dijit.form.Button\" iconClass=\"PrmaxBannerIcon PrmaxBannerSearch\" dojoAttachEvent=\"onClick:_ShowSearchStd\" showLabel=\"${showlabel}\">Search</div>\r\n\t\t<div dojoType=\"dijit.form.DropDownButton\" iconClass=\"PrmaxBannerIcon PrmaxBannerView\" showLabel=\"${showlabel}\">\r\n\t\t\t<div dojoType=\"dijit.Menu\">\r\n\t\t\t    <div dojoType=\"dijit.MenuItem\" label=\"Outlets\" dojoAttachEvent=\"onClick:_ShowResultList\" ></div>\r\n\t\t\t    <div dojoAttachPoint=\"advance_view\" class=\"prmaxhidden\" dojoType=\"dijit.MenuItem\" label=\"Features\" dojoAttachEvent=\"onClick:_ShowAdvanceResult\" ></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:ShowListsPage\" iconClass=\"PrmaxBannerIcon PrmaxBannerLists\"  showLabel=\"${showlabel}\">Lists</div>\r\n\t\t<div dojoType=\"dijit.form.Button\" dojoAttachEvent=\"onClick:_Help\" iconClass=\"PrmaxBannerIcon PrmaxBannerHelp\"  showLabel=\"${showlabel}\">Help</div>\r\n\t</div>\r\n\t<div style=\"height:100%;width:20%;float:right;background-color:#dae4ed;\">\r\n\t\t<table style=\"background-color:#dae4ed;\" width=\"100%\" height=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t<tr align=\"right\" valign=\"top\"><td class=\"message\"><span class=\"powered\">Powered by</span>&nbsp;<span class=\"prmax\">PRmax</span></td></tr>\r\n\t\t\t<tr align=\"right\" valign=\"bottom\"><td class=\"message\">${message}</td></tr>\r\n\t\t</table>\r\n\t</div>\r\n</div>\r\n"});}