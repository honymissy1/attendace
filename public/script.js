let overlay = document.querySelector('.overlay');
let side = document.querySelector('.side');
let bar = document.querySelector('.bar');
overlay.onclick = () =>{
  overlay.style.display = 'none';
  side.style.transform = 'translateX(-100%)'
}

bar.onclick = () =>{
  overlay.style.display = 'block';
  side.style.transform = 'translateX(0%)'
}