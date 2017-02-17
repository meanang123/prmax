define([], function(){

// module:
//		dojo/store/util/QueryResults

var TtlQueryResults = function(results){
	// summary:
	//		A function that wraps the results of a store query with additional
	//		methods.
	// description:
	//		QueryResults is a basic wrapper that allows for array-like iteration
	//		over any kind of returned data from a query.  While the simplest store
	//		will return a plain array of data, other stores may return deferreds or
	//		promises; this wrapper makes sure that *all* results can be treated
	//		the same.
	//
	//		Additional methods include `forEach`, `filter` and `map`.
	// results: Array|dojo/promise/Promise
	//		The result set as an array, or a promise for an array.
	// returns:
	//		An array-like object that can be used for iterating over.
	// example:
	//		Query a store and iterate over the results.
	//
	//	|	store.query({ prime: true }).forEach(function(item){
	//	|		//	do something
	//	|	});

	return results;
};

return TtlQueryResults;

});
