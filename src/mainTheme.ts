import soundOn from '/assets/sound_on.svg';
import soundOff from '/assets/sound_off.svg';

function playMainTheme() {
    let clicked = 0;
    const soundBtn = document.querySelector('.sound') as HTMLButtonElement;
    const soundImg = document.querySelector('#sound') as HTMLImageElement;
    const audio = new Audio('https://upload.wikimedia.org/wikipedia/commons/e/e8/Korobeiniki.ogg');
    soundBtn.addEventListener('click', () => {
        if(clicked % 2 === 0) {
            clicked++;
            soundImg.src = `${soundOn}`;
            audio.loop = true;
            audio.play();
        } else {
            clicked++;
            soundImg.src = `${soundOff}`;
            audio.pause();
        }
    })
}

export default playMainTheme;