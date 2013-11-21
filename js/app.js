/* --------- Working Attempt ----------- */

function ItemCtrl($scope, $http) {


/*	
	$http({
		method: 'JSONP',
		url: 'http://api.remix.bestbuy.com/v1/products(salePrice<=1)?format=json&callback=JSON_CALLBACK&apiKey=5u9dhqrdn9nxme9yreb3y7rp'
	}).success(function(data, status, headers, config) {
		$scope.items = data.products;
	}).error(function(data, status, headers, config) {
		alert('Failure' + status);
	});
*/	

	// Create a JavaScript array of the item filters you want to use in your request
	var filterarray = [
	  {"name":"MaxPrice", 
	   "value":"1", 
	   "paramName":"Currency", 
	   "paramValue":"USD"},
	  {"name":"FreeShippingOnly", 
	   "value":"true", 
	   "paramName":"", 
	   "paramValue":""},
	  {"name":"ListingType", 
	   "value":["AuctionWithBIN", "FixedPrice", "StoreInventory"], 
	   "paramName":"", 
	   "paramValue":""},
	  ];


	// Define global variable for the URL filter
	var urlfilter = "";

	// Generates an indexed URL snippet from the array of item filters
	function  buildURLArray() {
	  // Iterate through each filter in the array
	  for(var i=0; i<filterarray.length; i++) {
	    //Index each item filter in filterarray
	    var itemfilter = filterarray[i];
	    // Iterate through each parameter in each item filter
	    for(var index in itemfilter) {
	      // Check to see if the paramter has a value (some don't)
	      if (itemfilter[index] !== "") {
	        if (itemfilter[index] instanceof Array) {
	          for(var r=0; r<itemfilter[index].length; r++) {
	          var value = itemfilter[index][r];
	          urlfilter += "&itemFilter\(" + i + "\)." + index + "\(" + r + "\)=" + value ;
	          }
	        } 
	        else {
	          urlfilter += "&itemFilter\(" + i + "\)." + index + "=" + itemfilter[index];
	        }
	      }
	    }
	  }
	}  // End buildURLArray() function

	// Execute the function to build the URL filter
	buildURLArray(filterarray);

	var init = function () {
	var url = "http://svcs.ebay.com/services/search/FindingService/v1";
	    url += "?OPERATION-NAME=findItemsAdvanced";
	    url += "&SERVICE-VERSION=1.0.0";
	    url += "&SECURITY-APPNAME=nishantm-9735-41a4-b488-c3d2b6525d11";
	    url += "&GLOBAL-ID=EBAY-US";
	    url += "&RESPONSE-DATA-FORMAT=JSON";
	    url += "&callback=JSON_CALLBACK";
	    url += "&REST-PAYLOAD";
		url += "&categoryId=88433";
	    url += "&paginationInput.entriesPerPage=10";
	    url += urlfilter;

		$http({
			method: "JSONP",
			url: url
		}).success(function(data, status, headers, config) {
			$scope.ebay = data.findItemsAdvancedResponse[0].searchResult[0].item;
		}).error(function(data, status, headers, config) {
			alert('Failure' + status);
		});
	}
	
	init();
	
		$scope.getKeyword = function () {


			var url = "http://svcs.ebay.com/services/search/FindingService/v1";
			    url += "?OPERATION-NAME=findItemsAdvanced";
			    url += "&SERVICE-VERSION=1.0.0";
			    url += "&SECURITY-APPNAME=nishantm-9735-41a4-b488-c3d2b6525d11";
			    url += "&GLOBAL-ID=EBAY-US";
			    url += "&RESPONSE-DATA-FORMAT=JSON";
			    url += "&callback=JSON_CALLBACK";
			    url += "&REST-PAYLOAD";
			    url += "&keywords=" + $scope.searchText;
			    url += "&paginationInput.entriesPerPage=10";
			    url += urlfilter;

				$http({
					method: "JSONP",
					url: url
				}).success(function(data, status, headers, config) {
					$scope.ebay = data.findItemsAdvancedResponse[0].searchResult[0].item;
				}).error(function(data, status, headers, config) {
					alert('Failure' + status);
				});
				
				$http({
					method: "JSONP",
					url: "http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=getSearchKeywordsRecommendation&SERVICE-VERSION=1.12.0&SECURITY-APPNAME=nishantm-9735-41a4-b488-c3d2b6525d11&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords="+$scope.searchText+"&callback=JSON_CALLBACK"
				}).success(function(data, status, headers, config) {
					$scope.keywords = data.getSearchKeywordsRecommendationResponse[0].keywords;
				}).error(function(data, status, headers, config) {
					alert('Failure' + status);
				});
				
	/*		    var aurl = "https://itunes.apple.com/search?";
			                aurl += "term=all";
			                aurl += "&country=us&limit=10";
			                $http({
			                    method: "JSONP",
			                    url: aurl
			                }).success(function(data, status, headers, config) {
			                    alert(JSON.stringify(data.results);
								$scope.apple;
			                }).error(function(data, status, headers, config) {
			                    alert('Failure' + status);
			                });     */
		}
		
		$scope.getSugKeyword = function (sug) {


			var url = "http://svcs.ebay.com/services/search/FindingService/v1";
			    url += "?OPERATION-NAME=findItemsAdvanced";
			    url += "&SERVICE-VERSION=1.0.0";
			    url += "&SECURITY-APPNAME=nishantm-9735-41a4-b488-c3d2b6525d11";
			    url += "&GLOBAL-ID=EBAY-US";
			    url += "&RESPONSE-DATA-FORMAT=JSON";
			    url += "&callback=JSON_CALLBACK";
			    url += "&REST-PAYLOAD";
			    url += "&keywords=" + sug;
			    url += "&paginationInput.entriesPerPage=10";
			    url += urlfilter;

				$http({
					method: "JSONP",
					url: url
				}).success(function(data, status, headers, config) {
					$scope.ebay = data.findItemsAdvancedResponse[0].searchResult[0].item;
				}).error(function(data, status, headers, config) {
					alert('Failure' + status);
				});
				
				$http({
					method: "JSONP",
					url: "http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=getSearchKeywordsRecommendation&SERVICE-VERSION=1.12.0&SECURITY-APPNAME=nishantm-9735-41a4-b488-c3d2b6525d11&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords="+$scope.searchText+"&callback=JSON_CALLBACK"
				}).success(function(data, status, headers, config) {
					$scope.keywords = data.getSearchKeywordsRecommendationResponse[0].keywords;
				}).error(function(data, status, headers, config) {
					alert('Failure' + status);
				});
		}
		
		$scope.getCategory = function (id) {


			var url = "http://svcs.ebay.com/services/search/FindingService/v1";
			    url += "?OPERATION-NAME=findItemsAdvanced";
			    url += "&SERVICE-VERSION=1.0.0";
			    url += "&SECURITY-APPNAME=nishantm-9735-41a4-b488-c3d2b6525d11";
			    url += "&GLOBAL-ID=EBAY-US";
			    url += "&RESPONSE-DATA-FORMAT=JSON";
			    url += "&callback=JSON_CALLBACK";
			    url += "&REST-PAYLOAD";
			    url += "&categoryId=" + id;
			    url += "&paginationInput.entriesPerPage=10";
			    url += urlfilter;

				$http({
					method: "JSONP",
					url: url
				}).success(function(data, status, headers, config) {
					$scope.ebay = data.findItemsAdvancedResponse[0].searchResult[0].item;
				}).error(function(data, status, headers, config) {
					alert('Failure' + status);
				});
		}
		
		$scope.hello = function () {
			alert($scope.searchText);
		}


}