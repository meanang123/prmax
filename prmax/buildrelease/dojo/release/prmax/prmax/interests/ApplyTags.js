/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.interests.ApplyTags"]){dojo._hasResource["prmax.interests.ApplyTags"]=true;dojo.provide("prmax.interests.ApplyTags");dojo.require("dijit._Templated");dojo.require("dijit._Widget");dojo.require("dijit._Container");dojo.declare("prmax.interests.ApplyTags",[dijit._Widget,dijit._Templated,dijit._Container],{selected:-1,widgetsInTemplate:true,templateString:"<div>\r\n<div dojoType=\"dijit.TitlePane\" title=\"Apply Tags\" open=\"true\" style=\"width:100%\" >\r\n\t<form class=\"prmaxdefault\" dojoAttachPoint=\"form\" onSubmit=\"return false;\" dojoType=\"dijit.form.Form\">\r\n\t\t<table width=\"100%\" class=\"prmaxtable\">\r\n\t\t<tr><td valign=\"top\" width=\"20%\" class=\"prmaxrowtag\">Apply To</td><td>\r\n\t\t\t<input class=\"prmaxlabeltag\" dojoAttachPoint=\"outletradio\" type=\"radio\" name=\"applyto\" dojotype=\"dijit.form.RadioButton\" value=\"0\" checked =\"checked\"/><label dojoAttachPoint=\"outletradiolabel\">Outlet</label><br/>\r\n\t\t\t<input class=\"prmaxlabeltag\" dojoAttachPoint=\"employeeradio\" type=\"radio\" name=\"applyto\" dojotype=\"dijit.form.RadioButton\" value=\"1\" /> <label dojoAttachPoint=\"employeeradiolabel\">Contact</label>\r\n\t\t</td></tr>\r\n\t<tr><td valign=\"top\" class=\"prmaxrowtag\">List Selection</td><td><div name=\"selected\" dojoAttachPoint=\"selectedNode\" dojoType=\"prmax.common.SelectOptions\"  ></td></tr>\r\n\t<tr><td colspan=\"2\"><div  dojoType=\"prcommon.interests.Interests\" restrict=\"0\" displaytitle=\"Tags:\" startopen=\"true\" dojoAttachPoint=\"interests\" size=\"6\" name=\"interests\" selectonly=\"true\" nofilter=\"true\" keytypeid=\"1\" interesttypeid=\"2\" ></div></td></tr>\r\n\t<tr>\r\n\t\t<td align=\"left\"><button class=\"prmaxbutton\" dojoAttachEvent=\"onClick:_Close\" dojoType=\"dijit.form.Button\"  label=\"Close\"></button></td>\r\n\t\t<td align=\"right\"><button class=\"prmaxbutton\" iconClass=\"dijitPrmaxIcon dijitPrmaxAdd\" dojoAttachEvent=\"onClick:_ApplyTagsButton\" dojoAttachPoint=\"saveNode\" dojoType=\"dojox.form.BusyButton\" busyLabel=\"Please Wait Adding Tags...\" label=\"Apply Tags\"></button></td>\r\n\t\t</tr>\r\n\t</table></form>\r\n</div>\r\n<div dojoAttachPoint=\"addpane\" dojoType=\"dijit.TitlePane\" title=\"Add Tag\" open=\"false\" style=\"width:100%\" >\r\n\t<div dojoType=\"prmax.interests.AddTags\" dojoAttachPoint=\"addtag\" style=\"width:100%\" ></div>\r\n</div>\r\n</div>\r\n",constructor:function(){this._SavedResultCall=dojo.hitch(this,this._SavedResult);},postCreate:function(){dojo.connect(this.form,"onSubmit",dojo.hitch(this,this._Submit));this.selectedNode.setOptions(this.selected);this.employeeradiolabel.setAttribute("for",this.employeeradio.id);this.outletradiolabel.setAttribute("for",this.outletradio.id);this.addtag.setAdded(dojo.hitch(this,this._AddedTags));dojo.connect(this.addpane,"toggle",dojo.hitch(this,this._OpenSave));},_OpenSave:function(){if(this.addpane.get("open")){this.addtag.focus();}},_ApplyTagsButton:function(){this.form.submit();},_AddedTags:function(_1){this.interests.addSelect(_1);},_Submit:function(){if(this.interests.get("count")==0){alert("No Tags Selected");this.saveNode.cancel();return;}dojo.xhrPost(ttl.utilities.makeParams({load:this._SavedResultCall,url:"/search/applytags",content:this.form.get("value")}));},_SavedResult:function(_2){this.saveNode.cancel();if(_2.success=="OK"){alert("Tags Added");dojo.publish(PRCOMMON.Events.Display_ReLoad,[]);dojo.publish(PRCOMMON.Events.Dialog_Close,["tags"]);}else{alert("Problem adding Tags");}},destroy:function(){this.inherited(arguments);},_Close:function(){dojo.publish(PRCOMMON.Events.Dialog_Close,["tags"]);}});}