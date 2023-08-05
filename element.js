// @ts-check

const webpage = {
    
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
     * @param { Object } [options.listener] - Object with event listener configuration.
     * @param { String | [] } [options.listener.event] - Event type(s) to listen to. Can be a space-separated string or an array of event types.
     * @param { Function } [options.listener.handler] - Event handler function to be called when the event is triggered.
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
        
        const { attr, innerChild, listener, ...pointers } = options;
        
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
        
        if ( typeof listener === "object" ) {
            
            const event = typeof listener.event === "string"
                ? listener.event.split(' ')
                : Array.isArray( listener.event ) && listener.event;
            
            typeof listener.handler === "function" && event && event.forEach( evt => {
                element.addEventListener( evt, function(e) {
                    listener.handler.call( this, e )
                })
            })
            
        }
        
        innerChild && innerChild.namespaceURI !== null && innerChild.tagName !== null && innerChild.appendChild( element );
        
        return element
        
    },
    
    /**
     * Splits an array into multiple subarrays with a specified count of elements.
     * @param { [] } array - The input array to be split into subarrays.
     * @param { Number } count - The number of elements in each subarray (optional, defaults to 12 if not provided or invalid).
     * @returns { [] } An array of subarrays, each containing 'count' number of elements (except the last one).
     **/
    _createListItems( array, count ) {
        
        count = typeof count === 'number' && ( count > 0 ) ? count : 12;
        const result = new Array( Math.ceil( array.length / count ) );
        
        let index = 0;
        for ( let i = 0; i < result.length; i++ ) {
            result[i] = array.slice( index, index + count );
            index += count
        }
        
        return result
        
    },
    
    /**
     * Create object
     * @param { {} } defaults - Object default.
     * @param { String } name - Name of object.
     **/
    _createObject( defaults, name ) {
        const object = new Object;
        typeof name === "string" && Object.defineProperty( object.constructor, 'name', { value:name } );
        typeof defaults === "object" && Object.assign( object, defaults );
        return object
    },
    
    /**
     * Add event listener(s) to an element.
     * @param { String | Element } element - The element or its query selector to attach the event listener(s) to.
     * @param { String | String[] } events - The event name(s) as a string or an array of event names.
     * @param { Function } handler - The function to be executed when the event(s) occur.
     * @param { Boolean } [useCapture=false] - Optional. Specifies if the event should be captured or not.
     **/
    _addHandler( element, events, handler, useCapture = false ) {
        
        element = typeof element === "string"
            ? document.querySelector( element )
            : typeof element === "object" && element.namespaceURI && element;
        events = typeof events === "string"
            ? events.split(" ")
            : Array.isArray( events ) && events;
        events = events && [...new Set(events)];
        
        for ( let i = 0; i < events.length; i++ ) {
            element.addEventListener( events[i], handler, useCapture )
        }
        
        return this._createObject( { events, handler, useCapture }, 'Events' );
        
    }
    
}


fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(json => {
          const list = webpage._createListItems( json, 20 );
          let pre = webpage._createNode("pre", {
              innerChild: document.body,
              style: "width:100%;white-space:pre-wrap"
          })
          console.log(webpage._addHandler( pre, "click touchstart", e => {
              console.log( e.type )
          }))
          for ( let prop of list ) {
              pre.append( JSON.stringify( prop, null, 4 ) + "\n\n\n" )
          }
      })


