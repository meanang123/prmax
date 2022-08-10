/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.pressrelease.briefreport"]){dojo._hasResource["prmax.pressrelease.briefreport"]=true;dojo.provide("prmax.pressrelease.briefreport");dojo.require("prmax.common.ReportBuilder");dojo.declare("prmax.pressrelease.briefreport",[ttl.BaseWidget],{templateString:"<div>\r\n\t<form data-dojo-type=\"dijit.form.Form\" data-dojo-props='onsubmit:\"return false\"' data-dojo-attach-point=\"form_node\">\r\n\t\t<input data-dojo-type=\"dijit.form.TextBox\" data-dojo-attach-point=\"listid\" data-dojo-props='name:\"listid\",type:\"hidden\"'>\r\n\t\t<input data-dojo-type=\"dijit.form.TextBox\" data-dojo-attach-point=\"reporttemplateid\" data-dojo-props='name:\"reporttemplateid\",type:\"hidden\", value:\"18\"'>\r\n\t\t<input data-dojo-type=\"dijit.form.TextBox\" data-dojo-attach-point=\"sortorder\" data-dojo-props='name:\"sortorder\",type:\"hidden\",value:\"1\"'>\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" >\r\n\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\">Report Type</td>\r\n\t\t\t<td><select data-dojo-type=\"dijit.form.FilteringSelect\" data-dojo-attach-point=\"reportoutputtypeid\" data-dojo-props='name:\"reportoutputtypeid\",value:\"0\"' data-dojo-attach-event=\"onChange:_set_reporttemplate\">\r\n\t\t\t\t<option value=\"0\" name=\"pdf\" >Pdf</option>\r\n\t\t\t\t<option value=\"2\" name=\"csv\">Csv</option>\r\n\t\t\t\t</select>\r\n\t\t\t</td></tr>\r\n\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t<tr><td class=\"prmaxrowtag\" data-dojo-attach-point=\"reporttitle_label\">Report Title</td><td><input data-dojo-type=\"dijit.form.TextBox\" data-dojo-attach-point=\"reporttitle\" data-dojo-props='name:\"reporttitle\",maxLength:45'></td></tr>\r\n\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t<tr><td colspan=\"2\"><div dojoAttachPoint=\"report_notshown\" class=\"prmaxhidden\">If you cannot see the report, please press <a  dojoAttachPoint=\"report_link\" href=\"\"  target=\"_blank\">here</a></div></td></tr>\t\t\t\t\r\n\t\t<tr><td colspan=\"2\"><div dojoAttachPoint=\"csv_notshown\" class=\"prmaxhidden\">If you cannot see the report, please press <a  dojoAttachPoint=\"csv_link\" href=\"\"  target=\"_blank\">here</a></div></td></tr>\t\t\t\t\r\n\t\t<tr><td colspan=\"2\" ><div data-dojo-type=\"prmax.common.ReportBuilder\" data-dojo-attach-point=\"report_ctrl\" data-dojo-props='style:\"display:none\"'></div></td></tr>\r\n\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t<tr>\r\n\t\t\t<td align=\"left\"><button data-dojo-type=\"dijit.form.Button\" data-dojo-props='\"class\":\"prmaxbutton\",label:\"Close\"' data-dojo-attach-point=\"close_btn\" data-dojo-attach-event=\"onClick:_cancel\"></button></td>\r\n\t\t\t<td align=\"right\"><button data-dojo-type=\"dojox.form.BusyButton\" data-dojo-props='\"class\":\"prmaxbutton\",busyLabel:\"Please Wait Generating Report...\",label:\"Generate\"' data-dojo-attach-point=\"report_btn\" data-dojo-attach-event=\"onClick:_report\"></button></td>\r\n\t\t</tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n\r\n",constructor:function(){this._complete_call_back=dojo.hitch(this,this._complete_call);},postCreate:function(){dojo.attr(this.reporttemplateid,"value","18");this.inherited(arguments);},load:function(_1,_2){this._dialog=_2;this.listid.set("value",_1);this._clear();},_cancel:function(){this._clear();this._dialog.hide();},_clear:function(){this.report_ctrl.hide();this.report_ctrl.Stop();this.report_btn.cancel();dojo.addClass(this.report_notshown,"prmaxhidden");dojo.addClass(this.csv_notshown,"prmaxhidden");this.reporttitle.set("value","");this.reportoutputtypeid.set("value",0);},_report:function(){this.report_ctrl.SetCompleted(this._complete_call_back);this.report_ctrl.StartNoDialog(this.form_node.get("value"));},_complete_call:function(){this.report_ctrl.Stop();this.report_btn.cancel();if(this.reportoutputtypeid==0){dojo.removeClass(this.report_notshown,"prmaxhidden");dojo.attr(this.report_link,"href","/reports/viewpdf?reportid="+this.report_ctrl.reportid.value);}else{if(this.reportoutputtypeid==2){dojo.removeClass(this.csv_notshown,"prmaxhidden");dojo.attr(this.csv_link,"href","/reports/viewcsv?reportid="+this.report_ctrl.reportid.value);}}this.report_ctrl.hide();},_set_reporttemplate:function(){dojo.addClass(this.report_notshown,"prmaxhidden");dojo.addClass(this.csv_notshown,"prmaxhidden");if(this.reportoutputtypeid==0){this.reporttemplateid.set("value","18");dojo.removeClass(this.reporttitle.domNode,"prmaxhidden");dojo.removeClass(this.reporttitle_label,"prmaxhidden");}else{if(this.reportoutputtypeid==2){this.reporttemplateid.set("value","30");dojo.addClass(this.reporttitle.domNode,"prmaxhidden");dojo.addClass(this.reporttitle_label,"prmaxhidden");}}}});}