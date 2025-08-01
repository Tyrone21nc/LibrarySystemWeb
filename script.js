async function loadFile() {
    try {
        const res = await fetch("proj2_books.txt");
        const data = await res.text();

        let library = [];
        let value = "";
        let counter = 0;
        let vs = [];

        for (let i = 0; i < data.length; i++) {
            if(data[i] !== "|" && data[i] !== "\n"){
                value += data[i];
            }
            else{
                if (counter === 4){
                    library.push({
                        "year": vs[0],
                        "title": vs[1],
                        "author": vs[2],
                        "rating": vs[3],
                    });
                    counter = 0;
                    vs = [];
                }
                vs.push(value);
                counter++;
                value = "";
            }
        }
        // this is the display type variable that I later use in the display function
        let displayType = document.getElementById("display-type");

        let searchIcon = document.getElementsByClassName("search1")[0];
        let searchIconField = document.getElementById("search-field");
        let searchTypeFieldIcon = document.getElementsByClassName("search2")[0];
        let searchTypeField = document.getElementById("search-type-field");

        // display all books (no restriction)
        let booksDisplayButton = document.querySelector("#display-books");
        let dispChecker = false;
        booksDisplayButton.addEventListener("click", function(){
            if(dispChecker){
                cleanPage();
                dispChecker = false;
                booksDisplayButton.textContent = "Display Books";
                let b = document.getElementById("display-books");
                b.style.backgroundColor = "rgba(244, 230, 120, 1)";
                b.style.color = "black";
                clearSearchBars(searchIconField, searchTypeField, displayType);
            }
            else{
                displayBooks(library, "none");
                booksDisplayButton.textContent = "Clear Books";
                let b = document.getElementById("display-books");
                b.style.backgroundColor = "rgba(243, 181, 148, 1)";
                b.style.color = "black";
                dispChecker = true;
                clearSearchBars(searchIconField, searchTypeField, displayType);
            }
        });
        // search by all the 4 criterias
        searchIcon.onclick = function(){
            console.log("Clicked icon1 again");
            searchTypeFieldIcon.onclick = function(){
                const type = searchTypeField.value.toLowerCase();
                let tempArr = [];
                // -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*checking by title-*-*-*-*-*-*-*-*-*-*-*-*
                if(type == "title"){
                    const v = searchIconField.value.toLowerCase().replace(/[^a-z]/g, "");
                    tempArr = searchByTitle(library, v);
                    console.log("WE HAVE A TITLE: ", v);
                    if(tempArr.length == 0){
                        console.log("No objects with that signature found");
                        noBooksFound();
                        // displayType = "";
                    }
                    else{
                        console.log("search type: ", tempArr);
                        displayBooks(tempArr, "title");
                    }
                }
                // -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*checking by author-*-*-*-*-*-*-*-*-*-*-*-*
                else if(type == "author"){
                    const v = searchIconField.value.toLowerCase().replace(/[^a-z]/g, "");
                    console.log("WE HAVE AN AUTHOR: ", v);
                    tempArr = searchByAuthor(library, v);
                    // console.log("The author name types: ", searchIconField.value.toLowerCase.replace(/[^a-z]/g, ""));
                    if(tempArr.length == 0){
                        console.log("No objects with that signature found");
                        noBooksFound();
                        displayType = "";
                    }
                    else{
                        console.log("search type: ", tempArr);
                        displayBooks(tempArr, "author");
                    }
                }
                // -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*checking by year-*-*-*-*-*-*-*-*-*-*-*-*
                else if(type == "year"){
                    const v = searchIconField.value;
                    tempArr = searchByYear(library, v);
                    if(tempArr.length == 0){
                        console.log("No objects with that signature found");
                        noBooksFound();
                        displayType = "";
                    }
                    else{
                        console.log("search type: ", tempArr);
                        displayBooks(tempArr, "year");
                    }
                }
                // -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*checking by rating-*-*-*-*-*-*-*-*-*-*-*-*
                else if(type == "rating"){
                    tempArr = searchByRating(library, searchIconField.value);
                    if(tempArr.length == 0){
                        console.log("No objects with that signature found");
                        noBooksFound();
                        displayType = "";
                    }
                    else{
                        console.log("search type: ", tempArr);
                        displayBooks(tempArr, "none");
                    }
                }
            };
        };
        // more function can be called here


    } catch (err) {
        console.error("Error loading file: ", err);
    }
}


// $_____$_____$_____$_____$_____$_____$All other functions can be created beyond this point_____$_____$_____$_____$_____$_____$_____$_____$_____$
function displayBooks(books, searchTypeField) {
    // console.log("Value of tempArr in display books function");
    // console.log(books);
    const booksDiv = document.querySelector(".books");
    let bookHTML = "";
    let year, title, author, rating, ratingColorClass, val;
    let currentSearch1 = "none";
    let currentSearch2 = "none";
    let currentSearch3 = "none";
    if(searchTypeField.toLowerCase() == "title"){ 
        currentSearch1 = "current";
        currentSearch2 = "none";
        currentSearch3 = "none";
    }
    else if(searchTypeField.toLowerCase() == "author"){
        currentSearch1 = "none";
        currentSearch2 = "current";
        currentSearch3 = "none";
    }
    else if(searchTypeField.toLowerCase() == "year"){
        currentSearch1 = "none";
        currentSearch2 = "none";
        currentSearch3 = "current";
    }
    let v = "";
    if(currentSearch1 == "current"){ v="title"; }
    else if(currentSearch2 == "current"){ v="author"; }
    else if(currentSearch3 == "current"){ v="year"; }
    let displayType = document.getElementById("display-type");
    if(searchTypeField.toLowerCase() != "none"){
        let ans = `<h1 class="type">Searching by <strong class="current">${v}</strong></h1>`;
        displayType.innerHTML = ans;
    }
    for (let i=0; i<books.length; i++) {
    // for (let i=0; i<10; i++) {
        year = books[i].year;
        title = books[i].title;
        author = books[i].author;
        rating = books[i].rating;
        val = parseFloat(rating);
        if(val <= 5 && val >=4){
            ratingColorClass = "green";
        }
        else if(val < 4 && val >= 3){
            ratingColorClass = "yellow";
        }
        else if(val < 3 && val >= 2){
            ratingColorClass = "orange";
        }
        else{
            ratingColorClass = "red";
        }
        
        bookHTML += `
            <div class="book-container">
                <h1>${i+1}</h1>
                <div id="book">
                    <div id="tags">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">
                        <hr id="tag">

                    </div>
                    <div id="tags2">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div>
                        <p id="title"><strong class="${currentSearch1}">${title}</strong></p>
                        <p id="author">By<strong class="${currentSearch2}"> ${author}</strong></p>
                        <p id="year">Published on <strong class="${currentSearch3}">${year}</strong></p>
                        <p id="rating">Rating of <strong class="${ratingColorClass}"> ${rating} </strong> (/5)</p>
                    </div>
                </div>
            </div>
        `;
    }
    booksDiv.innerHTML = bookHTML;



}

function cleanPage(){
    const booksDiv = document.querySelector(".books");
    booksDiv.innerHTML = "";
}
function noBooksFound(){
    const booksDiv = document.querySelector(".books");
    booksDiv.innerHTML = `
        <h1>NO BOOKS FOUND</h1>
    `;
}
function searchByTitle(book, titleValue){
    let subArray = [];
    for(let i=0; i<book.length; i++){
        let val = book[i].title.toLowerCase().replace(/[^a-z]/g, "");
        if(val.includes(titleValue)){
            subArray.push(book[i]);
        }
    }
    return subArray;
}
function searchByAuthor(book, authorValue){
    console.log("Searching by author", authorValue);
    let subArray = [];
    for(let i=0; i<book.length; i++){
        let val = book[i].author.toLowerCase().replace(/[^a-z]/g, "");
        if(val.includes(authorValue)){
            subArray.push(book[i]);
        }
    }
    return subArray;
}
function searchByYear(book, yearValue){
    // for the year since it's difficult to determine as the criteria, I am currently split between:
    // 1 - either displaying year values that are more than our yearValue (inclusive) or lower that yearValue (inclusive)
    // 2 - displaying values 10 years before that year and 10 years after, including the year itself, we find it
    // I am choosing the 2nd b/c it seems more relevant and less risky
    yearValue = parseFloat(yearValue);
    const minRange = parseFloat(yearValue) - 10, maxRange = parseFloat(yearValue) + 10; //  we also include the year itself
    let subArray = [];
    for(let i=0; i<book.length; i++){
        let val = parseFloat(book[i].year);
        if((val === yearValue) || (val >= minRange && val <= maxRange)){
            subArray.push(book[i]);
        }
    }
    return subArray;
}
function searchByRating(book, ratingValue){
    // for the rating, I am including ratings that are at least the ratingValue, but nothing lower
    // nothing lower because if it's a lower rating, why do we care about it
    // **Realization** - when I tried this method, I noticed there was no books with rating at 2 or lower, which didn't narrow the search
    // I will now implement method 2 from searchByYear(...), having a min-range: ratingValue-.2 and max-range: ratingValue+.2

    ratingValue = parseFloat(ratingValue);
    const minRange = parseFloat(ratingValue) - .2, maxRange = parseFloat(ratingValue) + .2; //  we also include the rating itself
    let subArray = [];
    for(let i=0; i<book.length; i++){
        let val = parseFloat(book[i].rating);
        if((val === ratingValue) || (val >= minRange && val <= maxRange)){
            subArray.push(book[i]);
        }
    }
    return subArray;
}
function clearSearchBars(searchField1, searchField2, dispType){
    searchField1.value = "";
    searchField2.value = "";
    dispType.innerHTML = "";
}



loadFile(); // we have to call load file


