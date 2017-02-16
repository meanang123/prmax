//-----------------------------------------------------------------------------
// Name:    prcommon.data.QueryWriteStore
// Author:  Chris Hoy
// Purpose: allows data to be chnaged from a query
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prcommon.data.QueryWriteStore");

dojo.require("dojox.data.QueryReadStore");

dojo.declare("prcommon.data.QueryWriteStore", dojox.data.QueryReadStore,
{
	tableid:"",
	constructor: function(/* Object */ params)
	{
		console.log("QueryWriteStore constructor");
		params['clearOnClose'] = true;
		// THIS DOESN@T WORK NEED to CHNAGED
	  // var xhrHandler = xhrFunc({url:this.url, handleAs:"json-comment-optional", content:serverQuery, preventCache:true });
		// !!! IN QueryReadStore !!!!!!!

		params['urlPreventCache'] = true;
		dojo.mixin(this,params);
		this._features["dojo.data.api.Write"] = true;
		this._features['dojo.data.api.Notification'] = true;

		this._nocallback = ( params.nocallback == null )  ? false : params['nocallback'];
		if (params.oncallback != undefined)
			this.onCallBack  = params.oncallback;
		else
			this.onCallBack  = null;
	},
	_getIdentifierAttribute: function(){
		var identifierAttribute = this.getFeatures()['dojo.data.api.Identity'];
		// this._assert((identifierAttribute === Number) || (dojo.isString(identifierAttribute)));
		return identifierAttribute;
	},
	SetNoCallBackMode:function(mode)
	{
		this._nocallback = mode;
	},
    newItem: function(/* Object? */ keywordArgs, /*Object?*/ parentInfo){

		var newIdentity = keywordArgs[this._identifier];
		var newItem = {i:keywordArgs, r:this, n:this._items.length};
		this._items.push(newItem);
		console.log(newItem);
		var identity = newItem.i[this._identifier];
		this._itemsByIdentity[identity] = newItem.i;

		var pInfo = null;
		this.onNew(newItem, pInfo); // dojo.data.api.Notification call

		return newItem;

    },
    deleteItem: function(/* item */ item)
    {
		console.log("deleteItem");
		var identifierAttribute = this._identifier;
		console.log(item);
		console.log(item.i, identifierAttribute);
		var identity = item.i[identifierAttribute];
		delete this._itemsByIdentity[identity];

		for (var c = 0 ;  c < this._items.length; c++)
		{
			if ( this._items[c] == null ) continue;
			if ( this._items[c].i[identifierAttribute] == item.i[identifierAttribute] )
			{
				delete this._items[c];
				break;
			}
		}

		this.onDelete(item); // dojo.data.api.Notification call

        return true;
    },
	invertValue:function( attribute )
	{
		for (var c = 0 ;  c < this._items.length; c++)
		{
			var item = this._items[c];
			var oldValue = item.i[attribute];

			item.i[attribute] = !oldValue;
			this.onSet(item, attribute, !oldValue, !oldValue);
		}
	},
	clearValue:function( attribute, value )
	{
		for (var c = 0 ;  c < this._items.length; c++)
		{
			var item = this._items[c];
			var oldValue = item.i[attribute];

			item.i[attribute] = value;
			this.onSet(item, attribute,  value, value);
		}
	},
    setValue: function(    /* item */ item,
                        /* string */ attribute,
                        /* almost anything */ value,
						doupdate)
    {
		console.log("setting",attribute,item.i,item.i[attribute],value,this._nocallback);
		if (item.i[attribute] != value )
		{
			var oldValue = item.i[attribute];
			item.i[attribute] = value;
			if (this._nocallback==false)
			{
				var params = {
								attribute:attribute,
								value:value,
								key:item.i[this._identifier]	,
								tableid:this.tableid } ;

				// Now add context
				if ( this.oncallbackparams != null )
					params = dojo.mixin ( params, this.oncallbackparams() ) ;

				// make call
				dojo.xhrPost(
					ttl.utilities.makeParams({
						url:'/maintenance/updatefield',
						load:this.onCallBack,
						error: null,
						content: params }));
			}
		}
		if (doupdate==true )
			this.onSet(item, attribute, value,value);
        return true;
    },
    unsetAttribute: function(    /* item */ item,
                                /* string */ attribute)
    {
		console.log("unsetAttribute");
        return true;
    },
    save: function(/* object */ keywordArgs)
    {
		console.log("save", keywordArgs);
        return true;
    },
    revert: function()
    {
		console.log("revert", keywordArgs);
        return true;
    },
    isDirty: function(/* item? */ item)
    {
		console.log("isDirty", keywordArgs);
        return true;
    },
	onDelete: function(/* item */ deletedItem){
		// summary: See dojo.data.api.Notification.onDelete()

		// No need to do anything. This method is here just so that the
		// client code can connect observers to it.
	},
	onNew: function(/* item */ newItem, /*object?*/ parentInfo){
		// summary: See dojo.data.api.Notification.onNew()

		// No need to do anything. This method is here just so that the
		// client code can connect observers to it.
	},
	fetchItemByIdentity: function(/* Object */ keywordArgs){
		//	summary:
		//		See dojo.data.api.Identity.fetchItemByIdentity()

		// See if we have already loaded the item with that id
		// In case there hasn't been a fetch yet, _itemsByIdentity is null
		// and thus a fetch will be triggered below.
		if(this._itemsByIdentity){
			var item = this._itemsByIdentity[keywordArgs.identity];
			if(!(item === undefined)){
				if(keywordArgs.onItem){
					var scope =  keywordArgs.scope?keywordArgs.scope:dojo.global;
					keywordArgs.onItem.call(scope, {i:item, r:this});
				}
				return;
			}
			else
			{
				var identifierAttribute = this._identifier;
					for (var c = 0 ;  c < this._items.length; c++)
					{
						if ( this._items[c] == null ) continue;
						if ( this._items[c].i[identifierAttribute] == keywordArgs.identity )
						{
							if(keywordArgs.onItem)
							{
								var scope =  keywordArgs.scope?keywordArgs.scope:dojo.global;
								keywordArgs.onItem.call(scope, {i:this._items[c].i, r:this});
							}
							break;
						}
					}
				// at this point in not in the model so return null
			}
		}

		// Otherwise we need to go remote
		// Set up error handler
		var _errorHandler = function(errorData, requestObject){
			var scope =  keywordArgs.scope?keywordArgs.scope:dojo.global;
			if(keywordArgs.onError){
				keywordArgs.onError.call(scope, errorData);
			}
		};

		// Set up fetch handler
		var _fetchHandler = function(items, requestObject){
			var scope =  keywordArgs.scope?keywordArgs.scope:dojo.global;
			try{
				// There is supposed to be only one result
				var item = null;
				if(items && items.length == 1){
					item = items[0];
				}

				// If no item was found, item is still null and we'll
				// fire the onItem event with the null here
				if(keywordArgs.onItem){
					keywordArgs.onItem.call(scope, item,true);
				}
			}catch(error){
				if(keywordArgs.onError){
					keywordArgs.onError.call(scope, error);
				}
			}
		};

		// Construct query
		var request = {serverQuery:{id:keywordArgs.identity}};

		// Dispatch query
		this._fetchItems(request, _fetchHandler, _errorHandler);
	},
	hasRows:function()
	{
		var lcount = false ;
		for(var key in this._itemsByIdentity)
		{
			lcount = true ;
			break;
		}

		return lcount;
	}
});
