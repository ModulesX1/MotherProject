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
     * @param { String } tagName - The HTML tag name for the element.
     * @param { Object } options - Object with various options for element creation.
     * @param { String } [options.className] - Element class name.
     * @param { HTMLElement } [options.innerChild] - Append this element as a child to the created element.
     * @param { Object } [options.addEventListener] - Object with event listener configuration.
     * @param { String | [] } [options.addEventListener.event] - Event type(s) to listen to. Can be a space-separated string or an array of event types.
     * @param { Function } [options.addEventListener.handler] - Event handler function to be called when the event is triggered.
     * @param { {} } [options.attr] - Object with attributes to set on the element.
     * @param { String } [options.xmlns] - The XML namespace for the element, if applicable (optional).
     * @returns { HTMLElement } - The created HTML element.
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
        
        innerChild && innerChild.namespaceURI !== null && innerChild.tagName !== null && innerChild.appendChild( element );
        
        return element
        
    }
    
}

const svg = util._createNode("svg", {
    attr: {
        viewBox: "0 0 16 16",
        width: "28",
        height: "28",
        fill: "#000"
    },
    innerChild: document.body
})

util._createNode("path", {
    attr: {
        d: "M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"
    },
    innerChild: svg
})