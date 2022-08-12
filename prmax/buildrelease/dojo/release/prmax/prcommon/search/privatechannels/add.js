/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.search.privatechannels.add"]){dojo._hasResource["prcommon.search.privatechannels.add"]=true;dojo.provide("prcommon.search.privatechannels.add");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.form.Button");dojo.require("dojo.data.ItemFileWriteStore");dojo.declare("prcommon.search.privatechannels.add",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<form data-dojo-attach-point=\"privatechannels_form\" data-dojo-type=\"dijit.form.Form\" data-dojo-props='\"onSubmit\":\"return false\", name:\"privatechannels_form\", style:\"margin:5px\"'>\r\n\t\t<table width=\"99%\" border=\"0\" cellpadding=\"0\" cellspacing=\"1\" >\r\n\t\t\t<tr><td>&nbsp</td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Description</td><td><input data-dojo-props='style:\"width:400px\", \"class\":\"prmaxrequired\", name:\"prmax_outlettypename\", type:\"text\", maxLength:45, trim:true, required:true, invalidMessage:\"Description field must be filled in\"' data-dojo-attach-point=\"prmax_outlettypename\" data-dojo-type=\"dijit.form.ValidationTextBox\"/></td></tr>\r\n\t\t\t<tr><td>&nbsp</td></tr>\r\n\t\t\t<tr><td align=\"left\"><button data-dojo-props='\"class\":\"prmaxbutton prmaxhidden\", label:\"Close\", type:\"button\"' data-dojo-attach-point=\"clearNode\" data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_Close\"></button></td>\r\n\t\t\t\t<td align=\"right\"><button data-dojo-props='\"class\":\"prmaxbutton\", type:\"button\", label:\"Add\"' data-dojo-attach-point=\"saveNode\" data-dojo-type=\"dijit.form.Button\" data-dojo-attach-event=\"onClick:_Add\"></button></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n",constructor:function(){this._AddedCallback=dojo.hitch(this,this._Added);this.inherited(arguments);},postCreate:function(){this.icustomerid=PRMAX.utils.settings.cid;this.inherited(arguments);},Load:function(_1){this._dialog=_1;this._Clear();},_Clear:function(){this.prmax_outlettypename.set("value","");this.saveNode.set("disabled",false);},_Added:function(_2){if(_2.success=="DU"){alert("Private Media Channel Already Exists");}else{if(_2.success=="OK"){dojo.publish("/prmax_outlettypes/add",[_2.data]);alert("Private Media Channel Added");this._dialog.hide();}else{if(_2.success=="FA"){alert(_2.message);}else{alert("Problem Adding Private Media Channel");}}}},_Add:function(){if(ttl.utilities.formValidator(this.privatechannels_form)==false){alert("Please Enter Details");return false;}var _3=this.privatechannels_form.get("value");_3["outletsearchtypeid"]=13;_3["prmax_outletgroupid"]="privatechannels";_3["customerid"]=this.icustomerid;dojo.xhrPost(ttl.utilities.makeParams({load:this._AddedCallback,url:"/prmax_outlettypes/add",content:_3}));},Clear:function(){this._Clear();},_Close:function(){this.dialog.hide();}});}