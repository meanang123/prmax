/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.searchgrid.SearchGridCount"]){dojo._hasResource["prmax.searchgrid.SearchGridCount"]=true;dojo.provide("prmax.searchgrid.SearchGridCount");dojo.declare("prmax.searchgrid.SearchGridCount",[ttl.BaseWidget],{templateString:"<div class=\"prmaxsearchgridcount\" dojoAttachPoint=\"dataNode\"></div>",constructor:function(){this._data=new PRMAX.SearchGridCount();},Clear:function(){this._data.Clear();this._setMessage();},_setValueAttr:function(_1){this._data.Set(_1);this._setMessage();},_setMessage:function(){var _2="Total: "+this._data.total;if(this._data.appended>0){_2+="<br/>Appended: "+this._data.appended;}if(this._data.selected>0){_2+="<br/>Selected: "+this._data.selected;}this.dataNode.innerHTML=_2;}});}