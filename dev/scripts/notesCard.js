import React from 'react';

//15) we are passing just a presentational component/stateless component
//exporting just a function that's passing some data/prop and it's just returning some HTML for us

//we're going to assume that the prop is going to be one of the objects that we get back
//so adding in a title and text and submitting, it'll be props that is an object that has both title and text

//30) what we want to have is the ability to tell it's in an editing state so we can change the h4 and p tags so they're inputs
//when we hit save it'll go ahead and save it for us
//change this to export default class NoteCard
// export default function (props){
//we need to give this a state
export default class NoteCard extends React.Component{
    constructor(){
        super();
        this.state = {
            //31) we'll have something called editing that's a boolean that's either true or false and a note
            //when the component is rendered, we're going to take the props that is the notes and put it on here
            // we need to update the states for when the inputs change
            editing: false,
            note: {}
        };
        this.save = this.save.bind(this);
    }

    //32) on our componentDidMount we want to set the state to be whatever we pass into it. it will be that prop that we sent into it
    //41) turns out we don't need this.. anywhere it says this.state.note we'll put props there this.props.note
    //every time the note gets updated itll get refreshed from firebase and passed down as props so we should be interacting with them as props


    // componentDidMount(){
    //     this.setState({
    //         note: this.props.note
    //     })
    // }

    //38) 
    save(e){
        e.preventDefault();
        //38.1) when we console.log and click done editing we get all of the information back from our NoteCard
        //38.2)we want to be able to take the new information and set that as the state but actually update that information inside of firebase
        //38.3)we set refs in our form inputs in editingTemp
        console.log(this);
        // 40) we want to update our component 
        // this ref has to reference the states key
        const dbRef = firebase.database().ref(this.props.note.key);

        //use dbRef.update-- updating where that lives-- updating the title and the text
        dbRef.update({
            title: this.noteTitle.value,
            text: this.noteText.value
        })

        //then set the state to editing false and we're no longer editing and don't see the template anymore
        this.setState({
            editing: false
        })
    }

    render(){
        //35) by default intially our HTML is the HTML below. we're going to move it into ths variable. if it's not editing it's going to be our template here which is the unedited version
        let editingTemp = (
            <div>
                <h4>{this.props.note.title}</h4>
                <p>{this.props.note.text}</p>
            </div>
        )
        //36) now we add an if statement for if it's true. we are going to add a form
        if(this.state.editing){
            editingTemp = (
                // 37) setting up our form onSubmit-- we want to call some form of method called save(e)
                <form onSubmit={this.save}>
                    <div>
                        {/* 36) giving it a defaultValue so that it has something in it */}
                        {/* 39) adding ref. now when we console.log it'll add the noteTitle AND our text below */}
                        <input type="text" defaultValue={this.props.note.title} name="title" ref={ref => this.noteTitle = ref}/>
                    </div>
                    <div>
                        {/* 39.5) adding ref*/}
                        <input type="text" defaultValue={this.props.note.text} name="text" ref={ref => this.noteText = ref} />
                    </div>
                    {/* 36) need a submit button */}
                    <input type="submit" value="Done editing!"/>
                </form>
            )
        }
        return(
            <div className="noteCard">
            {/* 34) when we click on the edit we need to say that we are changing the state from being editing false to editing true 
            - adding an onClick and setting the state of editing to true
            - on editing true we want to have the html below change*/}
                <i className="fa fa-edit" onClick={() => this.setState({editing: true})}></i>
                {/* 28) setting up the removeNote prop here - onClick we are removing the object props that has the title and text 
                - our note prop has all of our data inside of it including the title, text and the key so we are going further into the data by referrning props.note.key
                - now when we try to delete the note, our console log returns just the key*/}
                <i className="fa fa-times" onClick={() => this.props.removeNote(this.props.note.key)}></i>
    {/* 16)  */}
                {/* <h4>{props.note.title}</h4> */}
                {/* 32) the above changes to this */}
                {/* <h4>{this.state.note.title}</h4> */}
                {/* <p>{props.note.text}</p> */}
                {/* 33) the above changes to this */}
                {/* <h4>{this.state.note.text}</h4> */}
                {editingTemp}
            </div>
        )
    }
}
