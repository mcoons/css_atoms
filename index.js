(() => {

    let _timeoutID, _dataLoaded, _jsonData;
    let _atomList = new Map();
    let _container = document.getElementById("container");
    let _tabActive = true;
    let randomRange = (min, max) => Math.floor(Math.random() * (max - min)) + min;

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // tab is now inactive
            // temporarily clear timer using clearInterval() / clearTimeout()
            _tabActive = false;
            clearTimeout(_timeoutID);
            _atomList.forEach( a => {
                a.style.animationPlayState = 'paused';

                // a.classList.remove("animation_playing");
                // a.classList.add("animation_paused");
            });
        } else {
            // tab is active again
            // restart timers
            _timeoutID = setTimeout(spawnAtom, 1500);
            _tabActive = true;
            _atomList.forEach( a => {
                a.style.animationPlayState = 'running';
                // a.classList.remove("animation_paused");
                // a.classList.add("animation_playing");
            });
        }
    });

    const onAnimationEnd = (event) => {
        event.target.remove();
        _atomList.delete(_atomList.keys().next().value);
    }
    
    var spawnAtom = () => {
        console.log('Atom spawning');

        let r = randomRange(0, _jsonData.length - 5);
        while (_atomList.has(r)) {
            r = randomRange(0, _jsonData.length - 5)
        }

        let color = "#1affff";
        if (_jsonData[r].hColor != "" && _jsonData[r].hColor.length === 6) {
            color = "#" + _jsonData[r].hColor;
        }

        let x_pos = (Math.random() * (document.body.clientWidth - 230)).toFixed() - document.body.clientWidth / 4;
        let y_pos = (Math.random() * (document.body.clientHeight - 200)).toFixed() - document.body.clientHeight / 50;

        let card = document.createElement('div');
            card.className = 'card';
            card.id = 'card' + r;
            card.style.color = color;
            card.style.borderColor = color;
            card.style.boxShadow = "0 0 30px 15px " + color + ", inset 0 0 20px 5px " + color; /* outer cyan */
            card.style.left = x_pos + 'px';
            card.style.top = y_pos + 'px';

            card.innerHTML = "<h1 class='aNumb'>&nbsp;&nbsp;" + _jsonData[r].atomicNumber + "</h1>";
            card.innerHTML += "<h1 class='aName'>" + _jsonData[r].name + "</h1>";
            card.innerHTML += "<h1 class='aSymb'>" + _jsonData[r].symbol + "</h1>";
            card.innerHTML += "<h1 class='aMass'>" + _jsonData[r].atomicMass + "</h1>";
            card.innerHTML += "<h1 class='aConf'>" + _jsonData[r].electronicConfiguration + "</h1>";

            card.addEventListener("animationend", onAnimationEnd, false);

        _container.appendChild(card);
        _atomList.set(r, card);

        if (_tabActive)
            _timeoutID = setTimeout(spawnAtom, 1500);
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            _jsonData = JSON.parse(this.responseText);
            _dataLoaded = true;
            if (_dataLoaded && !_timeoutID && _tabActive) {
                _timeoutID = setTimeout(spawnAtom, 1500);
            }
        }
    }

    xmlhttp.open("GET", "./atoms.json", true);
    xmlhttp.send();

})();