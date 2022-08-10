/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.DlgCtrl2"]){dojo._hasResource["prmax.DlgCtrl2"]=true;dojo.provide("prmax.DlgCtrl2");dojo.declare("prmax.DlgCtrl2",null,{constructor:function(_1){this.style=_1;this._Create();},_Create:function(){var _2=document.createElement("div");document.body.appendChild(_2);this._dialog=new dijit.Dialog({title:"",style:this.style},_2);},set:function(_3,_4){if(_3=="content"){this._dialog.set("content",_4);}},show:function(_5){this._dialog.set("title",_5||"Missing Title");this._dialog.show();},hide:function(){this._dialog.hide();}});}