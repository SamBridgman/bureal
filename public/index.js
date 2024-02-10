async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    console.log(data);
}
async function sendData(email) {

    window.location.href = "verify.html";
    let data = {"email": email}
    if(email.includes("@bu.edu")) {
        options = {
            method:"POST",
            headers:  {
                "Content-Type" : "application/json"
                },
            body: JSON.stringify(data)
        };
        const response = await fetch('/api',options);
        const json = await response.json();
        console.log(json);
    }
    else {
        console.log("not a BU email");
    }
}

async function checkCookies() 
{
    let key = localStorage.getItem('verify');

    let data = {"code": key}
    options = {
        method:"POST",
        headers:  {
            "Content-Type" : "application/json"
            },
        body: JSON.stringify(data)
    };
    const response = await fetch('/verify',options);
    const json = await response.json();
    console.log(json.status);
    if(json.status == 'failure') {

        window.location.href = "index.html";
    }
}

async function checkCode(code) {
    let data = {"code": code}
        options = {
            method:"POST",
            headers:  {
                "Content-Type" : "application/json"
                },
            body: JSON.stringify(data)
        };
        const response = await fetch('/verify',options);
        const json = await response.json();
        console.log(json.status);
        if(json.status == 'success') {

            window.location.href = "homepage.html";
            localStorage.setItem('verify',data.code);
        }
    }


async function getDBLength() 
{
    const response = await fetch('/getPosts');
    const data = await response.json();
    return(data.message.length);
}
    
async function sendPost(text) {

    const d = new Date()
    let mins;
    if(d.getMinutes() < 10) {
        mins = "0" + d.getMinutes();
    }
    else {
        mins = d.getMinutes();
    }
    dformat = [d.getMonth()+1,
        d.getDate(),
        d.getFullYear()].join('/')+' '+
       [d.getHours(),
        mins].join(':');
    let data = {"text": text,"Time" : dformat,"comments" : [],"Order":await getDBLength()}
    options = {
        method:"POST",
        headers:  {
            "Content-Type" : "application/json"
            },
        body: JSON.stringify(data)
    };
    const response = await fetch('/sendData',options);
    const json = await response.json();
    window.location.href = "homepage.html"
    console.log(json.status);
}
async function loadPosts(mincount,maxcount) {
    const response = await fetch('/getPosts');
    const data = await response.json();
    // <div class="comment-div d-flex align-items-center justify-content-center"><span id="numOfComments"></span><i class="fa-solid fa-comment"></i></div>
    for(let i = mincount; i < maxcount ; i++) 
    {   
        let ul = document.getElementById('posts');
        let li = document.createElement('li');

        let outerDiv = document.createElement('div');
        outerDiv.classList.add("outerDiv-home");
        let innerDiv = document.createElement('div');
        innerDiv.classList.add("innerDiv-home");
        
        let postsTexts = document.createElement('div');
        postsTexts.appendChild(document.createTextNode(data.message[i].text));
        if(i % 2 == 0) {
            li.classList.add("even");
        }
        postsTexts.classList.add("posts-text");



        let iObj = document.createElement('i');
        iObj.classList.add("fa-regular");
        iObj.classList.add("fa-comment");
        iObj.style = "color:gray; cursor: pointer;";

        iObj.setAttribute("id", data.message[i]._id)

        let span = document.createElement('span');
        span.style = "color:gray; margin-left:10px;";
        span.appendChild(document.createTextNode(data.message[i].comments.length));

        let commentDiv = document.createElement('div');
        commentDiv.classList.add("comment-div");
        commentDiv.classList.add("d-flex");
        commentDiv.classList.add("align-items-center");
        commentDiv.classList.add("justify-content-center");

        let text = "Posted " + data.message[i].Time;
        let timestamp = document.createElement('div');
        timestamp.appendChild(document.createTextNode(text));
        timestamp.classList.add("timestamp");
        timestamp.classList.add("d-flex");
        timestamp.classList.add("align-items-center");
        timestamp.classList.add("justify-content-left");

        commentDiv.appendChild(iObj);
        commentDiv.appendChild(span);
        li.onclick = function() {sessionStorage.setItem("commentID", iObj.getAttribute('id')); window.location.href = "comment.html";};
        outerDiv.appendChild(postsTexts);
        outerDiv.appendChild(commentDiv);
        innerDiv.appendChild(timestamp);

        li.appendChild(innerDiv);
        li.appendChild(outerDiv);

        ul.appendChild(li);
    }
    if(data.message.length == 0) {
        let nothingToShow = document.createElement('div');
        nothingToShow.appendChild(document.createTextNode('Nothing to Show...'));
        nothingToShow.classList.add("noPosts");
        nothingToShow.classList.add("d-flex");
        nothingToShow.classList.add("align-items-center");
        nothingToShow.classList.add("justify-content-center");
        let ul = document.getElementById('posts');
        ul.appendChild(nothingToShow);

    }
    console.log(data.message);
}