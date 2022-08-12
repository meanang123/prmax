/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.deperslijst.stdview"]){dojo._hasResource["prmax.deperslijst.stdview"]=true;dojo.provide("prmax.deperslijst.stdview");dojo.require("ttl.BaseWidget");dojo.require("prmax.display.StdViewCommon");dojo.require("prcommon.recovery.passwordrecoverydetails");dojo.declare("prmax.deperslijst.stdview",[dijit._Widget,dijit._Templated,dijit._Container,prmax.display.StdViewCommon],{widgetsInTemplate:true,private_data:true,templateString:"<div >\r\n\t<div data-dojo-attach-point=\"borderControl\" data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='key:\"std_view.search_list\",style:\"width:100%;height:100%\"'>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"center\",preload:true,href:\"/layout/std_view_outlet\"'></div>\r\n\t\t<div data-dojo-attach-point=\"views\" data-dojo-type=\"dijit.layout.StackContainer\" data-dojo-props='region:\"left\",splitter:true,style:\"width:50%\"'>\r\n\t\t\t<div data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\",title:\"outlet_view\"' data-dojo-attach-point=\"outlet_view\" >\r\n\t\t\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"top\",style:\"height:42px;width:100%;overflow:hidden\",\"class\":\"searchresults\"'>\r\n\t\t\t\t<div style=\"height:44px;width:100%;overflow:hidden;padding:0px;margin:0px\" class=\"searchresults\">\r\n\t\t\t\t\t<div style=\"height:100%;width:15%;float:left;padding:0px;margin:0px\" class=\"prmaxrowdisplaylarge\">Manage Results</div>\r\n\t\t\t\t\t\t<div data-dojo-type=\"dijit.Toolbar\" class=\"dijitToolbarTop\" style=\"float:left;height:100%;width:85%;padding:0px;margin:0px\" >\r\n\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.form.DropDownButton\" data-dojo-attach-point=\"markoptions\" data-dojo-props='disabled:\"disabled\",iconClass:\"PrmaxResultsIcon PrmaxResultsMark\",showLabel:false'>\r\n\t\t\t\t\t\t\t\t<span>Mark</span>\r\n\t\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.Menu\">\r\n\t\t\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Clear Marks\"' data-dojo-attach-point=\"clear\" ></div>\r\n\t\t\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Marks All\"' data-dojo-attach-point=\"markall\" ></div>\r\n\t\t\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Invert Marks\"' data-dojo-attach-point=\"invertmarks\" ></div>\r\n\t\t\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Clear Marks &amp; Mark Appended\"' data-dojo-attach-point=\"clearappend\" ></div>\r\n\t\t\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Mark Appended\"' data-dojo-attach-point=\"markappended\" ></div>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"save\" data-dojo-attach-event=\"onClick:_Save\" data-dojo-props='disabled:\"disabled\",iconClass:\"PrmaxResultsIcon PrmaxResultsSave\",showLabel:false'>Save</div>\r\n\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"output\" data-dojo-props='disabled:\"disabled\",iconClass:\"PrmaxResultsIcon PrmaxResultsOutput\",showLabel:false' data-dojo-attach-event=\"onClick:_OutputPrint\" data-dojo-attach-point=\"output_print\">Output</div>\r\n\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.form.Button\"  data-dojo-attach-point=\"delete_option\" data-dojo-attach-event=\"onClick:_Delete\" data-dojo-props='disabled:\"disabled\",iconClass:\"PrmaxResultsIcon PrmaxResultsRemove\",showLabel:false'>Delete</div>\r\n\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.form.Button\"  data-dojo-attach-point=\"clearall\" data-dojo-attach-event=\"onClick:_ClearAll\" data-dojo-props='disabled:\"disabled\",iconClass:\"PrmaxResultsIcon PrmaxResultsClear\",showLabel:false'>Clear</div>\r\n\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.form.DropDownButton\" data-dojo-attach-point=\"tools\" data-dojo-props='disabled:\"disabled\",iconClass:\"PrmaxResultsIcon PrmaxResultsTools\",showLabel:false'>\r\n\t\t\t\t\t\t\t\t<span>Tools</span>\r\n\t\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.Menu\">\r\n\t\t\t\t\t\t\t\t\t<div data-dojo-attach-point=\"tag_menu\" data-dojo-type=\"dijit.MenuItem\" data-dojo-props='\"class\":\"prmaxhidden\",label:\"Apply Tags\"' data-dojo-attach-event=\"onClick:_ApplyTags\"></div>\r\n\t\t\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Apply Roles\"' data-dojo-attach-event=\"onClick:_ApplyRoles\"></div>\r\n\t\t\t\t\t\t\t\t\t<div data-dojo-type=\"dijit.MenuItem\" data-dojo-props='label:\"Apply Marks\"' data-dojo-attach-event=\"onClick:_ApplyMarks\"></div>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<div data-dojo-props='style:\"float:right;padding:0px;margin:0px\"' data-dojo-attach-point=\"countinfo\" data-dojo-type=\"prmax.searchgrid.SearchGridCount\"></div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"center\"'>\r\n\t\t\t\t\t<div data-dojo-attach-point=\"searchgrid\" data-dojo-type=\"dojox.grid.DataGrid\" data-dojo-props='query:{ name:\"*\"},keepRows:1,rowsPerPage:100,style:\"width:100%;height:100%\",structure:PRMAX.search.layoutSearch2' ></div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\",title:\"advance_view\"' data-dojo-attach-point=\"advance_view\">\r\n\t\t\t\t\t<div data-dojo-type=\"prcommon.advance.stdview\" data-dojo-props='region:\"center\",advancefeatureslistid:\"${advancefeatureslistid}\"' data-dojo-attach-point=\"advance_ctrl\" ></div>\r\n\t\t\t\t</div>\r\n \t\t\t<div data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\",title:\"crm_view\"' data-dojo-attach-point=\"crm_view\"></div>\r\n\t\t\t<div data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\",title:\"list_view\"' data-dojo-attach-point=\"list_view\"></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"sort_dlg\" data-dojo-type=\"prmax.searchgrid.SortDisplay\"></div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Clear Existing Marks & Mark Group\"' data-dojo-attach-point=\"apply_marks_dlg\">\r\n\t\t<div data-dojo-attach-point=\"apply_marks\" data-dojo-type=\"prmax.searchgrid.ApplyMarks\"></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"set_passwordrecovery_dialog\" data-dojo-props='title:\"Set Password Recovery\",style:\"width:450px;height:250px\"'>\r\n\t\t<div data-dojo-type=\"prcommon.recovery.passwordrecoverydetails\" data-dojo-attach-point=\"set_passwordrecovery_ctrl\"></div>\r\n\t</div>\r\n</div>\r\n\r\n",postCreate:function(){if(PRMAX.utils.settings.force_passwordrecovery){var _1="set";if(PRMAX.utils.settings.passwordrecovery){_1="update";}this.set_passwordrecovery_dialog.show();this.set_passwordrecovery_ctrl.load(this.set_passwordrecovery_dialog,true,_1);}this.inherited(arguments);},resize:function(){this.borderControl.resize(arguments[0]);this.inherited(arguments);}});}