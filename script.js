    let hls;  // Variabile globale per fermare il flusso quando cambio radio
    let currentActiveButton = null; // Nuovo: traccia il bottone attivo

    function openSpotify() {
        window.open('https://open.spotify.com/playlist/3ny6PgpICGFdo9G89wR8M8?si=cd7aa0563b204de1', '_blank');
    }


    function playRadio(url, element) {
        const audio = document.getElementById("audio-player");

        // Rimuove evidenziazione dal bottone precedente
        if (currentActiveButton) {
            currentActiveButton.classList.remove('active');
        }
        // Aggiunge evidenziazione al nuovo bottone
        if (element) {
            element.classList.add('active');
            currentActiveButton = element;
        }

        // Stoppa la radio precedente se esiste
        if (hls) {
            hls.destroy();
            hls = null;
        }

        if (url.endsWith(".m3u8")) {
            if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                audio.play();
            });
            } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = url;
            audio.play();
            }
        } else {
            audio.src = url;
            audio.play();
            playButton.textContent = '⏸️ Pausa'; 
        }

    }

    // Custom Player
    const audio = document.getElementById('audio-player');
    audio.volume = 1.0; // Volume iniziale 100%
    const playButton = document.getElementById('play-button');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');

    /* Gestione click bottone */
    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    // Quando parte l'audio aggiorna bottone
    audio.addEventListener('play', () => {
        playButton.textContent = '⏸️ Pausa';
    });

    // Quando si mette in pausa aggiorna bottone
    audio.addEventListener('pause', () => {
        playButton.textContent = '▶️ Play';
    });

    // Aggiorna la progress bar 
    let fakeProgressInterval = null; // Variabile per l'animazione finta

    audio.addEventListener('timeupdate', () => {
        if (audio.duration > 0 && isFinite(audio.duration)) {
            // Streaming normale: aggiorna barra vera
            const percentage = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = percentage + '%';
            if (fakeProgressInterval) {
                clearInterval(fakeProgressInterval);
                fakeProgressInterval = null;
            }
        } else {
            // Streaming live: crea animazione finta
            if (!fakeProgressInterval) {
                let fakeProgress = 0;
                fakeProgressInterval = setInterval(() => {
                    fakeProgress += 1;
                    if (fakeProgress > 100) fakeProgress = 0;
                    progressBar.style.width = fakeProgress + '%';
                }, 300); // ogni 300ms avanza un po'
            }
        }
    });
    



