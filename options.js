// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let page = document.getElementById('buttonDiv')
const kButtonColors = [
	{id: 'green', color: '#3aa757'},
	{id: 'red', color: '#e8453c'},
	{id: 'yellow', color: '#f9bb2d'},
	{id: 'blue', color: '#4688f1'}
];

(function constructOptions() {
	 
	 chrome.storage.sync.get("color", function (obj) {
	   for (let item of kButtonColors) {
		let button = document.createElement('button');
		button.style.backgroundColor = item.color;
		button.addEventListener('click', function() {
		  chrome.storage.sync.set({color: item.color}, function() {
			$(button).css('border', '4px solid black')
			.siblings('button').css('border', '')
		  })
		});
		if (item.color == obj.color) {
			button.style.border = '4px solid black'
		}
		page.appendChild(button);
	  }
	 });
})();

const sources = [
	{id: 'IMDB'},
	{id: 'Rotten Tomatoes'}
];
(function initSources() {
	chrome.storage.sync.get("sources", function (obj) {
		obj.sources = obj.sources || sources
		let ul = document.createElement('ul')
		for (let source of sources) {
			let li = document.createElement('li')
			li.style.listStyleType = 'none'
			let chk = document.createElement('input')
			chk.type = 'checkbox'
			$(chk).prop('checked', obj.sources.some(src => src.id == source.id))
			chk.addEventListener('click', function(e) {
				if ($(this).is(':checked')) {
					obj.sources.push(source)
				}
				else {
					obj.sources = obj.sources.filter(function(e){ return e.id != source.id })
				}
				chrome.storage.sync.set({sources: obj.sources}, function() {
				})
			})
			li.appendChild(chk)
			let lbl = document.createElement('label')
			lbl.innerText = source.id
			li.appendChild(lbl)
			ul.appendChild(li)
		}
		document.getElementById('sources').appendChild(ul)
	});
})();

(function initToken() {
	chrome.storage.sync.get("token", function (obj) {
		obj.token = obj.token || {
			value: '',
			type: 'OMDB'
		}
		let token = document.createElement('input')
		token.type = 'textbox'
		$(token).attr('value', obj.token.value)
		token.addEventListener('change', (e) => {
			setTimeout(function() {
				chrome.storage.sync.set({token: { value: $(e.target).val(), type: 'OMDB' }}, function() {
				})
			}, 1000)
		})
		let tokenContainer = document.getElementById('token')
		tokenContainer.appendChild(token)
		let $test = $('<button type="button">Test</button>').css('width', 'auto')
		$test.on('click', (e) => {
			// TODO: OMDB API
			let key = obj.token.value
			if (obj.token.type == 'OMDB') {
				searchOMDB(key, "Ocean's Eleven", function(data, status) {
					alert("Data: " + data + "\nStatus: " + status)
				})
			}
		})
		$(tokenContainer).append('<label>(' + obj.token.type + ')</label>')
			.append($test)
		
	})
})();
