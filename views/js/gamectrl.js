// let myBlock;
// let keyArray=[];


// document.addEventListener('DOMContentLoaded', ()=> {
//   createBlock()
// })


// const createBlock=()=> {
//   myBlock=document.createElement("div")
//   myBlock.innerHTML="Hello World"
//   myBlock.classList.add("block")
//   document.body.appendChild(myBlock)
// }

// document.addEventListener('keydown', (e) => {
//   const keyName = e.key;
//   if (keyName == 'ArrowRight' || keyName == 'ArrowLeft' || keyName == 'ArrowUp' || keyName == 'ArrowDown' ) {
//     buildKey(keyName)
//     keyArray.push(keyName)
//   } else if (keyName=='Enter') {
//     moveBlock()
//   } else if (keyName=="c") {
//     myBlock.style.backgroundColor=changeColor()
//   }
// })

// const buildKey=(key)=> {
//   let arrow=key.slice(5)
//   let arrowDiv=document.createElement("div")
//   arrowDiv.setAttribute("class", "keys")
//   arrowDiv.innerHTML=`+${arrow}`
//   document.body.appendChild(arrowDiv)
//   arrowDiv.addEventListener('click', (e)=> {
//     e.target.remove()
//   })
// }

// const changeColor=()=> {
//   return `#${Math.random().toString(16).substr(-6)}`
// }

// const animateBlock = (key)=> {
//      x = myBlock.offsetLeft;
//     y = myBlock.offsetTop;

//     if (key === 'ArrowRight') {
//       myBlock.style.left = `${x + 50}px`
//     } else if (key === 'ArrowLeft') {
//       myBlock.style.left = `${x - 50}px`
//     } else if (key === 'ArrowDown') {
//       myBlock.style.top = `${y + 50}px`
//     } else if (key === 'ArrowUp') {
//       myBlock.style.top = `${y - 50}px`
//     }
// }


// const moveBlock = () => {
//   let x, y;
 
//   keyArray.forEach((key, i) => {
//      setTimeout(() => {
//        animateBlock(key);
//        console.log(i);
//      }, i * 1000);
//   })
// }

