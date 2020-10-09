// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

//let currentEle;
let btnGrabSample = document.getElementById('btnGrabSample');
let btnGrabRating = document.getElementById('btnGrabRating');
let color;
chrome.storage.sync.get('color', function(data) {
  color = data.color;
  $(btnGrabSample).css('background-color', color).attr('value', color)
  $(btnGrabRating).css('background-color', color).attr('value', color)
});

/*
btnGrabSample.onclick = function(e) {
  let color = e.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {
			code: 
			// TODO: Grab all possible films from sample and receive message back from extension
			'document.body.style.cursor="crosshair";' + 
			'document.body.addEventListener("mouseover", function(e) { e.target.dataset.prevBorder = e.target.style.border; e.target.style.border = "4px solid ' + color + '" });' +
			'document.body.addEventListener("mouseout", function(e) { e.target.style.border = e.target.dataset.prevBorder || "" });' +
			'document.body.addEventListener("click", function(e) { chrome.runtime.sendMessage({type: "grabInfoSample", value: {domain: document.domain, html: e.target.outerHTML} }) });'
		});
  });
};*/

btnGrabRating.onclick = function(e) {
	$(btnGrabRating).data('selecting', !!!$(btnGrabRating).data('selecting'))
	alert($(btnGrabRating).data('selecting'))
	if (!!!$(btnGrabRating).data('selecting')) return;

  let color = e.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {
			code:  
			// TODO: Grab a single film and receive message back from extension
			'document.body.style.cursor="crosshair";' + 
			'document.body.addEventListener("mouseover", function(e) { e.target.dataset.prevBorder = e.target.style.border == "4px solid ' + color + '" ? e.target.style.border : ""; e.target.style.border = "4px solid ' + color + '"; });' +
			'document.body.addEventListener("mouseout", function(e) { if (e.target.dataset.prevBorder != "4px solid ' + color + '") e.target.style.border = e.target.dataset.prevBorder || "" });' +
			'document.body.addEventListener("click", function(e) {' + 
				'chrome.runtime.sendMessage({type: "grabInfoFilm", value: {domain: document.domain, html: e.target.outerHTML} });' + 
				//'chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { alert(e.target.outerHTML); return true; });' +
				//'chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { alert(JSON.stringify(request)); return true; });' +
				//'chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { e.target.title=request.data.Ratings[0].Value; return true; });' +
				'chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { e.target.title=request.data; return true; });' +
			'});'
			//'window.addEventListener("message", function(e) { alert(JSON.stringify(e)) });'
			//'window.addEventListener("message", function(e) {  });'
		});
  });
  
  /*
  chrome.storage.sync.get("sources", function (obj) {
	  //alert(JSON.stringify(obj))
	  if (obj.sources.some(function(e) { return e.id == 'IMDB' })) {
		  //alert('IMDB')
	  }
	  if (obj.sources.some(function(e) { return e.id == 'Rotten Tomatoes' })) {
		  //alert('Rotten Tomatoes')
	  }
  })
  */
};
