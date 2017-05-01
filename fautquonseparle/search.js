/*
  Adapted from: http://jekyll.tips/jekyll-casts/jekyll-search-using-lunr-js/
*/

function displaySearchResults(results, csvdata) {
    var searchResults = document.getElementById('search-results');

    var question_labels = {
        7: "Comment se remettre en marche?",
        8: "Comment permettre à tout le monde de réaliser son plein potentiel?",
        13: "Comment enclencher la transition?",
        4: "Comment reprendre le pouvoir?",
        5: "Comment développer le Québec selon nos priorités?",
        12: "Comment prendre soin de tout le monde?",
        9: "Comment construire la solidarité entre nous?",
        11: "Comment favoriser une création artistique vivante et en assurer l’accès à tous?",
        10: "Comment vivre ensemble sans racisme ni discrimination?",
        6: "Comment dynamiser toutes nos communautés?",
        14: "On a oublié quelque chose?",
        15: "(Question manquante)",
        17: "(Question manquante)",
        16: "(Question manquante)"
    };

    if (results.length) { // Are there any results?
      var appendString = '';

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = csvdata[results[i].ref];
        appendString += '<li><div class="qlabel">' + question_labels[item.q_id] + '<span class="aid">#' + item.id + '</span></div>' + item.text + '</li>';
      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<li>Aucun résultat, vérifiez votre requête.</li>';
    }
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
}

$(document).ready(function() {
    var searchTerm = getQueryVariable('query');

    if (searchTerm) {
        $.ajax({
            type: "GET",
            url: "fautquonseparle.txt",
            dataType: "text",
            success: function(data) {
                csvdata = loadCsv(data);

                idx = lunr(function () {
                    this.use(lunr.fr);
                    // then, the normal lunr index initialization
                    this.ref('id')
                    this.field('text');

                    for (var key in csvdata) {
                        this.add(csvdata[key])
                    }
                });

                document.getElementById('search-box').setAttribute("placeholder", "");
                document.getElementById('search-box').setAttribute("value", searchTerm);

                var results = idx.search(searchTerm); // Get lunr to perform a search
                displaySearchResults(results, csvdata); // We'll write this in the next section
            }
        });
    }
});