
const navbarItems = document.querySelectorAll(".navbar-link");

navbarItems.forEach( nav => {
    nav.addEventListener('click', function(e) {
        if ( this.classList.contains("active") ) return !1;
        for ( let index = 0; index < navbarItems.length; index++ ) {
            navbarItems[ index ] !== this ? navbarItems[ index ].classList.remove("active") : navbarItems[ index ].classList.add("active");
        }
    })
})




const Init5u = {
    
    _createNode( tagName, options ) {
        const element = document.createElement( tagName );
        for ( let opt in options ) {
            opt == "setAttribute"
                ? element.setAttribute( options[opt][0], options[opt][1] )
                : element[opt] = options[opt];
        }
        return element
    },
    
    metadata: new Map(),
    
    root: listingContent5,
    option: selectContent5,
    btnadd: addDataContent5,
    
    init() {
        this.initialFunction();
        return fetch("https://mycomic.cyclic.app/api/ledger/listing")
            .then( res => res.json() )
            .then( listing => {
                this.metadata.set('revenue',listing.revenue);
                this.metadata.set('expense',listing.expenses);
                this.initialContent( this.metadata.get( this.option.value ) )
            });
    },
    
    resetContent() {
        this.root.innerHTML = "";
        this.initialContent( this.metadata.get( this.option.value ) )
    },
    
    initialFunction() {
        this.option.addEventListener("change",evt=>this.resetContent(evt));
        this.btnadd.addEventListener("click", evt => {
            Swal.fire({
                title: 'เพิ่มรายการ',
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'บันทึก',
                cancelButtonText: 'ยกเลิก',
                showLoaderOnConfirm: true,
                preConfirm: ( val ) => {
                    const metadata = this.metadata.get( this.option.value );
                    metadata.push( val );
                    this.resetContent()
                }
            })
        });
    },
    
    initialContent( value ) {
        value = typeof value === "string" ? [value] : value;
        for ( let index = 0; index < value.length; index++ ) {
            
            const iterface = this._createNode("div", {
                className: "d-flex justify-content-between align-items-center rounded bg-light shadow-sm ps-3 py-2 pe-2 my-2"
            });
            const spanx = this._createNode("span", {
                className: "h5 m-0",
                textContent: value[index]
            });
            const divs = this._createNode("div", {});
            iterface.appendChild( spanx );
            iterface.appendChild( divs );
            const btnedit = this._createNode("button", {
                className: "btn btn-sm",
                setAttribute: ["role","button"]
            })
            const iconedit = this._createNode("i", {
                className: "bi h5 m-0 bi-pencil-square"
            })
            btnedit.appendChild( iconedit )
            divs.appendChild( btnedit )
            const btnremove = this._createNode("button", {
                className: "btn btn-sm",
                setAttribute: ["role","button"]
            })
            const iconremove = this._createNode("i", {
                className: "bi h5 m-0 bi-x-lg",
                onclick: () => {
                    const arrs = this.metadata.get( this.option.value );
                    arrs.splice(index,1)
                    iterface.remove()
                }
            })
            btnremove.appendChild( iconremove )
            divs.appendChild( btnremove )
            this.root.appendChild( iterface )
        }
    }
    
}

Init5u.init()


