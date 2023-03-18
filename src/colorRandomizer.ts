function colorRandomizer(): HTMLImageElement {
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

    /*
    const colorArr = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
    let randomColor: string[] = [];
    for(let i = 0; i < 6; i++) {
        randomColor.push(colorArr[Math.floor(Math.random() * 17)]);
    }
    return `#${randomColor.join("")}`;
    */
}

export default colorRandomizer;