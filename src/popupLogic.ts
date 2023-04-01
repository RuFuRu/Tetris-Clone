export default function popupLogic() {
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