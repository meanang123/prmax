//>>built
require({cache:{"url:research/projects/templates/init.html":"<div>\r\n\t<form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"onSubmit\":\"return false\"'>\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\" border =\"0\" style=\"margin-left:10px\">\r\n\t\t\t<tr><td>&nbsp;</td></tr>\r\n\t\t\t<tr>\r\n\t\t\t\t<td><label>Project Status</label>\r\n\t\t\t\t<input align=\"left\" data-dojo-props='\"class\":\"prmaxdefault\",type:\"checkbox\",name:\"status_check\"' data-dojo-attach-point=\"status_check\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-event=\"onClick:_status_change\"/></td>\r\n\t\t\t\t<td><select data-dojo-props='\"class\":\"prmaxhidden\"' data-dojo-attach-point=\"researchprojectstatusid\" data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='name:\"researchprojectstatusid\",searchAttr:\"name\",labelType:\"html\",\"class\":\"prmaxrequired\"'/></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t\t<div style=\"height:320px;width:550px;float:left;padding-left:10px;padding-top:15px;margin:0px\" data-dojo-attach-point=\"researchers_node\">\r\n\t\t\t<div data-dojo-attach-point=\"owners\" data-dojo-props='style:\"width:550px\",name:\"owners\"' data-dojo-type=\"research/projects/researchers\"></div>\r\n\t\t</div>\r\n\t\t<div align=\"right\" padding-right=\"10px\"><button data-dojo-attach-event=\"onClick:_assign\" data-dojo-attach-point=\"assignbtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='iconClass:\"fa fa-list-alt fa-2x\",type:\"button\",busyLabel:\"Please Wait Assigning...\",label:\"Assign\",\"class\":\"btnright\"'></button></div>\r\n\t</form>\r\n\r\n</div>\r\n"}});define("research/projects/init",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../projects/templates/init.html","ttl/utilities2","dojo/topic","dojo/request","dojo/_base/lang","dojo/dom-style","dojo/dom-attr","dojo/dom-class","dojo/data/ItemFileReadStore","dojo/data/ItemFileWriteStore","ttl/store/JsonRest","dojo/store/Observable","research/projects/researchers"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e){return _1("research.projects.init",[_2],{templateString:_3,constructor:function(){this.researchprojectstatus=new _b({url:"/common/lookups?searchtype=researchprojectstatus&nofilter=1"});this._assign_call_back=_7.hitch(this,this._assign_call);this._researchprojectid=null;},postCreate:function(){this.researchprojectstatusid.set("store",PRCOMMON.utils.stores.Research_Project_Status());this.researchprojectstatusid.set("value",-1);this.inherited(arguments);},load:function(_f,_10){this._dialog=_f;this._researchprojectid=_10;this.assignbtn.cancel();},_assign:function(){if(_4.form_validator(this.form)==false){alert("Please Enter Details");this.assignbtn.cancel();return false;}var _11=this.form.get("value");_11["researchprojectstatusid"]=this.researchprojectstatusid.get("value");_11["researchprojectid"]=this._researchprojectid;_11["status_check"]=this.status_check.checked;this.assignbtn.makeBusy();_6.post("/research/admin/projects/projectitems_assign",_4.make_params({data:_11})).then(this._assign_call_back);},_assign_call:function(_12){if(_12.success=="OK"){alert("Assignments have been completed");this._dialog.hide();_5.publish("researchprojectitem/update_assignment");}else{alert("Problem assign project items to researchers");}this.assignbtn.cancel();},_status_change:function(){if(this.status_check.checked){_a.remove(this.researchprojectstatusid.domNode,"prmaxhidden");}else{_a.add(this.researchprojectstatusid.domNode,"prmaxhidden");}}});});