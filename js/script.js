const seal = document.getElementById('seal');

if (seal) {
  seal.addEventListener('click', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#bf953f', '#fcf6ba', '#b38728', '#ffffff']
      });
    }

    setTimeout(() => {
      window.location.href = `lettera.html${id ? '?id=' + id : ''}`;
    }, 600);
  });
}