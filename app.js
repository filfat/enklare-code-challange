/* 

    I've assumed that you have access to a EMCAScript 6 browser
    This is because I'm not allowed to use a transpiler according to the spec

*/
'use strict';

// getArticles (query)
//  query: string, the search query
let getArticles = (query) => {
    $('.search-loader').show();

    // Remove all but the first item
    $('.results article:not(:first)').remove();

    // This should probably be a helper function instead
    // handles max results
    let max_res = parseInt($('.result-options .options .selected').text().replace(/\D/g,''));

    $.getJSON("http://codetest.enklare.se/api/search?q=" + query, (res) => {
        let reg = new RegExp('/(' + query + ')/gi', 'g');
        for (let n = 0; n < res.length && n < max_res; n++)
            $('main .results').append(`
                <article id="article-${res[n].id}">
                    <div class="title">${res[n].title.replace(new RegExp('(' + query + ')', 'gi'), '<span class="search-string">$1</span>')}</div>
                    <div class="description">${res[n].content.replace(new RegExp('(' + query + ')', 'gi'), '<span class="search-string">$1</span>')}</div>
                </article>
            `);

        $('.search-title .n-hits').text(res.length.toString());
        $('.search-title .search-string').text(query);
        $('.results').show();
        $('.search-loader').hide();
    });
}

$(document).ready(() => {
    // This should probably have a class name, but since we only have one input this is fine for now
    $('input').on('keyup', (e) => {
        if(e.which === 13)
            getArticles($(e.target).val());
        
        // Only auto-search if the text length is > 2 and provided we didn't press backspace
        else if (e.which !== 8 && $(e.target).val().length > 2) {
            getArticles($(e.target).val());
        }
    });

    // Handle max results change
    $('.result-options .options').on('click tap', (e) => {
        $('.result-options .selected').removeClass('selected');
        $(e.target).addClass('selected');

        getArticles($('input').val());
    })
});