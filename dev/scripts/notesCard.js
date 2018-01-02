import React from 'react';

//15) we are passing just a presentational component/stateless component
//exporting just a function that's passing some data/prop and it's just returning some HTML for us

//we're going to assume that the prop is going to be one of the objects that we get back
//so adding in a title and text and submitting, it'll be props that is an object that has both title and text

export default function(props){
    return(
        <div className="noteCard">
            <i className="fa fa-edit"></i>
            <i className="fa fa-times"></i>
{/* 16)  */}
            <h4>{props.note.title}</h4>
            <p>{props.note.text}</p>
        </div>
    )
}