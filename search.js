// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const sources = [
	{id: 'IMDB'},
	{id: 'Rotten Tomatoes'}
];

function searchOMDB(key, title, callback) {

	//document.body.appendChild(document.createElement('script')).src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js';

	$.get(`http://www.omdbapi.com/?apikey=${key}&t=${title.replace(/ /g, '+')}`, callback);
}
