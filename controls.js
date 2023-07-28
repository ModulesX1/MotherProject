
const navbarItems = document.querySelectorAll(".navbar-link");

navbarItems.forEach( nav => {
    nav.addEventListener('click', function(e) {
        if ( this.classList.contains("active") ) return !1;
        for ( let index = 0; index < navbarItems; index++ ) {
            navbarItems[ index ] !== this ? navbarItems[ index ].classList.remove("active") : this.classList.add("active");
        }
    })
})
