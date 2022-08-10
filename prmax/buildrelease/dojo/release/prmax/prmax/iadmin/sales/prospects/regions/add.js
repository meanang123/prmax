/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.iadmin.sales.prospects.regions.add"]){dojo._hasResource["prmax.iadmin.sales.prospects.regions.add"]=true;dojo.provide("prmax.iadmin.sales.prospects.regions.add");dojo.require("ttl.BaseWidget");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.Button");dojo.require("dojox.form.BusyButton");dojo.declare("prmax.iadmin.sales.prospects.regions.add",[ttl.BaseWidget],{url:"/iadmin/prospects/regions/add_regions",mode:"add",templateString:dojo.cache("prmax","iadmin/sales/prospects/regions/templates/add.html","<div>\r\n\t<form data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit.form.Form\">\r\n\t\t<input data-dojo-props='type:\"hidden\",name:\"prospectregionid\"' data-dojo-attach-point=\"prospectregionid\" data-dojo-type=\"dijit.form.TextBox\" >\r\n\t\t<table width=\"400px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Region Name</td><td><input data-dojo-props='type:\"text\",name:\"prospectregionname\",required:true' data-dojo-attach-point=\"prospectregionname\" data-dojo-type=\"dijit.form.ValidationTextBox\" ></td></tr>\r\n\t\t\t<tr>\r\n\t\t\t\t<td class=\"prmaxrowlabel\"><button data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"closebtn\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_close\">Close</button></td>\r\n\t\t\t\t<td class=\"prmaxrowlabel\" align=\"right\"><button data-dojo-type=\"dojox.form.BusyButton\" data-dojo-attach-point=\"addbtn\" data-dojo-props='busyLabel:\"Saving ...\",type:\"button\"' data-dojo-attach-event=\"onClick:_update\">Save</button></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n"),constructor:function(){this._dialog=null;this._save_call_back=dojo.hitch(this,this._save_call);this.prospectcompanyid=null;},_close:function(){if(this._dialog){this._dialog.hide();}},_save_call:function(_1){if(_1.success=="OK"){dojo.publish("/prospect/regions/add",[_1.data]);if(this.mode=="add"){alert("Region Added");}else{alert("Region Updated");}this._close();this.clear();}else{if(_1.success=="DU"){alert("Already Exists");}else{alert("Problem with saving Region");}}this.addbtn.cancel();},_update:function(){if(ttl.utilities.formValidator(this.form)==false){alert("Please Enter Details");this.addbtn.cancel();return false;}dojo.xhrPost(ttl.utilities.makeParams({load:this._save_call_back,url:this.url,content:this.form.get("value")}));},load:function(_2){this._dialog=_2;this.clear();},clear:function(){this.addbtn.cancel();this.prospectregionid.set("value","-1");this.prospectregionname.set("value","");}});}