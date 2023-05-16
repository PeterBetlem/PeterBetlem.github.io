export function generateBibliography () {
    var chosenLibraryItems = "https://api.zotero.org/users/2084519/publications/items?format=csljson&limit=5&itemType=journalArticle&sort=date";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chosenLibraryItems, false);
    xhr.send(null);
    var citationData = JSON.parse(xhr.responseText);
    const Cite = require('citation-js')
    var citationData = citationData.items
    var papers = new Cite()

    papers.set(citationData)

    $('#publications-list').html(papers.format('bibliography', { format: 'html', template: 'geology', nosort: true }))

    var chosenLibraryItems = "https://api.zotero.org/users/2084519/publications/items?format=csljson&limit=5&itemType=conferencePaper&sort=date";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chosenLibraryItems, false);
    xhr.send(null);
    var citationData = JSON.parse(xhr.responseText);
    var data = citationData.items
    var conferences = new Cite()

    conferences.set(data)

    $('#conferences-list').html(conferences.format('bibliography', { format: 'html', template: 'geology', nosort: true }))

    var chosenLibraryItems = "https://api.zotero.org/users/2084519/publications/items?format=csljson&limit=5&itemType=webpage&websiteType=JupyterBook/Sphinx&sort=date";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chosenLibraryItems, false);
    xhr.send(null);
    var citationData = JSON.parse(xhr.responseText);
    console.log(citationData)
    var data = citationData.items
    var education = new Cite()

    education.set(data)
    console.log(education)

    $('#education-list').html(education.format('bibliography', { format: 'html', template: 'geology', nosort: true }))

    var chosenLibraryItems = "https://api.zotero.org/users/2084519/publications/items?format=csljson&limit=5&itemType=blogpost&sort=date";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chosenLibraryItems, false);
    xhr.send(null);
    var citationData = JSON.parse(xhr.responseText);
    console.log(citationData)
    var data = citationData.items
    var popscience = new Cite()

    popscience.set(data)
    console.log(popscience)

    $('#popscience-list').html(popscience.format('bibliography', { format: 'html', template: 'geology', nosort: true }))
}