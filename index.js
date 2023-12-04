const api_key = "d97714969b344a77bc38bb1a56bfc659";
const main_url = "https://api.themoviedb.org/3/";
const search_url = "https://api.themoviedb.org/3/search/movie?api_key=d97714969b344a77bc38bb1a56bfc659&language=en-US&query=";
let iptText = document.getElementById('search');
let div = document.getElementById('items');
let lander = document.getElementById('lander');
let apidata = {};


function toggle() {
    var header = document.getElementById('header');
    header.classList.toggle('active')
}

function loadlander(event) {
    lander.style.display = "block";
    document.getElementById('blur').classList.toggle('show-blur');
    let status = lander.classList.toggle('show-lander');
    if (status) {
        let results = apidata[event.target.id];
        land_title.textContent = results["title"];
        land_reldate.textContent = results["release_date"];
        land_rate.textContent = results["vote_average"];
        land_pop.textContent = results["popularity"];
        land_desc.textContent = results["overview"];
        if (screen.width > 465) {
            land_img.setAttribute('src', "https://image.tmdb.org/t/p/w300" + results["poster_path"])
        } else {
            land_img.setAttribute('src', "https://image.tmdb.org/t/p/w300" + results['backdrop_path'])
        }
    }

}

function recommend() {
    removeDiv()
    tmdb_url = main_url + "trending/all/day?api_key=" + api_key;
    fetch(tmdb_url)
        .then(response => response.json())
        .then(data => {
            globalThis.pres_url = tmdb_url;
            makeElements(data, 0)
        })
    foot.style.opacity = 1;
}

function movies() {
    removeDiv()
    tmdb_url = main_url + "discover/movie?sort_by=popularity.desc&api_key=" + api_key;
    fetch(tmdb_url)
        .then(response => response.json())
        .then(data => {
            globalThis.pres_url = tmdb_url;
            makeElements(data, 1);
        })
}

function makeElements(data, initial) {
    globalThis.data = data;
    for (i in data.results) {
        if (data.results[i].poster_path == null) {
            delete data.results[i];
        }
    }
    data = data.results;
    for (let i = initial; i < data.length; i++) {
        let newDiv = document.createElement('div');
        let Img = document.createElement('img');
        Img.setAttribute('src', 'https://image.tmdb.org/t/p/w200' + data[i]["poster_path"])
        Img.setAttribute('id', data[i]["id"])
        Img.setAttribute('onclick', 'loadlander(event)');
        newDiv.append(Img)
        div.appendChild(newDiv)
        if (initial != 1) {
            apidata[data[i]["id"]] = data[i];
        } else {
            delete apidata;
        }

    }

}

function removeDiv() {
    while (true) {
        if (div.childElementCount !== 0) {
            for (let i = 0; i < div.childElementCount; i++) {
                div.children[0].remove()
            }
        } else {
            break
        }
    }
}

function formSearch(event) {
    event.preventDefault();
    search();
}

function search() {
    if (iptText.value != '') {
        removeDiv()
        tmdb_url = search_url + iptText.value;
        fetch(tmdb_url)
            .then(response => response.json())
            .then((data) => {
                globalThis.pres_url = tmdb_url;
                tag = data;
                if (data["total_results"] > 17) {
                    notFound.style.display = "none!important";
                    notFound.style.opacity = 0;
                    makeElements(data, 0)
                } else if (data["total_results"] < 18 && data["total_results"] > 0) {
                    notFound.style.display = "none";
                    notFound.style.opacity = 0;
                    makeElements(data, 0);
                } else {
                    notFound.style.display = "block";
                }
            })
        iptText.value = '';
    }
}

function loadMovie() {
    if (parseInt(data.total_pages) > parseInt(data.page)) {
        let load_items = pres_url + "&page=" + String(parseInt(data.page) + 1);
        fetch(load_items)
            .then(response => response.json())
            .then(data => {
                makeElements(data, data.page);
            })
        // console.log(load_items);
    }
}


home.addEventListener('click', recommend);
latest.addEventListener('click', recommend);
movie.addEventListener('click', movies);

recommend()

document.body.onscroll = () => {
    if (document.documentElement.scrollHeight - document.documentElement.scrollTop < 1000) {
        loadMovie()
    }
}