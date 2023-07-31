// @ts-check

const util = {
    
    NAMESPACES: {
        svg: {
            url: 'http://www.w3.org/2000/svg',
            list: ['svg','circle','rect','line','path','text','g','use']
        },
        math: {
            url: 'http://www.w3.org/1998/Math/MathML',
            list: ['math','mi','mo','mn','mfrac','msup','msqrt']
        },
        xmlns( tagName ) {
            return this.svg.list.includes( tagName.toLowerCase() ) ? this.svg.url : this.math.list.includes( tagName.toLowerCase() ) && this.math.url;
        }
    },
    
    /**
     * @param { String } tagName The HTML tag name for the element.
     * @param { Object } options
     * @param { String } options.className Element class name.
     * @param { HTMLElement } options.innerChild Append this to element.
     * @param { Object } options.addEventListener
     * @param { String | [] } options.addEventListener.event
     * @param { Function } options.addEventListener.handler
     * @param { {} } options.attr
     * @returns { HTMLElement }
     **/
    _createNode( tagName, options ) {
        
        options = options || {};
        
        const namespace = this.NAMESPACES;
        const xmlns = typeof options.xmlns === "string" && options.xmlns || namespace.xmlns( tagName );
        
        const element = xmlns
            ? document.createElementNS( xmlns, tagName )
            : document.createElement( tagName );
        
        const { attr, innerChild, addEventListener, ...pointers } = options;
        
        if ( typeof attr === "object" ) {
            
            for ( let prop in attr ) {
                element.setAttribute( prop, attr[ prop ] )
            }
            
        }
        
        if ( typeof pointers === "object" ) {
            
            for ( let prop in pointers ) {
                element[ prop ] = pointers[ prop ]
            }
            
        }
        
        if ( typeof addEventListener === "object" ) {
            
            const event = typeof addEventListener.event === "string"
                ? addEventListener.event.split(' ')
                : Array.isArray( addEventListener.event ) && addEventListener.event;
            
            typeof addEventListener.handler === "function" && event && event.forEach( evt => {
                element.addEventListener( evt, function(e) {
                    addEventListener.handler.call( this, e )
                })
            })
            
        }
        
        innerChild instanceof HTMLElement && innerChild.appendChild( element );
        
        return element
        
    }
    
}

util._createNode("div", {
    className: "mx-0",
    style: "height:100dvh",
    innerChild: document.body,
    addEventListener: {
        event: "click",
        handler: (e) => { console.log(e.type) }
    },
    attr: {
        "ccid": 1
    }
})

