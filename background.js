// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';



chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
			//hostEquals: 'developer.chrome.com'
			urlMatches: '.+'
		},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.extension.onMessage.addListener(function (request) {
	if (request.type == 'grabInfoSample') {
		chrome.storage.sync.get('infoSamples', function(obj) {
			var samples = obj.infoSamples || []
			var sample = samples.find(function(s) { return s.domain == request.value.domain })
			if (sample) {
				sample.html = request.value.html
			}
			else {
				samples.push({
					domain: request.value.domain,
					html: request.value.html
				})
			}
			alert('Samples:' + JSON.stringify(samples))
			chrome.storage.sync.set({infoSamples: samples}, function() {
			})
		})
	}
	if (request.type == 'grabInfoFilm') {
		chrome.storage.sync.get('infoFilms', function(obj) {
			var films = obj.infoFilms || []
			var film = films.find(function(s) { return s.domain == request.value.domain })
			if (film) {
				film.html = request.value.html
			}
			else {
				film = {
					domain: request.value.domain,
					html: request.value.html
				}
				films.push(film)
			}

			// TODO: Push message to the current selected element with rating
			

			chrome.storage.sync.get("token", function (obj) {
				var title = $(request.value.html).text();
				searchOMDB(obj.token.value, title, function(data, status) {
					chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
						chrome.storage.sync.get("sources", function (obj) {
							let msg = (obj.sources || sources).map((src, i) => `${src.id}: ${data.Ratings[i].Value}`).join(';');
							chrome.tabs.sendMessage(tabs[0].id, {data: msg}, function(response) {
							});
						})
					});
				})
			})

			//alert('Film:' + JSON.stringify(films))
			chrome.storage.sync.set({infoFilms: films}, function() {
			})
		})
	}
});
