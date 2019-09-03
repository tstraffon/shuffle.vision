import React, {Component} from 'react';

class SubmitBeatForm extends Component {
    
    render(){
        return(
            <div className= "submit-beat-container">
                <form>

                    <div className="submit-beat-row">
                        <div className="submit-beat-element-2row">
                            <label>
                                Title:
                                <input type="text" name="title"></input>
                            </label>
                        </div>
                        <div className="submit-beat-element-2row">
                            <label>
                                Producer:
                                <input type="text" name="producer"></input>
                            </label>
                        </div>
                    </div>

                    <div className="submit-beat-row">
                        <div className="submit-beat-element-3row">
                            <label>
                                BPM:
                                <input type="text" name="title"></input>
                            </label>
                        </div>
                        <div className="submit-beat-element-3row">
                            <label>
                                Length:
                                <input type="text" name="length"></input>
                            </label>
                        </div>
                        <div className="submit-beat-element-3row">
                            <label>
                                Genre:
                                <input type="text" name="genre"></input>
                            </label>
                         </div>
                    </div>      
                                  
                    <div className="submit-beat-row">

                         <div className="submit-beat-element-2row">
                            <label>
                                Loop:
                                <input type="text" name="loop"></input>
                            </label>
                         </div>
                         <div className="submit-beat-element-2row">
                            <label>
                                Samples:
                                <input type="text" name="samples"></input>
                            </label>  
                        </div>
                    </div> 

                    <div className="submit-beat-row">
                        <div className="submit-beat-element-2row">               
                            <label>
                                Lease:
                                <input type="text" name="lease"></input>
                            </label>   
                        </div>
                        <div className="submit-beat-element-2row">               
                            <label>
                                Exclusive:
                                <input type="text" name="exclusive"></input>
                            </label>      
                        </div>    
                    </div>
                    <div className="submit-beat-row">
                        <div className="submit-beat-element-2row">               
                            <label>
                                Import:
                                <input type="text" name="lease"></input>
                            </label>   
                        </div>  
                    </div>
                    <div>
                         <input type="submit" value="Submit" />
                    </div>
                </form>

            </div>
        );

    }  

}
export default SubmitBeatForm; 
