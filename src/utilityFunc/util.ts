import soundOn from '../src_assets/sound_on.svg';
import soundOff from '../src_assets/sound_off.svg';

namespace Util {
    
    export function colorRandomizer(): HTMLImageElement {
        const blockBlue = document.querySelector('#block_blue') as HTMLImageElement;
        const blockGreen = document.querySelector('#block_green') as HTMLImageElement;
        const blockOrange = document.querySelector('#block_orange') as HTMLImageElement;
        const blockPink = document.querySelector('#block_pink') as HTMLImageElement;
        const blockPurple = document.querySelector('#block_purple') as HTMLImageElement;
        const blockRed = document.querySelector('#block_red') as HTMLImageElement;
        const blockYellow = document.querySelector('#block_yellow') as HTMLImageElement;
    
    
    
        const colorArr = [
            blockBlue,
            blockGreen,
            blockOrange,
            blockPink,
            blockPurple,
            blockRed,
            blockYellow
        ]
        return colorArr[Math.floor(Math.random() * 7)];
    }

    export function playMainTheme() {
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

    export function popupLogic() {
        const overlay = document.querySelector('.overlay') as HTMLDivElement;
        const popup = document.querySelector('.popup') as HTMLDivElement;
        const popupBtn = document.querySelector('.close-popup-btn') as HTMLButtonElement;
    
        if(localStorage.getItem('consent') === 'yes') {
            removePopup();
            return;
        }
    
        function removePopup() {
            overlay.classList.remove('active');
            popup.setAttribute('style', 'display: none !important');  
        }
    
        popupBtn.addEventListener('click', () => {
            localStorage.setItem('consent', 'yes'); 
            removePopup();
        })
    }
}

export default Util;